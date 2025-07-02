import React, { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';
import { getSignature } from '../services/zoomService';
import { appointmentService } from '../services/appointmentService';
import { AuthContext } from '../context/AuthContext';
import '../styles/zoom.css';

const AppointmentMeetingPage = () => {
  const { appointmentId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // State management
  const [appointment, setAppointment] = useState(null);
  const [inMeeting, setInMeeting] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [meetingStats, setMeetingStats] = useState({
    joinTime: null,
    leaveTime: null,
    duration: 0,
    participantCount: 0,
    maxParticipants: 0,
    screenShareCount: 0,
    chatMessages: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [audioVideo, setAudioVideo] = useState({ audio: true, video: true });
  const [sidebarVisible, setSidebarVisible] = useState(true);
  
  // Refs
  const zoomDivRef = useRef(null);
  const zmClientRef = useRef(null);
  const statsIntervalRef = useRef(null);

  // Fetch appointment data
  useEffect(() => {
    const fetchAppointment = async () => {
      setIsLoading(true);
      try {
        const data = await appointmentService.getAppointmentById(appointmentId);
        setAppointment(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch appointment', err);
        setError('Không thể tải thông tin cuộc hẹn. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointment();
  }, [appointmentId]);

  // Update meeting statistics
  const updateMeetingStats = useCallback(() => {
    if (inMeeting && meetingStats.joinTime) {
      const now = new Date();
      const duration = Math.floor((now - meetingStats.joinTime) / 1000);
      setMeetingStats(prev => ({ ...prev, duration }));
    }
  }, [inMeeting, meetingStats.joinTime]);

  // Start stats tracking
  useEffect(() => {
    if (inMeeting) {
      statsIntervalRef.current = setInterval(updateMeetingStats, 1000);
    } else {
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current);
      }
    }
    return () => {
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current);
      }
    };
  }, [inMeeting, updateMeetingStats]);

  // Save meeting statistics to backend
  const saveMeetingStats = async (stats) => {
    try {
      await appointmentService.updateMeetingStats(appointmentId, {
        ...stats,
        userId: user?.id,
        appointmentId
      });
    } catch (error) {
      console.error('Failed to save meeting stats:', error);
    }
  };

  // Start meeting function
  const startMeeting = async () => {
    if (!appointment) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const meetingNumber = appointment.zoomMeetingId;
      const password = appointment.zoomPassword;
      const role = user?.role === 'DOCTOR' ? 0 : 1;
      const token = localStorage.getItem('token');
      
      setConnectionStatus('connecting');
      const signature = await getSignature(meetingNumber, role, token);

      const client = ZoomMtgEmbedded.createClient();
      zmClientRef.current = client;

      // Enhanced client initialization
      client.init({
        debug: process.env.NODE_ENV === 'development',
        zoomAppRoot: zoomDivRef.current,
        language: 'vi-VN',
        customize: {
          toolbar: {
            buttons: [
              {
                text: 'Kết thúc cuộc gọi',
                className: 'CustomEndButton',
                onClick: () => leaveMeeting()
              }
            ]
          },
          meetingInfo: ['topic', 'host', 'mn', 'pwd', 'telPwd', 'invite', 'participant', 'dc', 'enctype'],
          video: { 
            viewSizes: { 
              default: { width: '100%', height: '100%' },
              ribbon: { width: 320, height: 180 }
            },
            popper: {
              disableDraggable: false
            }
          },
          chat: {
            customizeUI: true
          }
        },
      });

      // Join meeting
      await client.join({
        sdkKey: process.env.REACT_APP_ZOOM_SDK_KEY || 'q48VIOcOS7Wb6xCsjQI5bg',
        signature,
        meetingNumber,
        password,
        userName: user?.fullName || 'Khách',
      });

      // Set up event handlers
      setupEventHandlers(client);
      
      // Initialize meeting stats
      const joinTime = new Date();
      setMeetingStats(prev => ({
        ...prev,
        joinTime,
        participantCount: 1,
        maxParticipants: 1
      }));

      setInMeeting(true);
      setConnectionStatus('connected');
      
    } catch (error) {
      console.error('Error joining meeting', error);
      setError('Không thể tham gia cuộc họp. Vui lòng kiểm tra kết nối mạng và thử lại.');
      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Setup event handlers
  const setupEventHandlers = (client) => {
    // Participant events
    client.on('user-added', (payload) => {
      if (!payload || !payload.userId) return;
      setParticipants(prev => {
        const newParticipants = [...prev, payload];
        setMeetingStats(prevStats => ({
          ...prevStats,
          participantCount: newParticipants.length,
          maxParticipants: Math.max(prevStats.maxParticipants, newParticipants.length)
        }));
        return newParticipants;
      });
    });

    client.on('user-removed', (payload) => {
      if (!payload || !payload.userId) return;
      setParticipants(prev => {
        const newParticipants = prev.filter(p => p.userId !== payload.userId);
        setMeetingStats(prevStats => ({
          ...prevStats,
          participantCount: newParticipants.length
        }));
        return newParticipants;
      });
    });

    client.on('user-updated', (payload) => {
      if (!payload || !payload.userId) return;
      setParticipants(prev => 
        prev.map(p => p.userId === payload.userId ? payload : p)
      );
    });

    // Meeting events
    client.on('meeting-ended', () => {
      handleMeetingEnd();
    });

    client.on('connection-change', (payload) => {
      setConnectionStatus(payload.status);
    });

    // Chat events
    client.on('chat-on-message', () => {
      setMeetingStats(prev => ({
        ...prev,
        chatMessages: prev.chatMessages + 1
      }));
    });

    // Screen share events
    client.on('active-share-change', (payload) => {
      if (payload.state === 'active') {
        console.log('Screen share active');
        setMeetingStats(prev => ({
          ...prev,
          screenShareCount: prev.screenShareCount + 1
        }));
      }
    });

    // Audio/Video events
    client.on('audio-change', (payload) => {
      setAudioVideo(prev => ({ ...prev, audio: payload.audio }));
    });

    client.on('video-change', (payload) => {
      setAudioVideo(prev => ({ ...prev, video: payload.video }));
    });
  };

  // Leave meeting function
  const leaveMeeting = async () => {
    if (zmClientRef.current) {
      try {
        await zmClientRef.current.leaveMeeting();
        handleMeetingEnd();
      } catch (error) {
        console.error('Error leaving meeting:', error);
      }
    }
  };

  // Handle meeting end
  const handleMeetingEnd = async () => {
    const leaveTime = new Date();
    const finalStats = {
      ...meetingStats,
      leaveTime,
      duration: meetingStats.joinTime ? Math.floor((leaveTime - meetingStats.joinTime) / 1000) : 0
    };
    
    setMeetingStats(finalStats);
    await saveMeetingStats(finalStats);
    
    setInMeeting(false);
    setConnectionStatus('disconnected');
    
    // Navigate back or show summary
    setTimeout(() => {
      navigate('/appointments');
    }, 3000);
  };

  // Format duration
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Format date for appointment
  const formatAppointmentDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Connection status indicator
  const ConnectionStatus = () => (
    <div className={`connection-status ${connectionStatus}`}>
      <div className="status-indicator"></div>
      <span>
        {connectionStatus === 'connected' && 'Đã kết nối'}
        {connectionStatus === 'connecting' && 'Đang kết nối...'}
        {connectionStatus === 'disconnected' && 'Chưa kết nối'}
        {connectionStatus === 'error' && 'Lỗi kết nối'}
      </span>
    </div>
  );

  // Meeting controls
  const MeetingControls = () => (
    <div className="meeting-controls">
      <button 
        className="btn btn-circle" 
        onClick={() => setSidebarVisible(!sidebarVisible)}
        title={sidebarVisible ? "Ẩn danh sách" : "Hiện danh sách"}
      >
        <span>{sidebarVisible ? '→' : '←'}</span>
      </button>
      
      <button 
        className="btn btn-danger" 
        onClick={leaveMeeting}
        title="Kết thúc cuộc gọi"
      >
        <span>Kết thúc</span>
      </button>
    </div>
  );

  // Loading state
  if (isLoading && !appointment) {
    return (
      <div className="zoom-wrapper loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin cuộc hẹn...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="zoom-wrapper error">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Có lỗi xảy ra</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="zoom-wrapper error">
        <div className="error-container">
          <h3>Không tìm thấy cuộc hẹn</h3>
          <button className="btn btn-primary" onClick={() => navigate('/appointments')}>
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`zoom-wrapper ${inMeeting ? 'in-meeting' : ''}`}>
      {/* Header */}
      <header className="zoom-header">
        <div className="appointment-info">
          <h2>
            {user?.role === 'DOCTOR' 
              ? `Cuộc hẹn với ${appointment.patientName || 'Bệnh nhân'}`
              : `Cuộc hẹn với ${appointment.doctorName || 'Bác sĩ'}`
            }
          </h2>
          <div className="appointment-details">
            <span className="appointment-time">
              <i className="fas fa-calendar-alt"></i> {formatAppointmentDate(appointment.scheduledTime)}
            </span>
            <span className="appointment-duration">
              <i className="fas fa-clock"></i> {appointment.duration || 30} phút
            </span>
            {appointment.appointmentType && (
              <span className="appointment-type">
                <i className="fas fa-stethoscope"></i> {appointment.appointmentType}
              </span>
            )}
          </div>
        </div>
        <div className="header-actions">
          <ConnectionStatus />
          {inMeeting && <MeetingControls />}
        </div>
      </header>

      {/* Main content */}
      <div className="zoom-content-container">
        {/* Zoom meeting container */}
        <div ref={zoomDivRef} id="zoom-embed" className="zoom-embed" />
        {/* Pre-join screen */}
        {!inMeeting && !meetingStats.leaveTime && (
          <div className="zoom-prejoin">
            <div className="prejoin-content">
              <div className="medical-icon">
                <i className="fas fa-clinic-medical"></i>
              </div>
              <h3>Sẵn sàng tham gia cuộc hẹn khám bệnh trực tuyến</h3>
              <p className="prejoin-description">
                Đảm bảo camera và microphone đã được bật để có trải nghiệm tốt nhất
              </p>
              
              <div className="appointment-summary">
                <div className="summary-item">
                  <span className="summary-label">Bệnh nhân:</span>
                  <span className="summary-value">{appointment.patientName}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Bác sĩ:</span>
                  <span className="summary-value">{appointment.doctorName}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Thời gian:</span>
                  <span className="summary-value">{formatAppointmentDate(appointment.scheduledTime)}</span>
                </div>
                {appointment.notes && (
                  <div className="summary-item">
                    <span className="summary-label">Ghi chú:</span>
                    <span className="summary-value">{appointment.notes}</span>
                  </div>
                )}
              </div>

              <div className="prejoin-checklist">
                <h4>Danh sách kiểm tra</h4>
                <div className="checklist-item">
                  <span className="check">✓</span>
                  <span>Kiểm tra kết nối internet</span>
                </div>
                <div className="checklist-item">
                  <span className="check">✓</span>
                  <span>Chuẩn bị camera và microphone</span>
                </div>
                <div className="checklist-item">
                  <span className="check">✓</span>
                  <span>Tìm không gian yên tĩnh</span>
                </div>
                <div className="checklist-item">
                  <span className="check">✓</span>
                  <span>Chuẩn bị câu hỏi và triệu chứng</span>
                </div>
              </div>

              <button 
                className="btn btn-primary btn-join" 
                onClick={startMeeting}
                disabled={isLoading}
              >
                {isLoading ? 'Đang kết nối...' : <><i className="fas fa-video"></i> Tham gia cuộc hẹn</>}
              </button>
            </div>
          </div>
        )}

        {/* Active meeting container */}
        {inMeeting && (
          <div className="meeting-layout">
            <div className={`main-meeting-area ${!sidebarVisible ? 'full-width' : ''}`}>
              
              
              {/* Meeting controls overlay */}
              <div className="meeting-controls-overlay">
                <div className="meeting-stats">
                  <span className="time-stat"><i className="fas fa-clock"></i> {formatDuration(meetingStats.duration)}</span>
                  <span className="participants-stat"><i className="fas fa-users"></i> {participants.length}</span>
                  <span className={`audio-status ${audioVideo.audio ? 'on' : 'off'}`}>
                    <i className={`fas ${audioVideo.audio ? 'fa-microphone' : 'fa-microphone-slash'}`}></i>
                  </span>
                  <span className={`video-status ${audioVideo.video ? 'on' : 'off'}`}>
                    <i className={`fas ${audioVideo.video ? 'fa-video' : 'fa-video-slash'}`}></i>
                  </span>
                </div>
              </div>
            </div>

            {/* Participants sidebar */}
            {sidebarVisible && (
              <aside className="zoom-participants expanded">
                <div className="participants-header">
                  <h3><i className="fas fa-users"></i> Người tham gia ({participants.length})</h3>
                  <button 
                    className="toggle-btn"
                    onClick={() => setSidebarVisible(false)}
                    title="Ẩn danh sách"
                  >
                    →
                  </button>
                </div>
                
                <div className="participants-content">
                  <ul className="participants-list">
                    {participants.map((participant) => (
                      <li key={participant.userId} className="participant-item">
                        <div className="participant-info">
                          <span className="participant-name">
                            {participant.displayName}
                            {participant.userId === user?.id && ' (Bạn)'}
                          </span>
                          <div className="participant-status">
                            {participant.muted && <span className="status-icon muted"><i className="fas fa-microphone-slash"></i></span>}
                            {!participant.videoOn && <span className="status-icon video"><i className="fas fa-video-slash"></i></span>}
                            {participant.isHost && <span className="status-icon host"><i className="fas fa-crown"></i></span>}
                          </div>
                        </div>
                      </li>
                    ))}
                    {participants.length === 0 && (
                      <li className="no-participants">
                        <p>Chưa có người tham gia khác</p>
                      </li>
                    )}
                  </ul>
                  
                  <div className="meeting-info">
                    <h4><i className="fas fa-chart-bar"></i> Thống kê cuộc họp</h4>
                    <div className="stats-grid">
                      <div className="stat">
                        <span className="stat-number">{formatDuration(meetingStats.duration)}</span>
                        <span className="stat-label">Thời gian</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">{meetingStats.maxParticipants}</span>
                        <span className="stat-label">Số người tối đa</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">{meetingStats.chatMessages}</span>
                        <span className="stat-label">Tin nhắn</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">{meetingStats.screenShareCount}</span>
                        <span className="stat-label">Chia sẻ màn hình</span>
                      </div>
                    </div>
                  </div>

                  {user?.role === 'DOCTOR' && (
                    <div className="doctor-notes">
                      <h4><i className="fas fa-notes-medical"></i> Ghi chú bác sĩ</h4>
                      <textarea 
                        className="doctor-notes-input" 
                        placeholder="Nhập ghi chú về cuộc khám bệnh..."
                        rows={5}
                      ></textarea>
                      <button className="btn btn-secondary btn-sm">
                        <i className="fas fa-save"></i> Lưu ghi chú
                      </button>
                    </div>
                  )}
                </div>
              </aside>
            )}
          </div>
        )}

        {/* Meeting ended screen */}
        {!inMeeting && meetingStats.leaveTime && (
          <div className="meeting-ended">
            <div className="meeting-summary">
              <div className="summary-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3>Cuộc hẹn đã kết thúc</h3>
              
              <div className="summary-stats">
                <div className="stat-item">
                  <i className="fas fa-clock"></i>
                  <span className="stat-label">Thời gian:</span>
                  <span className="stat-value">{formatDuration(meetingStats.duration)}</span>
                </div>
                <div className="stat-item">
                  <i className="fas fa-users"></i>
                  <span className="stat-label">Số người tham gia tối đa:</span>
                  <span className="stat-value">{meetingStats.maxParticipants}</span>
                </div>
                <div className="stat-item">
                  <i className="fas fa-comments"></i>
                  <span className="stat-label">Tin nhắn chat:</span>
                  <span className="stat-value">{meetingStats.chatMessages}</span>
                </div>
                <div className="stat-item">
                  <i className="fas fa-desktop"></i>
                  <span className="stat-label">Chia sẻ màn hình:</span>
                  <span className="stat-value">{meetingStats.screenShareCount}</span>
                </div>
              </div>

              <div className="meeting-feedback">
                <h4>Đánh giá cuộc hẹn</h4>
                <div className="rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="star">★</span>
                  ))}
                </div>
                <textarea 
                  className="feedback-text" 
                  placeholder="Nhập phản hồi của bạn về cuộc hẹn..."
                  rows={3}
                ></textarea>
                <button className="btn btn-secondary">
                  <i className="fas fa-paper-plane"></i> Gửi đánh giá
                </button>
              </div>
              
              <div className="post-meeting-actions">
                <button className="btn btn-primary" onClick={() => navigate('/appointments')}>
                  <i className="fas fa-calendar-alt"></i> Xem danh sách cuộc hẹn
                </button>
                {user?.role !== 'DOCTOR' && (
                  <button className="btn btn-secondary" onClick={() => navigate('/book-appointment')}>
                    <i className="fas fa-plus-circle"></i> Đặt lịch hẹn mới
                  </button>
                )}
              </div>
              
              <p>Bạn sẽ được chuyển hướng về danh sách cuộc hẹn trong vài giây...</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="zoom-footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} HealthConnect - Hỗ trợ trực tuyến: <a href="mailto:support@healthconnect.com">support@healthconnect.com</a></p>
        </div>
      </footer>
    </div>
  );
};

export default AppointmentMeetingPage;