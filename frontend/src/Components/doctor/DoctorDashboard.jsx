import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Card } from '../ui/card';
import { Calendar, Clock, Users, Stethoscope, Settings, FileText, BarChart3, CalendarDays } from 'lucide-react';
import doctorService from '../../services/doctorService';
import DashboardStats from './DashboardStats';
import AppointmentCalendar from './AppointmentCalendar';
import './DoctorDashboard.css';
import { appointmentService } from '../../services/appointmentService';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
    const { user, token } = useContext(AuthContext);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const navigate = useNavigate();
    
    useEffect(() => {
        if (user && user.id) {
            console.log('Fetching dashboard data for user:', user.id);
            fetchDashboardData();
        } else {
            console.log('No user or user ID found:', user);
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            console.log('Starting to fetch dashboard data...');
            const data = await doctorService.getDashboard(user.id);
            console.log('Dashboard data received:', data);
            setDashboardData(data);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (timeString) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };
    const handleHostMeeting = (appointmentId) => {
        const response = appointmentService.updateDoctorJoined(appointmentId, 1);
        console.log(response);
        navigate(`/appointments/${appointmentId}/meeting`);
    }
    if (loading) {
        return (
            <div className="doctor-dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Đang tải dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="doctor-dashboard-error">
                <p>Lỗi: {error}</p>
                <button onClick={fetchDashboardData} className="retry-button">
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="doctor-dashboard">
            <div className="dashboard-header">
                <h1>Dashboard Bác sĩ</h1>
                <p>Xin chào, BS. {user?.fullName}</p>
            </div>

            {/* Navigation Tabs */}
            <div className="dashboard-tabs">
                <button 
                    className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    <BarChart3 size={18} />
                    Tổng quan
                </button>
                <button 
                    className={`tab-button ${activeTab === 'calendar' ? 'active' : ''}`}
                    onClick={() => setActiveTab('calendar')}
                >
                    <CalendarDays size={18} />
                    Lịch hẹn
                </button>
                <button 
                    className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
                    onClick={() => setActiveTab('stats')}
                >
                    <FileText size={18} />
                    Báo cáo
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <>
                    {/* Stats Cards */}
                    <div className="stats-grid">
                        <Card className="stat-card">
                            <div className="stat-icon">
                                <Calendar className="icon" />
                            </div>
                            <div className="stat-content">
                                <h3>{dashboardData?.todayAppointmentsCount || 0}</h3>
                                <p>Lịch hẹn hôm nay</p>
                            </div>
                        </Card>

                        <Card className="stat-card">
                            <div className="stat-icon">
                                <Clock className="icon" />
                            </div>
                            <div className="stat-content">
                                <h3>{dashboardData?.upcomingAppointmentsCount || 0}</h3>
                                <p>Lịch hẹn sắp tới</p>
                            </div>
                        </Card>

                        <Card className="stat-card">
                            <div className="stat-icon">
                                <Users className="icon" />
                            </div>
                            <div className="stat-content">
                                <h3>{dashboardData?.availableSlotsToday || 0}</h3>
                                <p>Slot trống hôm nay</p>
                            </div>
                        </Card>

                        <Card className="stat-card">
                            <div className="stat-icon">
                                <Stethoscope className="icon" />
                            </div>
                            <div className="stat-content">
                                <h3>{dashboardData?.doctorInfo?.specialties?.length || 0}</h3>
                                <p>Chuyên khoa</p>
                            </div>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="dashboard-content">
                        {/* Today's Appointments */}
                        <Card className="appointments-card">
                            <div className="card-header">
                                <h2>Lịch hẹn hôm nay</h2>
                                <span className="appointment-count">
                                    {dashboardData?.todayAppointments?.length || 0} lịch hẹn
                                </span>
                            </div>
                            <div className="appointments-list">
                                {dashboardData?.todayAppointments?.length > 0 ? (
                                    dashboardData.todayAppointments.map((appointment) => (
                                        <div key={appointment.id} className="appointment-item">
                                            <div className="appointment-time">
                                                <Clock size={16} />
                                                {formatTime(appointment.doctorSlot?.startTime)}
                                            </div>
                                            <div className="appointment-patient">
                                                <strong>{appointment.patient?.fullName || 'Không có thông tin'}</strong>
                                                <span className="appointment-notes">
                                                    {appointment.notes || 'Không có ghi chú'}
                                                </span>
                                            </div>
                                            <div className={`appointment-status status-${appointment.status?.toLowerCase()}`}>
                                                {appointment.status}
                                            </div>
                                            <div className='host-meeting-btn'>
                                                <button className='host-meeting-btn-text' onClick={() => handleHostMeeting(appointment.id)}>
                                                    Bắt đầu
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-appointments">
                                        <p>Không có lịch hẹn nào hôm nay</p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="quick-actions-card">
                            <h2>Thao tác nhanh</h2>
                            <div className="quick-actions-grid">
                                <button className="quick-action-btn" onClick={() => setActiveTab('calendar')}>
                                    <Calendar className="icon" />
                                    <span>Xem lịch hẹn</span>
                                </button>
                                <button className="quick-action-btn" onClick={() => setActiveTab('stats')}>
                                    <BarChart3 className="icon" />
                                    <span>Thống kê</span>
                                </button>
                                <button className="quick-action-btn" onClick={() => navigate('/doctor/availability')}>
                                    <Clock className="icon" />
                                    <span>Thiết lập lịch làm việc</span>
                                </button>
                                <button className="quick-action-btn">
                                    <FileText className="icon" />
                                    <span>Hồ sơ bệnh án</span>
                                </button>
                            </div>
                        </Card>
                    </div>

                    {/* Upcoming Appointments */}
                    {dashboardData?.upcomingAppointments?.length > 0 && (
                        <Card className="upcoming-appointments-card">
                            <h2>Lịch hẹn sắp tới (7 ngày tới)</h2>
                            <div className="upcoming-appointments-list">
                                {dashboardData.upcomingAppointments.slice(0, 5).map((appointment) => (
                                    <div key={appointment.id} className="upcoming-appointment-item">
                                        <div className="appointment-date">
                                            {formatDate(appointment.doctorSlot?.date)}
                                        </div>
                                        <div className="appointment-details">
                                            <div className="appointment-time">
                                                {formatTime(appointment.doctorSlot?.startTime)}
                                            </div>
                                            <div className="appointment-patient">
                                                {appointment.patient?.fullName || 'Không có thông tin'}
                                            </div>
                                        </div>
                                        <div className={`appointment-status status-${appointment.status?.toLowerCase()}`}>
                                            {appointment.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </>
            )}

            {activeTab === 'calendar' && (
                <AppointmentCalendar />
            )}

            {activeTab === 'stats' && (
                <DashboardStats />
            )}
        </div>
    );
};

export default DoctorDashboard;
