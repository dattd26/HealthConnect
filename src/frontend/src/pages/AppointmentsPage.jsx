import React, { useState, useEffect } from "react";
import axios from "axios";
import AppointmentsList from "../Components/AppointmentsList";
import CreateAppointment from "../Components/CreateAppointment";
import { useNavigate } from "react-router-dom";
import "../Components/style.css"
const AppointmentsPage = () => {
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState("");
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(response.data.id);
        setRole(response.data.role);

        if (response.data.role === "PATIENT") {
          const doctorsResponse = await axios.get("http://localhost:8080/api/users/doctors", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setDoctors(doctorsResponse.data);
        }
      } catch (err) {
        console.error("Lỗi tải thông tin người dùng:", err);
      }
    };
    fetchUserData();
  }, []);

  if (!userId) return <p>Đang tải...</p>;

  return (
    <div className="appointments-page">
      <h1>Quản lý lịch hẹn</h1>
      {role === "PATIENT" && <CreateAppointment doctors={doctors} />}
      <AppointmentsList userId={userId} role={role} />
    </div>
  );
};

export default AppointmentsPage;