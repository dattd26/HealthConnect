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
        {new Date(appointment.date).toLocaleString()} - {new Date(appointment.time).toLocaleString()}
      </p>
      <p>
        <strong>Trạng thái:</strong> {appointment.status}
      </p>
      <p>
        <strong>Google Meet:</strong> <a href="https://meet.google.com/hqd-yzpu-hug" target="_blank" rel="noopener noreferrer">https://meet.google.com/hqd-yzpu-hug</a>
      </p>
      {appointment.status === "WAITING" && (
        <button onClick={handleCancel}>Hủy lịch hẹn</button>
      )}
      {appointment.status === "CONFIRMED" && (
        <button onClick={handleCancel}>Kết thúc lịch hẹn</button>
      )}
    </div>
  );
};

export default AppointmentCard;