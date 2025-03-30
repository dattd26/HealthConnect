import { EmergencyButton } from "../patient/EmergencyButton";
import { HealthChart } from "../patient/HealthChart";
import { HealthMetrics } from "../patient/HealthMetrics";
import AppointmentsList from "../appointment/AppointmentsList";
import { HealthTips } from "../home/HealthTips";
import { useEffect, useState } from "react";
import axios from "axios";

const PatientDashboard = () => {
  const [userInfor, setUserInFor] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:8080/api/user/profile", {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        });
        setUserInFor(response.data);
      } catch (error) {
        setError("Lỗi tải dữ liệu: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-lg shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Chào mừng trở lại, {userInfor.fullName}!</h1>
        <EmergencyButton />
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <p className="col-span-full text-lg font-semibold p-4 bg-white rounded-lg shadow-md">
          Here's your health overview
        </p>

        {/* Health Overview */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <HealthMetrics />
        </div>

        {/* Real-time Charts */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <HealthChart />
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Lịch hẹn sắp tới</h2>
          <AppointmentsList />
        </div>

        {/* Recent Messages */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Tin nhắn gần đây</h2>
          {/* Add a component to display recent messages */}
          {/* <RecentMessages /> */}
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Hành động nhanh</h2>
          {/* Add a component for quick actions */}
          {/* <QuickActions /> */}
        </div>

        {/* Health Tips */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <HealthTips />
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;