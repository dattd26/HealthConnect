// PatientDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css"

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch appointments
        const appointmentsResponse = await axios.get("http://localhost:8080/api/appointments", { headers });
        setAppointments(appointmentsResponse.data);

        // Fetch user info
        const userResponse = await axios.get("http://localhost:8080/api/user/profile", { headers });
        setUserInfo(userResponse.data);

        // Calculate stats
        setStats({
          totalAppointments: appointmentsResponse.data.length,
          upcomingAppointments: appointmentsResponse.data.filter(app => new Date(app.time) > new Date()).length,
          completedAppointments: appointmentsResponse.data.filter(app => new Date(app.time) < new Date()).length
        });

      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      }
    };
    fetchData();
  }, []);

  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="user-welcome">
          <h1>Xin chào, {userInfo.fullName}!</h1>
          <p>Chúc bạn một ngày tốt lành</p>
        </div>
        <div className="quick-actions">
          <button className="primary-btn" onClick={() => navigate("/book-appointment")}>
            <i className="fas fa-plus"></i> Đặt lịch mới
          </button>
          <button className="secondary-btn" onClick={() => navigate("/medical-records")}>
            <i className="fas fa-folder"></i> Hồ sơ bệnh án
          </button>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h4>Tổng số lịch hẹn</h4>
          <p>{stats.totalAppointments}</p>
        </div>
        <div className="stat-card">
          <h4>Lịch hẹn sắp tới</h4>
          <p>{stats.upcomingAppointments}</p>
        </div>
        <div className="stat-card">
          <h4>Đã hoàn thành</h4>
          <p>{stats.completedAppointments}</p>
        </div>
      </div>
      
      <div className="appointments-section">
        <div className="section-header">
          <h3>Lịch hẹn sắp tới</h3>
          <button className="view-all-btn" onClick={() => navigate("/appointments")}>
            Xem tất cả
          </button>
        </div>

        <div className="appointments-list">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-status">
                {new Date(appointment.time) > new Date() ? 
                  <span className="status upcoming">Sắp tới</span> : 
                  <span className="status completed">Đã hoàn thành</span>
                }
              </div>
              <div className="appointment-details">
                <h4>Cuộc hẹn với BS. {appointment.doctorName}</h4>
                <p className="specialty">{appointment.specialty}</p>
                <p className="time">
                  <i className="far fa-clock"></i> {formatDateTime(appointment.time)}
                </p>
                <p className="location">
                  <i className="fas fa-hospital"></i> {appointment.location || "Phòng khám trực tuyến"}
                </p>
              </div>
              <div className="appointment-actions">
                {new Date(appointment.time) > new Date() && (
                  <>
                    <button className="action-btn join" onClick={() => navigate(`/video-call/${appointment.id}`)}>
                      <i className="fas fa-video"></i> Tham gia
                    </button>
                    <button className="action-btn reschedule" onClick={() => navigate(`/reschedule/${appointment.id}`)}>
                      Đổi lịch
                    </button>
                  </>
                )}
                <button className="action-btn details" onClick={() => navigate(`/appointment/${appointment.id}`)}>
                  Chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;