import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PaymentForm from '../Components/payment/PaymentForm';
import { config } from '../config/config.js';
import './PaymentPage.css';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { appointmentId } = useParams(); // Lấy appointmentId từ URL
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Nếu có appointmentId từ URL, gọi API để lấy thông tin
        if (appointmentId) {
          const token = localStorage.getItem('token');
          const response = await fetch(`${config.API_BASE_URL}/appointments/${appointmentId}/payment-info`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error('Không thể lấy thông tin cuộc hẹn');
          }

          const appointmentData = await response.json();
          setAppointment(appointmentData);
        } else if (location.state?.appointment) {
          // Fallback: lấy từ state
          setAppointment(location.state.appointment);
        } else {
          // Fallback: lấy từ localStorage
          const pendingAppointment = localStorage.getItem('pendingAppointment');
          if (pendingAppointment) {
            try {
              const appointmentData = JSON.parse(pendingAppointment);
              setAppointment(appointmentData);
            } catch (error) {
              console.error('Error parsing pending appointment:', error);
              setError('Dữ liệu cuộc hẹn không hợp lệ');
            }
          } else {
            setError('Không tìm thấy thông tin cuộc hẹn');
          }
        }
      } catch (err) {
        console.error('Error fetching appointment data:', err);
        setError(err.message || 'Không thể tải thông tin cuộc hẹn');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentData();
  }, [appointmentId, location.state]);

  const handlePaymentSuccess = (payment) => {
    console.log('Payment successful:', payment);
    // Xóa thông tin lịch hẹn tạm thời
    localStorage.removeItem('pendingAppointment');
    // Chuyển đến trang thành công
    navigate('/payment-success', { 
      state: { 
        appointment: appointment,
        payment: payment 
      } 
    });
  };

  const handlePaymentCancel = () => {
    // Xóa thông tin lịch hẹn tạm thời
    localStorage.removeItem('pendingAppointment');
    // Chuyển về trang dashboard hoặc danh sách cuộc hẹn
    navigate('/patient-dashboard');
  };

  if (loading) {
    return (
      <div className="payment-page">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
          </div>
          <p>Đang tải thông tin lịch hẹn...</p>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="payment-page">
        <div className="error-container">
          <div className="error-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" fill="#fef2f2"/>
              <path d="M15 9L9 15M9 9L15 15" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2>Không tìm thấy thông tin lịch hẹn</h2>
          <p>{error || 'Vui lòng quay lại trang dashboard để thực hiện lại.'}</p>
          <button 
            onClick={() => navigate('/patient-dashboard')}
            className="btn-back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Quay lại Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <div className="header-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#dbeafe"/>
              <path d="M2 17L12 22L22 17" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1>Thanh toán lịch hẹn khám bệnh</h1>
          <p>Vui lòng hoàn tất thanh toán để xác nhận lịch hẹn của bạn</p>
        </div>

        <div className="appointment-summary-card">
          <div className="summary-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#10b981" strokeWidth="2" fill="#ecfdf5"/>
            </svg>
            <h3>Thông tin lịch hẹn</h3>
          </div>
          <div className="summary-grid">
            <div className="summary-item">
              <div className="item-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L19.7071 9.70711C19.8946 9.89464 20 10.149 20 10.4142V19C20 20.1046 19.1046 21 18 21H17Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="label">Mã lịch hẹn:</span>
              <span className="value">#{appointment.appointmentId || appointment.id || 'N/A'}</span>
            </div>
            <div className="summary-item">
              <div className="item-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#6b7280" strokeWidth="2"/>
                  <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="#6b7280" strokeWidth="2"/>
                </svg>
              </div>
              <span className="label">Bác sĩ:</span>
              <span className="value">{appointment.doctorName || 'N/A'}</span>
            </div>
            <div className="summary-item">
              <div className="item-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#6b7280" strokeWidth="2"/>
                  <line x1="16" y1="2" x2="16" y2="6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="8" y1="2" x2="8" y2="6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="3" y1="10" x2="21" y2="10" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="label">Ngày khám:</span>
              <span className="value">
                {appointment.date ? new Date(appointment.date).toLocaleDateString('vi-VN') : 'N/A'}
              </span>
            </div>
            <div className="summary-item">
              <div className="item-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#6b7280" strokeWidth="2"/>
                  <polyline points="12,6 12,12 16,14" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="label">Giờ khám:</span>
              <span className="value">
                {appointment.time ? new Date(`2000-01-01T${appointment.time}`).toLocaleTimeString('vi-VN', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }) : 'N/A'}
              </span>
            </div>
            <div className="summary-item">
              <div className="item-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="label">Trạng thái:</span>
              <span className="value status">
                {appointment.status === 'PENDING_PAYMENT' ? 'Chờ thanh toán' : appointment.status}
              </span>
            </div>
          </div>
        </div>

        <PaymentForm 
          appointment={appointment}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentCancel={handlePaymentCancel}
        />
      </div>
    </div>
  );
};

export default PaymentPage;
