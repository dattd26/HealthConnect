import { EmergencyButton } from "../patient/EmergencyButton";
import { HealthChart } from "../patient/HealthChart";
import { HealthMetrics } from "../patient/HealthMetrics";
import AppointmentsList from "../appointment/AppointmentsList";
import { HealthTips } from "../home/HealthTips";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { Calendar, User, FileText, MessageSquare } from "lucide-react";

const QuickActions = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Hành động nhanh</h2>
      <div className="grid grid-cols-2 gap-3">
        <Link to="/appointments" className="bg-blue-600 text-white rounded-lg p-3 flex items-center justify-center hover:bg-blue-700 transition duration-300">
          <Calendar className="w-5 h-5 mr-2" />
          <span>Đặt lịch khám</span>
        </Link>
        <Link to="/profile" className="bg-green-600 text-white rounded-lg p-3 flex items-center justify-center hover:bg-green-700 transition duration-300">
          <User className="w-5 h-5 mr-2" />
          <span>Hồ sơ của tôi</span>
        </Link>
        <button className="bg-purple-600 text-white rounded-lg p-3 flex items-center justify-center hover:bg-purple-700 transition duration-300">
          <MessageSquare className="w-5 h-5 mr-2" />
          <span>Tư vấn trực tuyến</span>
        </button>
        <Link to="/profile/medical-history" className="bg-amber-600 text-white rounded-lg p-3 flex items-center justify-center hover:bg-amber-700 transition duration-300">
          <FileText className="w-5 h-5 mr-2" />
          <span>Lịch sử khám</span>
        </Link>
      </div>
    </div>
  );
};

const PatientDashboard = () => {
  const [userInfor, setUserInFor] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user} = useContext(AuthContext);
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
        {/* <EmergencyButton /> */}
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
          <AppointmentsList userId={user.id} role={user.role}/>
        </div>

        {/* Recent Messages */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Tin nhắn gần đây</h2>
          {/* Add a component to display recent messages */}
          {/* <RecentMessages /> */}
          <p className="text-gray-500 italic">Không có tin nhắn nào</p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <QuickActions />
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