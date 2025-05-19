import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AppointmentCard = ({ appointment, role }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
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

  const handleCancel = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này?")) {
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/appointments/${appointment.id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Lịch hẹn đã được hủy thành công.");
      navigate(0); // Refresh trang
    } catch (err) {
      console.error("Lỗi hủy lịch hẹn:", err);
      alert("Đã xảy ra lỗi khi hủy lịch hẹn. Vui lòng thử lại sau.");
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "IN_PROGRESS":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "SCHEDULED":
        return "Đã xác nhận";
      case "IN_PROGRESS":
        return "Đang diễn ra";
      case "COMPLETED":
        return "Đã hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const isPast = new Date(appointment.appointmentTime) < new Date();
  const canCancel = !isPast && (appointment.status === "PENDING" || appointment.status === "SCHEDULED");
  
  // Extract consultation type and symptoms from notes
  const consultationType = appointment.notes?.includes("Khám trực tiếp") ? "Khám trực tiếp" : 
                           appointment.notes?.includes("Khám online") ? "Khám online" : 
                           "Không xác định";
  
  // Try to extract symptoms from notes
  let symptoms = "";
  if (appointment.notes) {
    const symptomsMatch = appointment.notes.match(/Triệu chứng: (.*?)(?:\n|$)/);
    if (symptomsMatch && symptomsMatch[1]) {
      symptoms = symptomsMatch[1];
    }
  }

  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm border ${
      isPast ? 'border-gray-100' : 'border-l-4 ' + getStatusClass(appointment.status)
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {role === "PATIENT" ? "Bác sĩ" : "Bệnh nhân"}
          </p>
          <p className="text-base font-semibold">
            {role === "PATIENT" ? appointment.doctor.username : appointment.patient.username}
          </p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusClass(appointment.status)}`}>
          {getStatusText(appointment.status)}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-sm font-medium text-gray-500">Thời gian</p>
          <p className="text-sm">
            {formatDate(appointment.appointmentTime)}
          </p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-500">Hình thức</p>
          <p className="text-sm">{consultationType}</p>
        </div>
      </div>
      
      {symptoms && (
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-500">Triệu chứng</p>
          <p className="text-sm text-gray-700 line-clamp-2">{symptoms}</p>
        </div>
      )}
      
      {consultationType === "Khám online" && (appointment.status === "SCHEDULED" || appointment.status === "IN_PROGRESS") && (
        <div className="mb-4 bg-blue-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-700 mb-1">Liên kết Google Meet</p>
          <a 
            href="https://meet.google.com/hqd-yzpu-hug" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              <path d="M14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
            </svg>
            Tham gia cuộc họp
          </a>
        </div>
      )}
      
      <div className="flex justify-between mt-4">
        <button 
          onClick={() => alert("Chức năng xem chi tiết lịch hẹn đang được phát triển")}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Xem chi tiết
        </button>
        
        {canCancel && (
          <button 
            onClick={handleCancel}
            className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded-md text-sm font-medium transition-colors"
          >
            Hủy lịch hẹn
          </button>
        )}
        
        {appointment.status === "IN_PROGRESS" && (
          <button 
            onClick={() => alert("Chức năng kết thúc lịch hẹn đang được phát triển")}
            className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1 rounded-md text-sm font-medium transition-colors"
          >
            Kết thúc
          </button>
        )}
        
        {appointment.status === "COMPLETED" && (
          <button 
            onClick={() => alert("Chức năng đánh giá đang được phát triển")}
            className="bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1 rounded-md text-sm font-medium transition-colors"
          >
            Đánh giá
          </button>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;