import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentForm from '../Components/payment/PaymentForm';
import './PaymentPage.css';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy thông tin lịch hẹn từ state hoặc localStorage
    if (location.state?.appointment) {
      setAppointment(location.state.appointment);
      setLoading(false);
    } else {
      // Fallback: lấy từ localStorage
      const pendingAppointment = localStorage.getItem('pendingAppointment');
      if (pendingAppointment) {
        try {
          const appointmentData = JSON.parse(pendingAppointment);
          setAppointment(appointmentData);
        } catch (error) {
          console.error('Error parsing pending appointment:', error);
        }
      }
      setLoading(false);
    }
  }, [location.state]);

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
    // Chuyển về trang đặt lịch
    navigate('/book-appointment');
  };

  if (loading) {
    return (
      <div className="payment-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin lịch hẹn...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="payment-page">
        <div className="error-container">
          <div className="error-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h2>Không tìm thấy thông tin lịch hẹn</h2>
          <p>Vui lòng quay lại trang đặt lịch để thực hiện lại.</p>
          <button 
            onClick={() => navigate('/book-appointment')}
            className="btn-back"
          >
            Quay lại đặt lịch
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>Thanh toán lịch hẹn khám bệnh</h1>
          <p>Vui lòng hoàn tất thanh toán để xác nhận lịch hẹn của bạn</p>
        </div>

        <div className="appointment-summary-card">
          <h3>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Thông tin lịch hẹn
          </h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="label">Mã lịch hẹn:</span>
              <span className="value">#{appointment.id || 'N/A'}</span>
            </div>
            <div className="summary-item">
              <span className="label">Bác sĩ:</span>
              <span className="value">{appointment.doctorName || appointment.doctor?.name || 'N/A'}</span>
            </div>
            <div className="summary-item">
              <span className="label">Chuyên khoa:</span>
              <span className="value">{appointment.specialty || appointment.doctor?.specialty || 'N/A'}</span>
            </div>
            <div className="summary-item">
              <span className="label">Ngày khám:</span>
              <span className="value">
                {appointment.date ? new Date(appointment.date).toLocaleDateString('vi-VN') : 'N/A'}
              </span>
            </div>
            <div className="summary-item">
              <span className="label">Giờ khám:</span>
              <span className="value">{appointment.startTime || 'N/A'}</span>
            </div>
            <div className="summary-item">
              <span className="label">Hình thức:</span>
              <span className="value">
                {appointment.consultationType === 'online' ? 'Khám online' : 'Khám trực tiếp'}
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
