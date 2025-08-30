import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';
const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:3000';
const AppointmentCard = ({ appointment, onCancel, onConfirm, onStart, onComplete, onPayment }) => {
  const [isDoctorJoined, setIsDoctorJoined] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const { token } = useAuth();

  // Hàm kiểm tra xem có gần đến thời gian khám không (trong vòng 15 phút)
  const isNearAppointmentTime = () => {
    if (!appointment.date || !appointment.time) return false;
    
    const appointmentDateTime = new Date(`${appointment.date} ${appointment.time}`);
    const now = new Date();
    const timeDiff = appointmentDateTime.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    
    // Hiển thị nút trong vòng 15 phút trước giờ khám và 2 giờ sau giờ khám
    return minutesDiff >= -15 && minutesDiff <= 120;
  };

  // Hàm kiểm tra xem cuộc hẹn có hết hạn chưa dựa trên endTime của slot
  const isAppointmentExpired = () => {
    if (!appointment.doctorSlot || !appointment.doctorSlot.endTime) return false;
    
    const endDateTime = new Date(`${appointment.date} ${appointment.doctorSlot.endTime}`);
    const now = new Date();
    
    // Cuộc hẹn hết hạn khi thời gian hiện tại vượt quá endTime
    return now > endDateTime;
  };

  // Hàm format thời gian đẹp hơn
  const formatAppointmentTime = () => {
    if (!appointment.date || !appointment.time) return '';
    
    const appointmentDateTime = new Date(`${appointment.date} ${appointment.time}`);
    const now = new Date();
    const timeDiff = appointmentDateTime.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    
    if (minutesDiff < 0) {
      // Đã qua giờ khám
      if (minutesDiff > -120) {
        return `Đang diễn ra (${Math.abs(Math.floor(minutesDiff))} phút trước)`;
      } else {
        return `Đã kết thúc (${Math.abs(Math.floor(minutesDiff))} phút trước)`;
      }
    } else if (minutesDiff < 60) {
      // Trong vòng 1 giờ
      return `Bắt đầu sau ${Math.floor(minutesDiff)} phút`;
    } else if (minutesDiff < 1440) {
      // Trong vòng 1 ngày
      const hours = Math.floor(minutesDiff / 60);
      const minutes = Math.floor(minutesDiff % 60);
      return `Bắt đầu sau ${hours} giờ ${minutes} phút`;
    } else {
      // Hơn 1 ngày
      const days = Math.floor(minutesDiff / 1440);
      return `Bắt đầu sau ${days} ngày`;
    }
  };

  // Kiểm tra trạng thái bác sĩ khi component mount và khi gần đến giờ khám
  useEffect(() => {
    if (appointment.id && isNearAppointmentTime() && !isDoctorJoined) {
      checkDoctorStatus();
      const interval = setInterval(checkDoctorStatus, 30000);
      return () => clearInterval(interval);
    }
  }, [appointment.id, isNearAppointmentTime()]);

  // Hàm kiểm tra xem bác sĩ đã tham gia chưa
  const checkDoctorStatus = async () => {
    if (!appointment.id) return;
    setIsCheckingStatus(true);
    try {
      const data = await appointmentService.checkDoctorStatus(appointment.id); // ✅ đã là body
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
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PAYMENT_PENDING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'NO_SHOW':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return 'Chờ thanh toán';
      case 'PAYMENT_PENDING':
        return 'Đã thanh toán, chờ xác nhận';
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'IN_PROGRESS':
        return 'Đang khám bệnh';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      case 'EXPIRED':
        return 'Hết hạn';
      case 'NO_SHOW':
        return 'Không tham gia';
      default:
        return status;
    }
  };

  const canCancel = ['PENDING_PAYMENT', 'PAYMENT_PENDING'].includes(appointment.status);
  const canConfirm = appointment.status === 'PAYMENT_PENDING';
  const canStart = appointment.status === 'CONFIRMED';
  const canComplete = appointment.status === 'IN_PROGRESS';
  const canPay = appointment.status === 'PENDING_PAYMENT';

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-800">
            {appointment.doctorName}
          </h3>
          <p className="text-sm text-gray-600">
            {appointment.date} - {appointment.time}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
          {getStatusText(appointment.status)}
        </span>
      </div>

      {appointment.notes && (
        <div className="mb-3">
          <p className="text-sm text-gray-700">{appointment.notes}</p>
        </div>
      )}

      {appointment.zoomJoinUrl && (
        <div className="mb-3">
          {isNearAppointmentTime() && !isAppointmentExpired() ? (
            isDoctorJoined ? (
              <a
                href={`${baseUrl}/appointments/${appointment.id}/meeting`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Tham gia khám online
              </a>
            ) : (
              <div className="inline-flex items-center px-3 py-2 bg-yellow-100 text-yellow-800 text-sm rounded-md border border-yellow-300">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {isCheckingStatus ? 'Đang kiểm tra...' : 'Bác sĩ chưa tham gia. Vui lòng chờ...'}
              </div>
            )
          ) : isAppointmentExpired() ? (
            <div className="inline-flex items-center px-3 py-2 bg-red-100 text-red-700 text-sm rounded-md border border-red-300">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cuộc hẹn đã kết thúc
            </div>
          ) : (
            <div className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-md">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatAppointmentTime()}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {canPay && (
          <button
            onClick={() => onPayment(appointment.id)}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Thanh toán
          </button>
        )}

        {canCancel && (
          <button
            onClick={() => onCancel(appointment.id)}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
          >
            Hủy lịch
          </button>
        )}

        {canConfirm && (
          <button
            onClick={() => onConfirm(appointment.id)}
            className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
          >
            Xác nhận
          </button>
        )}

        {/* {canStart && (
          <button
            onClick={() => onStart(appointment.id)}
            className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
          >
            Bắt đầu khám
          </button>
        )} */}

        {canComplete && (
          <button
            onClick={() => onComplete(appointment.id)}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            Hoàn thành
          </button>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;