import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Card } from '../ui/card';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, MapPin } from 'lucide-react';
import doctorService from '../../services/doctorService';
import './AppointmentCalendar.css';

const AppointmentCalendar = () => {
    const { user } = useContext(AuthContext);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [calendarData, setCalendarData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [includeSlots, setIncludeSlots] = useState(false);

    useEffect(() => {
        if (user && user.id) {
            fetchCalendarData();
        }
    }, [user, currentMonth, includeSlots]);

    const fetchCalendarData = async () => {
        try {
            setLoading(true);
            const monthStr = currentMonth.toISOString().slice(0, 7) + '-01';
            const data = await doctorService.getAppointmentCalendar(user.id, monthStr, includeSlots);
            setCalendarData(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching calendar data:', err);
        } finally {
            setLoading(false);
        }
    };

    const goToPreviousMonth = () => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(prev.getMonth() - 1);
            return newMonth;
        });
    };

    const goToNextMonth = () => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(prev.getMonth() + 1);
            return newMonth;
        });
    };

    const goToCurrentMonth = () => {
        setCurrentMonth(new Date());
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        return { daysInMonth, startingDayOfWeek };
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getAppointmentsForDate = (date) => {
        if (!calendarData?.appointmentsByDate) return [];
        const dateStr = date.toISOString().split('T')[0];
        return calendarData.appointmentsByDate[dateStr] || [];
    };

    const getSlotsForDate = (date) => {
        if (!includeSlots || !calendarData?.slotsByDate) return [];
        const dateStr = date.toISOString().split('T')[0];
        return calendarData.slotsByDate[dateStr] || [];
    };

    const renderCalendarGrid = () => {
        const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
        const days = [];
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const appointments = getAppointmentsForDate(date);
            const slots = getSlotsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            
            days.push(
                <div key={day} className={`calendar-day ${isToday ? 'today' : ''}`}>
                    <div className="day-number">{day}</div>
                    <div className="day-content">
                        {appointments.map((appointment, index) => (
                            <div key={appointment.id} className="appointment-item">
                                <div className="appointment-time">
                                    <Clock size={12} />
                                    {formatTime(appointment.doctorSlot?.startTime)}
                                </div>
                                <div className="appointment-patient" title={appointment.patient?.fullName || 'Unknown Patient'}>
                                    {appointment.patient?.fullName || 'Unknown Patient'}
                                </div>
                                <div className={`appointment-status status-${appointment.status?.toLowerCase()}`} title={appointment.status}>
                                    {appointment.status}
                                </div>
                            </div>
                        ))}
                        {includeSlots && slots.length > 0 && (
                            <div className="slots-info">
                                <span className="slots-count">{slots.length} slots</span>
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        
        return days;
    };

    if (loading) {
        return (
            <div className="appointment-calendar-loading">
                <div className="loading-spinner"></div>
                <p>Đang tải lịch...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="appointment-calendar-error">
                <p>Lỗi: {error}</p>
                <button onClick={fetchCalendarData} className="retry-button">
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="appointment-calendar">
            <Card className="calendar-card">
                <div className="calendar-header">
                    <div className="calendar-navigation">
                        <button onClick={goToPreviousMonth} className="nav-button">
                            <ChevronLeft size={20} />
                        </button>
                        <h2 className="current-month">
                            {currentMonth.toLocaleDateString('vi-VN', { 
                                month: 'long', 
                                year: 'numeric' 
                            })}
                        </h2>
                        <button onClick={goToNextMonth} className="nav-button">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    <div className="calendar-controls">
                        <button onClick={goToCurrentMonth} className="current-month-btn">
                            Hôm nay
                        </button>
                        <label className="slots-toggle">
                            <input
                                type="checkbox"
                                checked={includeSlots}
                                onChange={(e) => setIncludeSlots(e.target.checked)}
                            />
                            Hiển thị slots
                        </label>
                    </div>
                </div>

                <div className="calendar-weekdays">
                    <div className="weekday">CN</div>
                    <div className="weekday">T2</div>
                    <div className="weekday">T3</div>
                    <div className="weekday">T4</div>
                    <div className="weekday">T5</div>
                    <div className="weekday">T6</div>
                    <div className="weekday">T7</div>
                </div>

                <div className="calendar-grid">
                    {renderCalendarGrid()}
                </div>

                <div className="calendar-legend">
                    <div className="legend-item">
                        <div className="legend-color status-pending"></div>
                        <span>Chờ xử lý</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color status-confirmed"></div>
                        <span>Đã xác nhận</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color status-completed"></div>
                        <span>Hoàn thành</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color status-cancelled"></div>
                        <span>Đã hủy</span>
                    </div>
                    {includeSlots && (
                        <div className="legend-item">
                            <div className="legend-color slots"></div>
                            <span>Slots</span>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AppointmentCalendar;
