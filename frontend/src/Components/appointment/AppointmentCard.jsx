import React from 'react';

const AppointmentCard = ({ appointment, onCancel, onConfirm, onStart, onComplete }) => {
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
          <a
            href={appointment.zoomJoinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            Tham gia khám online
          </a>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
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

        {canStart && (
          <button
            onClick={() => onStart(appointment.id)}
            className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
          >
            Bắt đầu khám
          </button>
        )}

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