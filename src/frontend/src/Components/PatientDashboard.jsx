// PatientDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(response.data);
      } catch (err) {
        console.error("Lỗi tải lịch hẹn:", err);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="dashboard">
      <h1>Chào mừng bạn trở lại!</h1>
      <button onClick={() => navigate("/book-appointment")}>Đặt lịch mới</button>
      
      <div className="appointments-list">
        <h3>Lịch hẹn sắp tới:</h3>
        {appointments.map((appointment) => (
          <div key={appointment.id} className="appointment-card">
            <p>Bác sĩ: {appointment.doctorName}</p>
            <p>Thời gian: {appointment.time}</p>
            <button onClick={() => navigate(`/video-call/${appointment.id}`)}>
              Tham gia tư vấn
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientDashboard;