import { EmergencyButton } from "./EmergencyButton";
import { HealthChart } from "./HealthChart";
import { HealthMetrics } from "./HealthMetrics";
import AppointmentsList from "./AppointmentsList";
import { HealthTips } from "./HealthTips";
import "../styles/PatientDashboard.css"
import { useEffect, useState } from "react";
import axios from "axios";
const PatientDashboard = () => {
  const [userInfor, setUserInFor] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const response = await axios.get("http://localhost:8080/api/user/profile", {headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer '+ token}});
        setUserInFor(response.data)
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      }
    }
    fetchData();
  }, []);
  return (
    <div className="patient-dashboard">
      {/* Header */}
      <header className="dashboard-header display: block unicode-bidi: isolate">
        <h1>Chào mừng trở lại, {userInfor.fullName}!</h1>
        <EmergencyButton />
      </header>

      {/* Grid Layout */}
      <div className="dashboard-grid">
      <p class="text-lg font-semibold p-2 rounded-lg shadow-md">
        Here's your health overview
      </p>

        {/* Health Overview */}
        <div className="card health-overview">
          <HealthMetrics />
        </div>

        {/* Real-time Charts */}
        <div className="card health-chart">
          <HealthChart />
        </div>

        {/* Upcoming Appointments */}
        <div className="card appointments">
          <h2>Lịch hẹn sắp tới</h2>
          <AppointmentsList />
        </div>

        {/* Recent Messages */}
        <div className="card messages">
          <h2>Tin nhắn gần đây</h2>
          {/* <RecentMessages /> */}
        </div>

        {/* Quick Actions */}
        <div className="card quick-actions">
          {/* <QuickActions /> */}
        </div>

        {/* Health Tips */}
        <div className="card health-tips">
          <HealthTips />
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;