import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import './AppointmentCardEnhanced.css';

const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:3000';

const AppointmentCardEnhanced = ({ appointment, onCancel, onConfirm, onStart, onComplete, onPayment }) => {
  const [isDoctorJoined, setIsDoctorJoined] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const { token } = useAuth();

  const isNearAppointmentTime = () => {
    if (!appointment.date || !appointment.time) return false;
    
    const appointmentDateTime = new Date(`${appointment.date} ${appointment.time}`);
    const now = new Date();
    // if (now.getDate() === appointmentDateTime.getDate()) {
    //   console.log(now.getTime());
    //   console.log(appointmentDateTime.getTime());
    // }
    const timeDiff = appointmentDateTime.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    return minutesDiff >= -30 && minutesDiff <= 120;
  };

  const isAppointmentExpired = () => {
    if (!appointment.doctorSlot || !appointment.doctorSlot.endTime) return false;
    
    const endDateTime = new Date(`${appointment.date} ${appointment.doctorSlot.endTime}`);
    const now = new Date();
    
    return now > endDateTime;
  };

  const formatAppointmentTime = () => {
    if (!appointment.date || !appointment.time) return '';
    
    const appointmentDateTime = new Date(`${appointment.date} ${appointment.time}`);
    const now = new Date();
    const timeDiff = appointmentDateTime.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    
    if (minutesDiff < 0) {
      if (minutesDiff > -120) {
        return `Đang diễn ra (${Math.abs(Math.floor(minutesDiff))} phút trước)`;
      } else {
        return `Đã kết thúc (${Math.abs(Math.floor(minutesDiff))} phút trước)`;
      }
    } else if (minutesDiff < 60) {
      return `Bắt đầu sau ${Math.floor(minutesDiff)} phút`;
    } else if (minutesDiff < 1440) {
      const hours = Math.floor(minutesDiff / 60);
      const minutes = Math.floor(minutesDiff % 60);
      return `Bắt đầu sau ${hours} giờ ${minutes} phút`;
    } else {
      const days = Math.floor(minutesDiff / 1440);
      return `Bắt đầu sau ${days} ngày`;
    }
  };

  useEffect(() => {
    if (appointment.id && isNearAppointmentTime() && !isDoctorJoined) {
      checkDoctorStatus();
      const interval = setInterval(checkDoctorStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [appointment.id, isNearAppointmentTime()]);

  const checkDoctorStatus = async () => {
    if (!appointment.id) return;
    setIsCheckingStatus(true);
    try {
      const data = await appointmentService.checkDoctorStatus(appointment.id);
      console.log(data);
      setIsDoctorJoined(Boolean(data?.isDoctorJoined));
    } catch (err) {
      console.error('Error checking doctor status:', err);
      setIsDoctorJoined(false);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return 'status-pending-payment';
      case 'PAYMENT_PENDING':
        return 'status-payment-pending';
      case 'CONFIRMED':
        return 'status-confirmed';
      case 'IN_PROGRESS':
        return 'status-in-progress';
      case 'COMPLETED':
        return 'status-completed';
      case 'CANCELLED':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return 'Chờ thanh toán';
      case 'PAYMENT_PENDING':
        return 'Đang xử lý thanh toán';
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'IN_PROGRESS':
        return 'Đang diễn ra';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'CONFIRMED':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" strokeWidth="2"/>
          </svg>
        );
      case 'IN_PROGRESS':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'COMPLETED':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" strokeWidth="2"/>
          </svg>
        );
      case 'CANCELLED':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2"/>
          </svg>
        );
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    if (!time) return '';
    return time;
  };

  const canPay = appointment.status === 'PENDING_PAYMENT';
  const canCancel = ['CONFIRMED', 'PENDING_PAYMENT'].includes(appointment.status);
  const canConfirm = appointment.status === 'PENDING_PAYMENT';
  const canStart = appointment.status === 'CONFIRMED' && isNearAppointmentTime();
  const canComplete = appointment.status === 'IN_PROGRESS';

  return (
    <div className="appointment-card-enhanced">
      <div className="card-header">
        <div className="status-badge">
          <span className={`status-icon ${getStatusColor(appointment.status)}`}>
            {getStatusIcon(appointment.status)}
          </span>
          <span className="status-text">{getStatusText(appointment.status)}</span>
        </div>
        <div className="appointment-id">#{appointment.id}</div>
      </div>

      <div className="card-content">
        <div className="doctor-info">
          <div className="doctor-avatar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2"/>
              <circle cx="12" cy="7" r="4" strokeWidth="2"/>
            </svg>
          </div>
          <div className="doctor-details">
            <h3 className="doctor-name-enhanced">{appointment.doctorName || 'Bác sĩ'}</h3>
            {/* <p className="specialty">{appointment.specialty || 'Chuyên khoa'}</p> */}
          </div>
        </div>

        <div className="appointment-details">
          <div className="detail-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2"/>
            </svg>
            <span>{formatDate(appointment.date)}</span>
          </div>
          
          <div className="detail-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{formatTime(appointment.time)}</span>
          </div>

          {appointment.symptoms && (
            <div className="detail-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" strokeWidth="2"/>
              </svg>
              <span>{appointment.symptoms}</span>
            </div>
          )}
        </div>

        {!isAppointmentExpired() && (
          <div className="time-remaining">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{formatAppointmentTime()}</span>
          </div>
        )}

        {appointment.notes && (
          <div className="notes">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2"/>
              <polyline points="14,2 14,8 20,8" strokeWidth="2"/>
              <line x1="16" y1="13" x2="8" y2="13" strokeWidth="2"/>
              <line x1="16" y1="17" x2="8" y2="17" strokeWidth="2"/>
              <polyline points="10,9 9,9 8,9" strokeWidth="2"/>
            </svg>
            <span>{appointment.notes}</span>
          </div>
        )}

        {/* Zoom meeting */}
        {appointment.zoomJoinUrl && (
          <div className="zoom-section">
            {isNearAppointmentTime() && !isAppointmentExpired() ? (
              isDoctorJoined ? (
                <a
                  href={`${baseUrl}/appointments/${appointment.id}/meeting`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="zoom-join-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeWidth="2"/>
                  </svg>
                  Tham gia khám online
                </a>
              ) : (
                <div className="zoom-waiting">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {isCheckingStatus ? 'Đang kiểm tra...' : 'Bác sĩ chưa tham gia. Vui lòng chờ...'}
                </div>
              )
            ) : isAppointmentExpired() ? (
              <div className="zoom-expired">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Cuộc hẹn đã kết thúc
              </div>
            ) : (
              <div className="zoom-countdown">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {formatAppointmentTime()}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="card-actions">
        {canPay && (
          <button
            onClick={() => onPayment(appointment.id)}
            className="action-btn payment-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" strokeWidth="2"/>
            </svg>
            Thanh toán
          </button>
        )}

        {canCancel && (
          <button
            onClick={() => onCancel(appointment.id)}
            className="action-btn cancel-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Hủy lịch
          </button>
        )}

        {canConfirm && (
          <button
            onClick={() => onConfirm(appointment.id)}
            className="action-btn confirm-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" strokeWidth="2"/>
            </svg>
            Xác nhận
          </button>
        )}

        {/* {canStart && (
          <button
            onClick={() => onStart(appointment.id)}
            className="action-btn start-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Bắt đầu khám
          </button>
        )} */}

        {canComplete && (
          <>
           {isDoctorJoined && (
            <a
                  href={`${baseUrl}/appointments/${appointment.id}/meeting`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="zoom-join-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeWidth="2"/>
                  </svg>
                  Tham gia lại
                </a>
           )}
            <button
              onClick={() => onComplete(appointment.id)}
              className="action-btn complete-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" strokeWidth="2"/>
              </svg>
              Hoàn thành
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AppointmentCardEnhanced;
