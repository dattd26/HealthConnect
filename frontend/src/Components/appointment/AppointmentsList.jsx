import React, { useEffect, useState } from "react";
import axios from "axios";
import AppointmentCard from "./AppointmentCard";
import "../style.css"
const AppointmentsList = ({ userId, role }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const endpoint = role === "PATIENT" 
          ? `/api/appointments/patient/${userId}`
          : `/api/appointments/doctor/${userId}`;
        
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(response.data);
      } catch (err) {
        console.error("Lỗi tải lịch hẹn:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [userId, role]);

  if (loading) return <p>Đang tải lịch hẹn...</p>;

  return (
    <div className="appointments-list">
      <h2>{role === "PATIENT" ? "Lịch hẹn của bạn" : "Lịch hẹn với bệnh nhân"}</h2>
      {appointments.length === 0 ? (
        <p>Không có lịch hẹn nào.</p>
      ) : (
        appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            role={role}
          />
        ))
      )}
    </div>
  );
};

export default AppointmentsList;