import { EmergencyButton } from "../patient/EmergencyButton";
import { HealthChart } from "../patient/HealthChart";
import { HealthMetrics } from "../patient/HealthMetrics";
import AppointmentsList from "../appointment/AppointmentsList";
import { HealthTips } from "../home/HealthTips";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

import { Link } from "react-router-dom";
import { Calendar, User, FileText, MessageSquare, Heart } from "lucide-react";

const QuickActions = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Link to="/appointments" className="button button-primary p-4 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform">
          <Calendar className="w-6 h-6 mb-2" />
          <span className="text-sm font-medium">Đặt lịch khám</span>
        </Link>
        <Link to="/profile" className="button button-secondary p-4 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform">
          <User className="w-6 h-6 mb-2" />
          <span className="text-sm font-medium">Hồ sơ của tôi</span>
        </Link>
        <button className="button button-success p-4 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform">
          <MessageSquare className="w-6 h-6 mb-2" />
          <span className="text-sm font-medium">Tư vấn trực tuyến</span>
        </button>
        <Link to="/profile/medical-history" className="button button-warning p-4 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform">
          <FileText className="w-6 h-6 mb-2" />
          <span className="text-sm font-medium">Lịch sử khám</span>
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--secondary-50) 100%)'}}>
      <div className="text-center">
        <div className="loading-spinner mb-4"></div>
        <p className="text-secondary">Đang tải thông tin...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--secondary-50) 100%)'}}>
      <div className="card p-8 text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-error-100 flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-error-600" />
        </div>
        <h2 className="text-xl font-semibold text-error-600 mb-2">Có lỗi xảy ra</h2>
        <p className="text-secondary">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4" style={{background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--secondary-50) 100%)'}}>
      {/* Header */}
      <header className="p-6 rounded-2xl shadow-lg mb-6 fade-in" style={{background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--secondary-600) 100%)'}}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Chào mừng trở lại!</h1>
            <p className="text-white/90 text-lg">{userInfor.fullName}</p>
          </div>
          <div className="flex items-center space-x-2 text-white/90">
            <Heart className="w-8 h-8" />
          </div>
        </div>
      </header>

      {/* Overview Banner */}
      <div className="card p-6 mb-6 text-center slide-in-up" style={{animationDelay: '0.2s'}}>
        <h2 className="text-2xl font-bold text-primary mb-2">Tổng quan sức khỏe của bạn</h2>
        <p className="text-secondary">Theo dõi và quản lý sức khỏe một cách hiệu quả</p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Health Overview */}
        <div className="card p-6 fade-in" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mr-3">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-primary">Chỉ số sức khỏe</h3>
          </div>
          <HealthMetrics />
        </div>

        {/* Real-time Charts */}
        <div className="card p-6 fade-in" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center mr-3">
              <FileText className="w-5 h-5 text-secondary-600" />
            </div>
            <h3 className="text-lg font-semibold text-primary">Biểu đồ sức khỏe</h3>
          </div>
          <HealthChart />
        </div>

        {/* Quick Actions */}
        <div className="card p-6 fade-in" style={{animationDelay: '0.5s'}}>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center mr-3">
              <Calendar className="w-5 h-5 text-success-600" />
            </div>
            <h3 className="text-lg font-semibold text-primary">Thao tác nhanh</h3>
          </div>
          <QuickActions />
        </div>

        {/* Upcoming Appointments */}
        <div className="card p-6 fade-in" style={{animationDelay: '0.6s'}}>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-warning-100 flex items-center justify-center mr-3">
              <Calendar className="w-5 h-5 text-warning-600" />
            </div>
            <h3 className="text-lg font-semibold text-primary">Lịch hẹn sắp tới</h3>
          </div>
          <AppointmentsList userId={user.id} role={user.role}/>
        </div>

        {/* Recent Messages */}
        <div className="card p-6 fade-in" style={{animationDelay: '0.7s'}}>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-error-100 flex items-center justify-center mr-3">
              <MessageSquare className="w-5 h-5 text-error-600" />
            </div>
            <h3 className="text-lg font-semibold text-primary">Tin nhắn gần đây</h3>
          </div>
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-muted italic">Không có tin nhắn nào</p>
          </div>
        </div>

        {/* Health Tips */}
        <div className="card p-6 fade-in" style={{animationDelay: '0.8s'}}>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mr-3">
              <Heart className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-primary">Mẹo sức khỏe</h3>
          </div>
          <HealthTips />
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;