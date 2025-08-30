import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import './PatientDashboard.css';

const PatientDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    upcomingAppointments: [],
    recentAppointments: [],
    healthMetrics: {},
    paymentHistory: [],
    notifications: []
  });
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:8080/api/user/dashboard", {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback data for demo
        setDashboardData({
          upcomingAppointments: [
            {
              id: 1,
              doctorName: 'Dr. Nguyễn Văn A',
              specialty: 'Tim mạch',
              date: '2024-01-15',
              time: '09:00',
              status: 'confirmed'
            }
          ],
          recentAppointments: [
            {
              id: 2,
              doctorName: 'Dr. Trần Thị B',
              specialty: 'Nội khoa',
              date: '2024-01-10',
              time: '14:00',
              status: 'completed'
            }
          ],
          healthMetrics: {
            bloodPressure: '120/80',
            heartRate: '72',
            temperature: '36.8',
            weight: '65kg'
          },
          paymentHistory: [
            {
              id: 1,
              amount: 500000,
              method: 'VNPAY',
              date: '2024-01-10',
              status: 'completed'
            }
          ],
          notifications: [
            {
              id: 1,
              message: 'Lịch hẹn khám ngày mai',
              type: 'reminder',
              date: '2024-01-14'
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="patient-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>Xin chào, {user?.name || 'Bệnh nhân'}!</h1>
            <p>Chào mừng bạn đến với HealthConnect</p>
          </div>
          <div className="quick-actions">
            <button className="btn-primary">Đặt lịch khám</button>
            <button className="btn-secondary">Tư vấn online</button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon appointment-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2V5M16 2V5M3.5 4H20.5M21 8.5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V8.5C3 7.39543 3.89543 6.5 5 6.5H19C20.1046 6.5 21 7.39543 21 8.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Lịch hẹn sắp tới</h3>
            <p className="stat-number">{dashboardData.upcomingAppointments.length}</p>
            <p className="stat-label">Lịch hẹn</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon health-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 14C19 16.7614 16.7614 19 14 19C11.2386 19 9 16.7614 9 14C9 11.2386 11.2386 9 14 9C16.7614 9 19 11.2386 19 14Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M14 2V6M14 22V18M2 14H6M22 14H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Chỉ số sức khỏe</h3>
            <p className="stat-number">Tốt</p>
            <p className="stat-label">Trạng thái</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon payment-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Thanh toán gần đây</h3>
            <p className="stat-number">{dashboardData.paymentHistory.length}</p>
            <p className="stat-label">Giao dịch</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon notification-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21A2 2 0 0 1 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Thông báo mới</h3>
            <p className="stat-number">{dashboardData.notifications.length}</p>
            <p className="stat-label">Tin nhắn</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content">
        {/* Upcoming Appointments */}
        <div className="content-section">
          <div className="section-header">
            <h2>Lịch hẹn sắp tới</h2>
            <button className="btn-view-all">Xem tất cả</button>
          </div>
          <div className="appointments-list">
            {dashboardData.upcomingAppointments.length > 0 ? (
              dashboardData.upcomingAppointments.map(appointment => (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-info">
                    <h4>{appointment.doctorName}</h4>
                    <p className="specialty">{appointment.specialty}</p>
                    <div className="appointment-details">
                      <span className="date">{new Date(appointment.date).toLocaleDateString('vi-VN')}</span>
                      <span className="time">{appointment.time}</span>
                    </div>
                  </div>
                  <div className="appointment-status confirmed">
                    Đã xác nhận
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>Không có lịch hẹn sắp tới</p>
                <button className="btn-primary">Đặt lịch ngay</button>
              </div>
            )}
          </div>
        </div>

        {/* Health Metrics */}
        <div className="content-section">
          <div className="section-header">
            <h2>Chỉ số sức khỏe</h2>
            <button className="btn-view-all">Cập nhật</button>
          </div>
          <div className="health-metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">❤️</div>
              <div className="metric-content">
                <h4>Huyết áp</h4>
                <p className="metric-value">{dashboardData.healthMetrics.bloodPressure}</p>
                <p className="metric-label">mmHg</p>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">💓</div>
              <div className="metric-content">
                <h4>Nhịp tim</h4>
                <p className="metric-value">{dashboardData.healthMetrics.heartRate}</p>
                <p className="metric-label">bpm</p>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">🌡️</div>
              <div className="metric-content">
                <h4>Nhiệt độ</h4>
                <p className="metric-value">{dashboardData.healthMetrics.temperature}°C</p>
                <p className="metric-label">Celsius</p>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">⚖️</div>
              <div className="metric-content">
                <h4>Cân nặng</h4>
                <p className="metric-value">{dashboardData.healthMetrics.weight}</p>
                <p className="metric-label">kg</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="content-section">
          <div className="section-header">
            <h2>Hoạt động gần đây</h2>
            <button className="btn-view-all">Xem tất cả</button>
          </div>
          <div className="activities-list">
            {dashboardData.recentAppointments.map(appointment => (
              <div key={appointment.id} className="activity-item">
                <div className="activity-icon completed">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="activity-content">
                  <h4>Khám bệnh với {appointment.doctorName}</h4>
                  <p>{new Date(appointment.date).toLocaleDateString('vi-VN')} - {appointment.time}</p>
                </div>
                <div className="activity-status completed">
                  Hoàn thành
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="content-section">
          <div className="section-header">
            <h2>Thao tác nhanh</h2>
          </div>
          <div className="quick-actions-grid">
            <button className="quick-action-btn">
              <div className="action-icon">📅</div>
              <span>Đặt lịch khám</span>
            </button>
            <button className="quick-action-btn">
              <div className="action-icon">💬</div>
              <span>Tư vấn online</span>
            </button>
            <button className="quick-action-btn">
              <div className="action-icon">📋</div>
              <span>Xem hồ sơ</span>
            </button>
            <button className="quick-action-btn">
              <div className="action-icon">💳</div>
              <span>Thanh toán</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;