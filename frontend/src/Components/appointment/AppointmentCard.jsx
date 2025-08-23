import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style.css"
const AppointmentCard = ({ appointment, role }) => {
  const navigate = useNavigate();

  const handleCancel = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/appointments/${appointment.id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Lịch hẹn đã được hủy.");
      navigate(0); // Refresh trang
    } catch (err) {
      console.error("Lỗi hủy lịch hẹn:", err);
    }
  };

  return (
    <div className="appointment-card">
      <p>
        <strong>{role === "PATIENT" ? "Bác sĩ" : "Bệnh nhân"}:</strong>{" "}
        {role === "PATIENT" ? appointment.doctorName : appointment.patientName}
      </p>
      <p>
        <strong>Thời gian:</strong>{" "}
        {appointment.date} - {appointment.time}
      </p>
      <p>
        <strong>Trạng thái:</strong> {appointment.status}
      </p>
      {appointment.status === "WAITING" && (
        <button onClick={handleCancel}>Hủy lịch hẹn</button>
      )}
      {appointment.status === "CONFIRMED" && (
        <>
          <button onClick={handleCancel}>Kết thúc lịch hẹn</button>
          {appointment.zoomMeetingId && (
            <button 
              onClick={() => navigate(`/appointments/${appointment.id}/meeting`, { 
                state: { 
                  meetingId: appointment.zoomMeetingId,
                  role: role === "DOCTOR" ? 1 : 0,
                  zoomPassword: appointment.zoomPassword
                } 
              })}
              className="join-meeting-btn"
            >
              🎥 Tham gia cuộc họp
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default AppointmentCard;