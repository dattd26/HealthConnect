import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Card } from '../ui/card';
import { TrendingUp, TrendingDown, Users, Calendar, Clock, DollarSign, Activity } from 'lucide-react';
import doctorService from '../../services/doctorService';
import './DashboardStats.css';

const DashboardStats = ({ days = 30 }) => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState(days);

    useEffect(() => {
        if (user && user.id) {
            fetchStats(selectedPeriod);
        }
    }, [user, selectedPeriod]);

    const fetchStats = async (period) => {
        try {
            setLoading(true);
            const data = await doctorService.getDashboardStats(user.id, period);
            setStats(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatPercentage = (value) => {
        if (value === null || value === undefined) return '0%';
        return `${(value * 100).toFixed(1)}%`;
    };

    const formatNumber = (value) => {
        if (value === null || value === undefined) return '0';
        return value.toLocaleString('vi-VN');
    };

    const getTrendIcon = (current, previous) => {
        if (!previous || previous === 0) return <Activity className="trend-icon neutral" />;
        if (current > previous) return <TrendingUp className="trend-icon positive" />;
        if (current < previous) return <TrendingDown className="trend-icon negative" />;
        return <Activity className="trend-icon neutral" />;
    };

    if (loading) {
        return (
            <div className="dashboard-stats-loading">
                <div className="loading-spinner"></div>
                <p>Đang tải thống kê...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-stats-error">
                <p>Lỗi: {error}</p>
                <button onClick={() => fetchStats(selectedPeriod)} className="retry-button">
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="dashboard-stats">
            <div className="stats-header">
                <h2>Thống kê tổng quan</h2>
                <div className="period-selector">
                    <select 
                        value={selectedPeriod} 
                        onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
                        className="period-select"
                    >
                        <option value={7}>7 ngày qua</option>
                        <option value={30}>30 ngày qua</option>
                        <option value={90}>90 ngày qua</option>
                    </select>
                </div>
            </div>

            <div className="stats-grid">
                {/* Appointment Statistics */}
                <Card className="stat-card appointment-stats">
                    <div className="stat-header">
                        <Calendar className="stat-icon" />
                        <h3>Lịch hẹn</h3>
                    </div>
                    <div className="stat-content">
                        <div className="stat-main">
                            <span className="stat-number">{formatNumber(stats?.totalAppointments)}</span>
                            <span className="stat-label">Tổng lịch hẹn</span>
                        </div>
                        <div className="stat-details">
                            <div className="stat-item">
                                <span className="stat-value positive">{formatNumber(stats?.confirmedAppointments)}</span>
                                <span className="stat-label">Đã xác nhận</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value neutral">{formatNumber(stats?.waitingAppointments)}</span>
                                <span className="stat-label">Chờ xử lý</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value negative">{formatNumber(stats?.cancelledAppointments)}</span>
                                <span className="stat-label">Đã hủy</span>
                            </div>
                        </div>
                        <div className="stat-rate">
                            <span className="rate-label">Tỷ lệ hoàn thành:</span>
                            <span className="rate-value">{formatPercentage(stats?.completionRate)}</span>
                        </div>
                    </div>
                </Card>

                {/* Slot Statistics */}
                <Card className="stat-card slot-stats">
                    <div className="stat-header">
                        <Clock className="stat-icon" />
                        <h3>Slot thời gian</h3>
                    </div>
                    <div className="stat-content">
                        <div className="stat-main">
                            <span className="stat-number">{formatNumber(stats?.totalSlots)}</span>
                            <span className="stat-label">Tổng slot</span>
                        </div>
                        <div className="stat-details">
                            <div className="stat-item">
                                <span className="stat-value positive">{formatNumber(stats?.bookedSlots)}</span>
                                <span className="stat-label">Đã đặt</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value neutral">{formatNumber(stats?.availableSlots)}</span>
                                <span className="stat-label">Còn trống</span>
                            </div>
                        </div>
                        <div className="stat-rate">
                            <span className="rate-label">Tỷ lệ sử dụng:</span>
                            <span className="rate-value">{formatPercentage(stats?.utilizationRate)}</span>
                        </div>
                    </div>
                </Card>

                {/* Patient Statistics */}
                <Card className="stat-card patient-stats">
                    <div className="stat-header">
                        <Users className="stat-icon" />
                        <h3>Bệnh nhân</h3>
                    </div>
                    <div className="stat-content">
                        <div className="stat-main">
                            <span className="stat-number">{formatNumber(stats?.uniquePatients)}</span>
                            <span className="stat-label">Tổng bệnh nhân</span>
                        </div>
                        <div className="stat-details">
                            <div className="stat-item">
                                <span className="stat-value positive">{formatNumber(stats?.newPatients)}</span>
                                <span className="stat-label">Bệnh nhân mới</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value neutral">{formatNumber(stats?.returningPatients)}</span>
                                <span className="stat-label">Tái khám</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Revenue Statistics (if applicable) */}
                {stats?.totalRevenue && (
                    <Card className="stat-card revenue-stats">
                        <div className="stat-header">
                            <DollarSign className="stat-icon" />
                            <h3>Doanh thu</h3>
                        </div>
                        <div className="stat-content">
                            <div className="stat-main">
                                <span className="stat-number">{formatNumber(stats?.totalRevenue)}</span>
                                <span className="stat-label">Tổng doanh thu</span>
                            </div>
                            <div className="stat-details">
                                <div className="stat-item">
                                    <span className="stat-value neutral">
                                        {formatNumber(stats?.averageRevenuePerAppointment)}
                                    </span>
                                    <span className="stat-label">Trung bình/lịch hẹn</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}
            </div>

            {/* Performance Metrics */}
            <div className="performance-metrics">
                <Card className="metrics-card">
                    <h3>Chỉ số hiệu suất</h3>
                    <div className="metrics-grid">
                        <div className="metric-item">
                            <div className="metric-header">
                                <Activity className="metric-icon" />
                                <span className="metric-label">Tỷ lệ hoàn thành lịch hẹn</span>
                            </div>
                            <div className="metric-value">
                                {formatPercentage(stats?.completionRate)}
                            </div>
                            <div className="metric-bar">
                                <div 
                                    className="metric-progress" 
                                    style={{ width: `${(stats?.completionRate || 0) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        
                        <div className="metric-item">
                            <div className="metric-header">
                                <Clock className="metric-icon" />
                                <span className="metric-label">Tỷ lệ sử dụng slot</span>
                            </div>
                            <div className="metric-value">
                                {formatPercentage(stats?.utilizationRate)}
                            </div>
                            <div className="metric-bar">
                                <div 
                                    className="metric-progress" 
                                    style={{ width: `${(stats?.utilizationRate || 0) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DashboardStats;
