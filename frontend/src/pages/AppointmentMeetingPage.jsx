import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ZoomMtg } from '@zoom/meetingsdk';
import { getSignature } from '../services/zoomService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../Components/common/LoadingSpinner';
import axios from 'axios';

import '../styles/zoom.css';

ZoomMtg.setZoomJSLib('https://source.zoom.us/3.13.1/lib', '/av');

const AppointmentMeetingPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();
  
  const [meetingId, setMeetingId] = useState(location.state?.meetingId || appointmentId);
  const [role, setRole] = useState(location.state?.role || 0);
  const [zoomPassword, setZoomPassword] = useState(location.state?.zoomPassword || '');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meetingState, setMeetingState] = useState('initializing');
  const [isZoomReady, setIsZoomReady] = useState(false);
  const [isDOMReady, setIsDOMReady] = useState(false);  
  // const zoomContainerRef = useRef(null);
  const [signature, setSignature] = useState('');

  useEffect(() => {
    const fetchAppointmentInfo = async () => {
      const response = await axios.get(`http://localhost:8080/api/appointments/${appointmentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setMeetingId(response.data.zoomMeetingId);
      setZoomPassword(response.data.zoomPassword);
      setIsLoading(false);
    };
    setRole(localStorage.getItem('role') === 'DOCTOR' ? 1 : 0);
    setTimeout(fetchAppointmentInfo, 1000);
  }, [appointmentId, token]);



  //configuration
  const zoomConfig = {
    sdkKey: 'q48VIOcOS7Wb6xCsjQI5bg', //process.env.REACT_APP_ZOOM_API_KEY || 
    meetingNumber: meetingId,
    userName: user?.name || 'User',
    passWord: zoomPassword, 
    role: 0, // 0 tham gia, 1 host
    signature: '',
    leaveUrl: '/', 
  };


  const setupZoomEventListeners = () => {
    if (!isZoomReady || !isDOMReady) return;
    
    // Kiểm tra xem DOM element đã tồn tại chưa
    const zoomContainer = document.getElementById('zmmtg-root');
    if (!zoomContainer) {
      console.warn('Zoom container not found, retrying in 100ms...');
      setTimeout(setupZoomEventListeners, 100);
      return;
    }
    
    try {
      ZoomMtg.inMeetingServiceListener('onMeetingStatus', (data) => {
        console.log('Meeting status changed:', data);
        setMeetingState(data.meetingStatus);
      });

      ZoomMtg.inMeetingServiceListener('onParticipantJoin', (data) => {
        console.log('Participant joined:', data);
      });

      ZoomMtg.inMeetingServiceListener('onParticipantLeave', (data) => {
        console.log('Participant left:', data);
      });

      ZoomMtg.inMeetingServiceListener('onMeetingError', (data) => {
        console.error('Meeting error:', data);
        setError('Meeting error occurred');
      });
      
      console.log('Zoom event listeners setup completed');
    } catch (error) {
      console.error('Error setting up Zoom event listeners:', error);
    }
  };

  // Initialize Zoom Meeting
  const initZoomMeeting = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
    
      const fallbackToken = token || localStorage.getItem('token');
      if (!fallbackToken) {
        throw new Error('No valid token available');
      }
      
      // Get signature from backend
      const sig = await getSignature(meetingId, role, fallbackToken);
      if (!sig) {
        throw new Error('Failed to get meeting signature');
      }

      setSignature(sig);
      
      // Initialize Zoom Meeting
      ZoomMtg.init({
        leaveUrl: zoomConfig.leaveUrl,
        success: (success) => {
          console.log('Zoom Meeting initialized successfully:', success);
          setIsZoomReady(true);
          joinMeeting(sig);
        },
        error: (error) => {
          console.error('Zoom Meeting initialization failed:', error);
          setError('Failed to initialize Zoom meeting');
          setIsLoading(false);
        }
      });
    } catch (err) {
      console.error('Error initializing Zoom meeting:', err);
      setError(err.message || 'Failed to initialize meeting');
      setIsLoading(false);
    }
  };

  // Join Zoom Meeting
  const joinMeeting = (sig) => {
    console.log('Joining meeting:', zoomConfig.meetingNumber, zoomConfig.passWord);
    console.log('signature:', signature);
    ZoomMtg.join({
      signature: sig,
      meetingNumber: meetingId,
      userName: user?.fullName,
      sdkKey: 'q48VIOcOS7Wb6xCsjQI5bg',
      passWord: zoomPassword,
      // role: zoomConfig.role,
      success: (success) => {
        console.log('Joined meeting successfully:', success);
        setMeetingState('joined');
        setIsLoading(false);
      },
      error: (error) => {
        console.error('Failed to join meeting:', error);
        setError('Failed to join meeting');
        setIsLoading(false);
      }
    });
  };

  // Setup event listeners when Zoom is ready
  useLayoutEffect(() => {
    if (isZoomReady && isDOMReady) {
      setupZoomEventListeners();
    }
  }, [isZoomReady, isDOMReady]);

  // Mark DOM as ready after component mounts
  useEffect(() => {
    // Delay nhỏ để đảm bảo DOM hoàn toàn sẵn sàng
    const timer = setTimeout(() => {
      setIsDOMReady(true);
      console.log('DOM marked as ready');
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading || isZoomReady) return;
    console.log('Current token from context:', token);
    console.log('Current user from context:', user);
    console.log('Meeting ID:', meetingId);
    
    // Fallback: nếu token từ context bị undefined, thử lấy từ localStorage
    const fallbackToken = token || localStorage.getItem('token');
    console.log('Fallback token:', fallbackToken);
    
    if (!meetingId || !user || !fallbackToken) {
      setError('Missing required meeting information');
      setIsLoading(false);
      return;
    }

    // Initialize meeting
    initZoomMeeting();

  }, [meetingId, user, token, isLoading]);


  if (isLoading) {
    return (
      <div className="zoom-loading">
        <LoadingSpinner size="large" color="blue" />
        <p className="zoom-loading-message">Đang khởi tạo cuộc họp Zoom...</p>
        <p className="text-sm text-gray-500 mt-2">Vui lòng chờ trong khi chúng tôi kết nối bạn đến cuộc họp</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="zoom-error">
        <div className="zoom-error-icon">⚠️</div>
        <h2 className="text-2xl font-bold mb-4">Lỗi Cuộc Họp</h2>
        <p className="zoom-error-message">{error}</p>
        <button
          onClick={() => navigate('/appointments')}
          className="zoom-retry-button"
        >
          Quay Lại Lịch Hẹn
        </button>
      </div>
    );
  }

  return (
    <>
    
      <div id="zmmtg-root" />
    </>
  );
};

export default AppointmentMeetingPage;
