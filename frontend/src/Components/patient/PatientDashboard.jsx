import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import { paymentService } from '../../services/paymentService';
import { patientService } from '../../services/patientService';
import { 
  Calendar, 
  Heart, 
  CreditCard, 
  Bell, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Activity,
  History,
  DollarSign,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import './PatientDashboard.css';

const PatientDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    upcomingAppointments: [],
    recentAppointments: [],
    healthMetrics: {},
    paymentHistory: [],
    notifications: [],
    appointmentStats: {
      total: 0,
      upcoming: 0,
      confirmed: 0,
      pendingPayment: 0,
      completed: 0,
      cancelled: 0
    },
    paymentStats: {
      total: 0,
      pending: 0,
      completed: 0,
      failed: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user appointments
        const appointments = await appointmentService.getAppointments(user?.id, 'PATIENT');
        
        // Calculate appointment statistics
        const now = new Date();
        const appointmentStats = {
          total: appointments.length,
          upcoming: appointments.filter(apt => {
            const aptDate = new Date(apt.date + 'T' + apt.time);
            return aptDate > now && apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED';
          }).length,
          confirmed: appointments.filter(apt => apt.status === 'CONFIRMED').length,
          pendingPayment: appointments.filter(apt => apt.status === 'PENDING_PAYMENT').length,
          completed: appointments.filter(apt => apt.status === 'COMPLETED').length,
          cancelled: appointments.filter(apt => apt.status === 'CANCELLED').length
        };

        // Separate upcoming and recent appointments
        const upcoming = appointments.filter(apt => {
          const aptDate = new Date(apt.date + 'T' + apt.time);
          return aptDate > now && apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED';
        }).slice(0, 5);

        const recent = appointments.filter(apt => {
          const aptDate = new Date(apt.date + 'T' + apt.time);
          return aptDate <= now || apt.status === 'COMPLETED';
        }).slice(0, 5);

        // Fetch payment history and calculate payment statistics
        let payments = [];
        let paymentStats = {
          total: 0,
          pending: 0,
          completed: 0,
          failed: 0
        };

        try {
          const paymentsResponse = await paymentService.getAllPayments();
          payments = paymentsResponse.slice(0, 5);
          
          // Calculate payment statistics
          paymentStats = {
            total: paymentsResponse.length,
            pending: paymentsResponse.filter(p => p.status === 'PENDING' || p.status === 'PENDING_PAYMENT').length,
            completed: paymentsResponse.filter(p => p.status === 'COMPLETED' || p.status === 'SUCCESS').length,
            failed: paymentsResponse.filter(p => p.status === 'FAILED' || p.status === 'CANCELLED').length
          };
        } catch (paymentError) {
          console.warn('Could not fetch payments:', paymentError);
        }

        // Fetch health records
        let healthMetrics = {
          bloodPressure: '--',
          heartRate: '--',
          temperature: '--',
          weight: '--',
          bmi: '--'
        };
        
        try {
          const healthRecords = await patientService.getHealthRecords();
          if (healthRecords && healthRecords.bloodType) {
            healthMetrics = {
              bloodPressure: '120/80', // Mock data - would come from health data API
              heartRate: '72',
              temperature: '36.8',
              weight: healthRecords.weight ? `${healthRecords.weight}kg` : '--',
              bmi: healthRecords.bmi ? healthRecords.bmi.toString() : '--'
            };
          }
        } catch (healthError) {
          console.warn('Could not fetch health records:', healthError);
        }

        // Mock notifications (in real system, this would come from notification service)
        const notifications = [
          {
            id: 1,
            message: 'Lịch hẹn khám ngày mai với Dr. Nguyễn Văn A',
            type: 'reminder',
            date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        ];

        setDashboardData({
          upcomingAppointments: upcoming,
          recentAppointments: recent,
          healthMetrics,
          paymentHistory: payments,
          notifications,
          appointmentStats,
          paymentStats
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Không thể tải dữ liệu dashboard. Vui lòng thử lại.');
        
        // Set fallback data
        setDashboardData({
          upcomingAppointments: [],
          recentAppointments: [],
          healthMetrics: {
            bloodPressure: '--',
            heartRate: '--',
            temperature: '--',
            weight: '--',
            bmi: '--'
          },
          paymentHistory: [],
          notifications: [],
          appointmentStats: {
            total: 0,
            upcoming: 0,
            confirmed: 0,
            pendingPayment: 0,
            completed: 0,
            cancelled: 0
          },
          paymentStats: {
            total: 0,
            pending: 0,
            completed: 0,
            failed: 0
          }
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleQuickAction = (action) => {
    switch (action) {
      case 'book-appointment':
        navigate('/book-appointment');
        break;
      case 'view-appointments':
        navigate('/all-appointments');
        break;
      case 'view-payments':
        navigate('/payments');
        break;
      case 'view-profile':
        navigate('/profile');
        break;
      case 'view-health-records':
        navigate('/medical-records');
        break;
      default:
        break;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '--';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return '--';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '--';
    try {
      return timeString.substring(0, 5); // Extract HH:MM from time string
    } catch {
      return '--';
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'CONFIRMED': { label: 'Đã xác nhận', class: 'status-confirmed' },
      'PENDING': { label: 'Chờ xác nhận', class: 'status-pending' },
      'COMPLETED': { label: 'Hoàn thành', class: 'status-completed' },
      'CANCELLED': { label: 'Đã hủy', class: 'status-cancelled' },
      'IN_PROGRESS': { label: 'Đang khám', class: 'status-in-progress' },
      'PENDING_PAYMENT': { label: 'Chờ thanh toán', class: 'status-pending-payment' }
    };
    
    const statusInfo = statusMap[status] || { label: status, class: 'status-default' };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  const getHealthStatus = () => {
    const bmi = dashboardData.healthMetrics.bmi;
    if (bmi === '--') return '--';
    
    try {
      const bmiValue = parseFloat(bmi);
      if (bmiValue < 18.5) return 'Thiếu cân';
      if (bmiValue < 25) return 'Bình thường';
      if (bmiValue < 30) return 'Thừa cân';
      return 'Béo phì';
    } catch {
      return '--';
    }
  };

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

  if (error) {
    return (
      <div className="patient-dashboard">
        <div className="error-container">
          <AlertCircle size={48} className="error-icon" />
          <h3>Đã xảy ra lỗi</h3>
          <p>{error}</p>
          <button 
            className="btn-primary"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
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
            <h1>Xin chào, {user?.fullName || user?.name || 'Bệnh nhân'}!</h1>
            <p>Chào mừng bạn đến với HealthConnect</p>
          </div>
          <div className="quick-actions">
            <button 
              className="btn-primary"
              onClick={() => handleQuickAction('book-appointment')}
            >
              <Plus size={20} />
              Đặt lịch khám
            </button>
            <button 
              className="btn-secondary"
              onClick={() => handleQuickAction('view-appointments')}
            >
              <Calendar size={20} />
              Xem lịch hẹn
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card appointment-stat">
          <div className="stat-icon appointment-icon">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <h3>Lịch hẹn sắp tới</h3>
            <p className="stat-number">{dashboardData.appointmentStats.upcoming}</p>
            <p className="stat-label">Trong tổng số {dashboardData.appointmentStats.total} lịch hẹn</p>
            <div className="stat-details">
              <span className="stat-detail confirmed">
                <CheckCircle2 size={14} />
                {dashboardData.appointmentStats.confirmed} đã xác nhận
              </span>
              <span className="stat-detail pending">
                <Clock3 size={14} />
                {dashboardData.appointmentStats.pendingPayment} chờ thanh toán
              </span>
            </div>
          </div>
        </div>

        <div className="stat-card payment-stat">
          <div className="stat-icon payment-icon">
            <CreditCard size={24} />
          </div>
          <div className="stat-content">
            <h3>Tổng giao dịch</h3>
            <p className="stat-number">{dashboardData.paymentStats.total}</p>
            <p className="stat-label">Giao dịch thanh toán</p>
            <div className="stat-details">
              <span className="stat-detail completed">
                <CheckCircle2 size={14} />
                {dashboardData.paymentStats.completed} thành công
              </span>
              <span className="stat-detail failed">
                <Clock3 size={14} />
                {dashboardData.paymentStats.failed} thất bại
              </span>
            </div>
          </div>
        </div>

        <div className="stat-card health-stat">
          <div className="stat-icon health-icon">
            <Heart size={24} />
          </div>
          <div className="stat-content">
            <h3>Chỉ số sức khỏe</h3>
            <p className="stat-number">{getHealthStatus()}</p>
            <p className="stat-label">Trạng thái BMI</p>
            <div className="stat-details">
              <span className="stat-detail">
                <Activity size={14} />
                Cập nhật gần nhất
              </span>
            </div>
          </div>
        </div>

        <div className="stat-card notification-stat">
          <div className="stat-icon notification-icon">
            <Bell size={24} />
          </div>
          <div className="stat-content">
            <h3>Thông báo mới</h3>
            <p className="stat-number">{dashboardData.notifications.length}</p>
            <p className="stat-label">Tin nhắn</p>
            <div className="stat-details">
              <span className="stat-detail">
                <AlertCircle size={14} />
                Cập nhật thời gian thực
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content">
        {/* Enhanced Upcoming Appointments */}
        <div className="content-section upcoming-appointments-section">
          <div className="section-header">
            <h2>
              <Calendar size={20} />
              Lịch hẹn sắp tới
              <span className="appointment-count">({dashboardData.appointmentStats.upcoming})</span>
            </h2>
            <button 
              className="btn-view-all"
              onClick={() => handleQuickAction('view-appointments')}
            >
              Xem tất cả
            </button>
          </div>
          <div className="appointments-list">
            {dashboardData.upcomingAppointments.length > 0 ? (
              dashboardData.upcomingAppointments.map(appointment => (
                <div key={appointment.id} className="appointment-card enhanced">
                  <div className="appointment-info">
                    <div className="doctor-info">
                      <h4>{appointment.doctorName || 'Bác sĩ'}</h4>
                      <p className="specialty">{appointment.specialty || 'Chuyên khoa'}</p>
                    </div>
                    <div className="appointment-details">
                      <span className="date">
                        <Calendar size={16} />
                        {formatDate(appointment.date)}
                      </span>
                      <span className="time">
                        <Clock size={16} />
                        {formatTime(appointment.time)}
                      </span>
                      {appointment.symptoms && (
                        <span className="symptoms">
                          <AlertCircle size={16} />
                          {appointment.symptoms}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="appointment-actions">
                    <div className="appointment-status">
                      {getStatusBadge(appointment.status)}
                    </div>
                    {appointment.status === 'PENDING_PAYMENT' && (
                      <button 
                        className="btn-payment"
                        onClick={() => navigate(`/payment/${appointment.id}`)}
                      >
                        <DollarSign size={16} />
                        Thanh toán
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <Calendar size={48} className="empty-icon" />
                <p>Không có lịch hẹn sắp tới</p>
                <button 
                  className="btn-primary"
                  onClick={() => handleQuickAction('book-appointment')}
                >
                  Đặt lịch ngay
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Payment Overview Section */}
        <div className="content-section payment-overview-section">
          <div className="section-header">
            <h2>
              <CreditCard size={20} />
              Tổng quan thanh toán
            </h2>
            <button 
              className="btn-view-all"
              onClick={() => handleQuickAction('view-payments')}
            >
              Xem chi tiết
            </button>
          </div>
          <div className="payment-overview-grid">
            <div className="payment-stat-card">
              <div className="payment-stat-icon completed">
                <CheckCircle2 size={24} />
              </div>
              <div className="payment-stat-content">
                <h4>Thành công</h4>
                <p className="payment-stat-number">{dashboardData.paymentStats.completed}</p>
                <p className="payment-stat-label">Giao dịch</p>
              </div>
            </div>
            <div className="payment-stat-card">
              <div className="payment-stat-icon pending">
                <Clock3 size={24} />
              </div>
              <div className="payment-stat-content">
                <h4>Đang xử lý</h4>
                <p className="payment-stat-number">{dashboardData.paymentStats.pending}</p>
                <p className="payment-stat-label">Giao dịch</p>
              </div>
            </div>
            <div className="payment-stat-card">
              <div className="payment-stat-icon failed">
                <XCircle size={24} />
              </div>
              <div className="payment-stat-content">
                <h4>Thất bại</h4>
                <p className="payment-stat-number">{dashboardData.paymentStats.failed}</p>
                <p className="payment-stat-label">Giao dịch</p>
              </div>
            </div>
            <div className="payment-stat-card">
              <div className="payment-stat-icon total">
                <TrendingUp size={24} />
              </div>
              <div className="payment-stat-content">
                <h4>Tổng cộng</h4>
                <p className="payment-stat-number">{dashboardData.paymentStats.total}</p>
                <p className="payment-stat-label">Giao dịch</p>
              </div>
            </div>
          </div>
        </div>

        {/* Health Metrics */}
        <div className="content-section">
          <div className="section-header">
            <h2>Chỉ số sức khỏe</h2>
            <button 
              className="btn-view-all"
              onClick={() => handleQuickAction('view-health-records')}
              disabled={true}>
              Cập nhật
            </button>
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
                <h4>BMI</h4>
                <p className="metric-value">{dashboardData.healthMetrics.bmi}</p>
                <p className="metric-label">kg/m²</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="content-section">
          <div className="section-header">
            <h2>Hoạt động gần đây</h2>
            <button 
              className="btn-view-all"
              onClick={() => handleQuickAction('view-appointments')}
            >
              Xem tất cả
            </button>
          </div>
          <div className="activities-list">
            {dashboardData.recentAppointments.length > 0 ? (
              dashboardData.recentAppointments.map(appointment => (
                <div key={appointment.id} className="activity-item">
                  <div className="activity-icon completed">
                    <CheckCircle size={16} />
                  </div>
                  <div className="activity-content">
                    <h4>Khám bệnh với {appointment.doctorName || 'Bác sĩ'}</h4>
                    <p>{formatDate(appointment.date)} - {formatTime(appointment.time)}</p>
                  </div>
                  <div className="activity-status">
                    {getStatusBadge(appointment.status)}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <History size={48} className="empty-icon" />
                <p>Chưa có hoạt động nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {/* <div className="content-section">
          <div className="section-header">
            <h2>Thao tác nhanh</h2>
          </div>
          <div className="quick-actions-grid">
            <button 
              className="quick-action-btn"
              onClick={() => handleQuickAction('book-appointment')}
            >
              <div className="action-icon">📅</div>
              <span>Đặt lịch khám</span>
            </button>
            <button 
              className="quick-action-btn"
              onClick={() => handleQuickAction('view-appointments')}
            >
              <div className="action-icon">📋</div>
              <span>Xem lịch hẹn</span>
            </button>
            <button 
              className="quick-action-btn"
              onClick={() => handleQuickAction('view-profile')}
            >
              <div className="action-icon">👤</div>
              <span>Hồ sơ cá nhân</span>
            </button>
            <button 
              className="quick-action-btn"
              onClick={() => handleQuickAction('view-health-records')}
            >
              <div className="action-icon">🏥</div>
              <span>Hồ sơ sức khỏe</span>
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default PatientDashboard;