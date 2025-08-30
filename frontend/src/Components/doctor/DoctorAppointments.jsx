import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Card } from '../ui/card';
import { Calendar, Clock, User, Filter, Search } from 'lucide-react';
import doctorService from '../../services/doctorService';
import './DoctorAppointments.css';

const DoctorAppointments = () => {
    const { user, token } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({
        status: '',
        date: '',
        search: ''
    });

    useEffect(() => {
        if (user && user.id) {
            fetchAppointments();
        }
    }, [user, filter]);

    const fetchAppointments = async () => {
        try {
            const data = await doctorService.getAppointments(user.id, filter);
            setAppointments(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching appointments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilter(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const filteredAppointments = appointments.filter(appointment => {
        if (filter.search) {
            const searchTerm = filter.search.toLowerCase();
            return (
                appointment.patient.fullName.toLowerCase().includes(searchTerm) ||
                appointment.patient.phone.includes(searchTerm) ||
                appointment.notes?.toLowerCase().includes(searchTerm)
            );
        }
        return true;
    });

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

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return 'status-confirmed';
            case 'pending': return 'status-pending';
            case 'cancelled': return 'status-cancelled';
            case 'completed': return 'status-completed';
            default: return 'status-pending';
        }
    };

    const getStatusText = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return 'Đã xác nhận';
            case 'pending': return 'Chờ xác nhận';
            case 'cancelled': return 'Đã hủy';
            case 'completed': return 'Hoàn thành';
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="appointments-loading">
                <div className="loading-spinner"></div>
                <p>Đang tải danh sách lịch hẹn...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="appointments-error">
                <p>Lỗi: {error}</p>
                <button onClick={fetchAppointments} className="retry-button">
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="doctor-appointments">
            <div className="appointments-header">
                <h1>Quản lý lịch hẹn</h1>
                <p>Tổng số: {filteredAppointments.length} lịch hẹn</p>
            </div>

            {/* Filters */}
            <Card className="filters-card">
                <div className="filters-container">
                    <div className="filter-group">
                        <label>
                            <Filter size={16} />
                            Trạng thái
                        </label>
                        <select 
                            value={filter.status} 
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                        >
                            <option value="">Tất cả</option>
                            <option value="PENDING">Chờ xác nhận</option>
                            <option value="CONFIRMED">Đã xác nhận</option>
                            <option value="COMPLETED">Hoàn thành</option>
                            <option value="CANCELLED">Đã hủy</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>
                            <Calendar size={16} />
                            Ngày
                        </label>
                        <input 
                            type="date" 
                            value={filter.date}
                            onChange={(e) => handleFilterChange('date', e.target.value)}
                        />
                    </div>

                    <div className="filter-group search-group">
                        <label>
                            <Search size={16} />
                            Tìm kiếm
                        </label>
                        <input 
                            type="text" 
                            placeholder="Tên bệnh nhân, SĐT..."
                            value={filter.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                    </div>
                </div>
            </Card>

            {/* Appointments List */}
            <Card className="appointments-list-card">
                {filteredAppointments.length > 0 ? (
                    <div className="appointments-table">
                        <div className="table-header">
                            <div className="col-date">Ngày & Giờ</div>
                            <div className="col-patient">Bệnh nhân</div>
                            <div className="col-type">Loại khám</div>
                            <div className="col-status">Trạng thái</div>
                            <div className="col-notes">Ghi chú</div>
                            <div className="col-actions">Thao tác</div>
                        </div>
                        
                        {filteredAppointments.map((appointment) => (
                            <div key={appointment.id} className="table-row">
                                <div className="col-date">
                                    <div className="appointment-datetime">
                                        <div className="date">
                                            {formatDate(appointment.doctorSlot.date)}
                                        </div>
                                        <div className="time">
                                            <Clock size={14} />
                                            {formatTime(appointment.doctorSlot.startTime)}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-patient">
                                    <div className="patient-info">
                                        <div className="patient-name">
                                            <User size={16} />
                                            {appointment.patient.fullName}
                                        </div>
                                        <div className="patient-contact">
                                            {appointment.patient.phone}
                                        </div>
                                        <div className="patient-email">
                                            {appointment.patient.email}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-type">
                                    <span className={`consultation-type type-${appointment.consultationType?.toLowerCase()}`}>
                                        {appointment.consultationType === 'online' ? 'Trực tuyến' : 'Tại phòng khám'}
                                    </span>
                                </div>
                                
                                <div className="col-status">
                                    <span className={`appointment-status ${getStatusColor(appointment.status)}`}>
                                        {getStatusText(appointment.status)}
                                    </span>
                                </div>
                                
                                <div className="col-notes">
                                    <div className="notes-preview">
                                        {appointment.notes ? 
                                            (appointment.notes.length > 50 ? 
                                                `${appointment.notes.substring(0, 50)}...` : 
                                                appointment.notes
                                            ) : 
                                            'Không có ghi chú'
                                        }
                                    </div>
                                </div>
                                
                                <div className="col-actions">
                                    <div className="action-buttons">
                                        <button className="btn-view" title="Xem chi tiết">
                                            Xem
                                        </button>
                                        {appointment.status === 'PENDING' && (
                                            <>
                                                <button className="btn-confirm" title="Xác nhận">
                                                    Xác nhận
                                                </button>
                                                <button className="btn-cancel" title="Hủy">
                                                    Hủy
                                                </button>
                                            </>
                                        )}
                                        {appointment.status === 'CONFIRMED' && (
                                            <button className="btn-complete" title="Hoàn thành">
                                                Hoàn thành
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-appointments">
                        <Calendar size={48} />
                        <h3>Không có lịch hẹn nào</h3>
                        <p>Chưa có lịch hẹn nào phù hợp với bộ lọc hiện tại.</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default DoctorAppointments;
