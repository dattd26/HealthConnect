import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import DoctorLayout from '../Components/doctor/DoctorLayout';
import { Card } from '../Components/ui/card';
import { Calendar, Clock, Save, Plus, Trash2, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import slotService from '../services/slotService';
import doctorAvailabilityService from '../services/doctorAvailabilityService';
import './DoctorAvailabilityPage.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DoctorAvailabilityPage = () => {
    const { user } = useContext(AuthContext);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [weeklyAvailability, setWeeklyAvailability] = useState({
        MONDAY: { startTime: '08:00', endTime: '17:00', breakStart: '12:00', breakEnd: '13:00', enabled: true },
        TUESDAY: { startTime: '08:00', endTime: '17:00', breakStart: '12:00', breakEnd: '13:00', enabled: true },
        WEDNESDAY: { startTime: '08:00', endTime: '17:00', breakStart: '12:00', breakEnd: '13:00', enabled: true },
        THURSDAY: { startTime: '08:00', endTime: '17:00', breakStart: '12:00', breakEnd: '13:00', enabled: true },
        FRIDAY: { startTime: '08:00', endTime: '17:00', breakStart: '12:00', breakEnd: '13:00', enabled: true },
        SATURDAY: { startTime: '08:00', endTime: '12:00', breakStart: '', breakEnd: '', enabled: false },
        SUNDAY: { startTime: '08:00', endTime: '12:00', breakStart: '', breakEnd: '', enabled: false }
    });
    const [slotDuration, setSlotDuration] = useState(30); // minutes
    const [availabilityData, setAvailabilityData] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const dayNames = {
        MONDAY: 'Thứ 2',
        TUESDAY: 'Thứ 3', 
        WEDNESDAY: 'Thứ 4',
        THURSDAY: 'Thứ 5',
        FRIDAY: 'Thứ 6',
        SATURDAY: 'Thứ 7',
        SUNDAY: 'Chủ nhật'
    };

    const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

    useEffect(() => {
        if (user && user.id) {
            fetchAvailabilityData();
            fetchWorkingHours();
        }
    }, [user]);

    const fetchAvailabilityData = async () => {
        try {
            setLoading(true);
            const monthStr = currentMonth.toISOString().slice(0, 7) + '-01';
            const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
            const endDateStr = endDate.toISOString().split('T')[0];
            
            const slots = await slotService.getSlotsByDateRange(user.id, monthStr, endDateStr);
            
            // Group slots by date
            const groupedSlots = {};
            slots.forEach(slot => {
                const date = slot.date;
                if (!groupedSlots[date]) {
                    groupedSlots[date] = [];
                }
                groupedSlots[date].push(slot);
            });
            
            setAvailabilityData(groupedSlots);
        } catch (error) {
            console.error('Error fetching availability data:', error);
            setMessage({ type: 'error', text: 'Không thể tải dữ liệu lịch làm việc' });
        } finally {
            setLoading(false);
        }
    };

    const fetchWorkingHours = async () => {
        try {
            const availability = await doctorAvailabilityService.getAvailability(user.id);
            if (availability && availability.length > 0) {
                const newWeeklyAvailability = { ...weeklyAvailability };
                
                availability.forEach(avail => {
                    const dayOfWeek = avail.dayOfWeek;
                    if (newWeeklyAvailability[dayOfWeek]) {
                        newWeeklyAvailability[dayOfWeek] = {
                            startTime: avail.startTime,
                            endTime: avail.endTime,
                            breakStart: '', // Backend doesn't store break time
                            breakEnd: '',
                            enabled: true
                        };
                    }
                });
                
                setWeeklyAvailability(newWeeklyAvailability);
            }
        } catch (error) {
            console.error('Error fetching working hours:', error);
            // Don't show error for this as it's optional
        }
    };

    const generateTimeSlots = (startTime, endTime, duration, breakStart = '', breakEnd = '') => {
        const slots = [];
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        
        while (start < end) {
            const slotStart = start.toTimeString().slice(0, 5);
            start.setMinutes(start.getMinutes() + duration);
            const slotEnd = start.toTimeString().slice(0, 5);
            
            // Skip break time if specified
            if (breakStart && breakEnd && slotStart >= breakStart && slotStart < breakEnd) {
                continue;
            }
            
            slots.push({
                startTime: slotStart,
                endTime: slotEnd,
                available: true
            });
        }
        
        return slots;
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        // Auto-generate slots for the selected date based on weekly availability
        const dayOfWeek = getDayOfWeek(date);
        const dayConfig = weeklyAvailability[dayOfWeek];
        
        if (dayConfig && dayConfig.enabled) {
            const slots = generateTimeSlots(
                dayConfig.startTime, 
                dayConfig.endTime, 
                slotDuration,
                dayConfig.breakStart,
                dayConfig.breakEnd
            );
            const dateStr = date.toISOString().split('T')[0];
            
            setAvailabilityData(prev => ({
                ...prev,
                [dateStr]: slots.map(slot => ({
                    ...slot,
                    date: dateStr,
                    doctorId: user.id
                }))
            }));
        }
    };

    const getDayOfWeek = (date) => {
        const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        return days[date.getDay()];
    };

    const toggleSlotAvailability = (dateStr, slotIndex) => {
        setAvailabilityData(prev => ({
            ...prev,
            [dateStr]: prev[dateStr].map((slot, index) => 
                index === slotIndex 
                    ? { ...slot, available: !slot.available }
                    : slot
            )
        }));
    };

    const saveAvailability = async () => {
        try {
            setSaving(true);
            
            // Convert weekly availability to backend format
            const availabilityDtos = dayOrder
                .filter(day => weeklyAvailability[day].enabled)
                .map(day => ({
                    dayOfWeek: day,
                    startTime: weeklyAvailability[day].startTime,
                    endTime: weeklyAvailability[day].endTime
                }));
            
            // Save to API
            await doctorAvailabilityService.saveWeeklyAvailability(user.id, availabilityDtos);
            
            setMessage({ type: 'success', text: 'Đã lưu lịch làm việc thành công!' });
            
            // Regenerate slots based on new availability
            try {
                setMessage({ type: 'info', text: 'Đang tạo lại các slot thời gian dựa trên lịch làm việc mới...' });
                await slotService.regenerateSlots(user.id);
                setMessage({ 
                    type: 'success', 
                    text: 'Đã lưu lịch làm việc và tạo lại slot thời gian thành công! Các slot mới sẽ có sẵn trong vài giây.' 
                });
            } catch (error) {
                console.error('Error regenerating slots:', error);
                setMessage({ 
                    type: 'warning', 
                    text: 'Đã lưu lịch làm việc nhưng có lỗi khi tạo slot thời gian. Vui lòng thử lại hoặc liên hệ admin.' 
                });
            }
            
            // Refresh availability data
            await fetchAvailabilityData();
            
        } catch (error) {
            console.error('Error saving availability:', error);
            setMessage({ type: 'error', text: error.message || 'Không thể lưu lịch làm việc' });
        } finally {
            setSaving(false);
        }
    };

    const updateWeeklyAvailability = (day, field, value) => {
        setWeeklyAvailability(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [field]: value
            }
        }));
    };

    const toggleDayEnabled = (day) => {
        setWeeklyAvailability(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                enabled: !prev[day].enabled
            }
        }));
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

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        return { daysInMonth, startingDayOfWeek };
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
            const dateStr = date.toISOString().split('T')[0];
            const slots = availabilityData[dateStr] || [];
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            const hasSlots = slots.length > 0;
            const dayOfWeek = getDayOfWeek(date);
            const isWorkingDay = weeklyAvailability[dayOfWeek]?.enabled;
            
            days.push(
                <div 
                    key={day} 
                    className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasSlots ? 'has-slots' : ''} ${!isWorkingDay ? 'non-working' : ''}`}
                    onClick={() => handleDateSelect(date)}
                >
                    <div className="day-number">{day}</div>
                    {hasSlots && (
                        <div className="day-indicator">
                            <CheckCircle size={16} />
                        </div>
                    )}
                    {!isWorkingDay && (
                        <div className="non-working-indicator">
                            <AlertCircle size={14} />
                        </div>
                    )}
                </div>
            );
        }
        
        return days;
    };

    const renderTimeSlots = () => {
        if (!selectedDate) return null;
        
        const dateStr = selectedDate.toISOString().split('T')[0];
        const slots = availabilityData[dateStr] || [];
        const dayOfWeek = getDayOfWeek(selectedDate);
        const dayConfig = weeklyAvailability[dayOfWeek];
        
        if (!dayConfig || !dayConfig.enabled) {
            return (
                <div className="no-slots">
                    <p>Ngày này không phải ngày làm việc</p>
                    <button 
                        className="enable-day-btn"
                        onClick={() => toggleDayEnabled(dayOfWeek)}
                    >
                        <Plus size={16} />
                        Bật lịch làm việc cho {dayNames[dayOfWeek]}
                    </button>
                </div>
            );
        }
        
        if (slots.length === 0) {
            return (
                <div className="no-slots">
                    <p>Chưa có slot thời gian nào cho ngày này</p>
                    <button 
                        className="generate-slots-btn"
                        onClick={() => handleDateSelect(selectedDate)}
                    >
                        <Plus size={16} />
                        Tạo slot thời gian
                    </button>
                </div>
            );
        }

        return (
            <div className="time-slots">
                <h3>Slot thời gian cho {selectedDate.toLocaleDateString('vi-VN')} ({dayNames[dayOfWeek]})</h3>
                <div className="slots-grid">
                    {slots.map((slot, index) => (
                        <div 
                            key={index} 
                            className={`time-slot ${slot.available ? 'available' : 'unavailable'}`}
                            onClick={() => toggleSlotAvailability(dateStr, index)}
                        >
                            <div className="slot-time">
                                {slot.startTime} - {slot.endTime}
                            </div>
                            <div className="slot-status">
                                {slot.available ? (
                                    <CheckCircle size={16} className="status-icon available" />
                                ) : (
                                    <AlertCircle size={16} className="status-icon unavailable" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <DoctorLayout>
                <div className="doctor-availability-loading">
                    <div className="loading-spinner"></div>
                    <p>Đang tải dữ liệu...</p>
                </div>
            </DoctorLayout>
        );
    }

    return (
        <DoctorLayout>
            <div className="doctor-availability-page">
                <div className="page-header">
                    <h1>Thiết lập lịch làm việc</h1>
                    <p>Thiết lập lịch làm việc theo ngày trong tuần</p>
                </div>

                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                        <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
                    </div>
                )}

                <div className="availability-container">
                    {/* Weekly Working Hours Settings */}
                    <Card className="settings-card">
                        <div className="card-header">
                            <Settings size={20} />
                            <h2>Cài đặt lịch làm việc theo tuần</h2>
                        </div>
                        <div className="weekly-working-hours-form">
                            <div className="form-row header-row">
                                <div className="day-header">Ngày</div>
                                <div className="time-header">Giờ bắt đầu</div>
                                <div className="time-header">Giờ kết thúc</div>
                                <div className="break-header">Giờ nghỉ trưa</div>
                                <div className="enabled-header">Bật/Tắt</div>
                            </div>
                            
                            {dayOrder.map(day => (
                                <div key={day} className="form-row day-row">
                                    <div className="day-label">
                                        <input
                                            type="checkbox"
                                            checked={weeklyAvailability[day].enabled}
                                            onChange={() => toggleDayEnabled(day)}
                                        />
                                        <span>{dayNames[day]}</span>
                                    </div>
                                    
                                    <div className="time-inputs">
                                        <input
                                            type="time"
                                            value={weeklyAvailability[day].startTime}
                                            onChange={(e) => updateWeeklyAvailability(day, 'startTime', e.target.value)}
                                            disabled={!weeklyAvailability[day].enabled}
                                        />
                                    </div>
                                    
                                    <div className="time-inputs">
                                        <input
                                            type="time"
                                            value={weeklyAvailability[day].endTime}
                                            onChange={(e) => updateWeeklyAvailability(day, 'endTime', e.target.value)}
                                            disabled={!weeklyAvailability[day].enabled}
                                        />
                                    </div>
                                    
                                    <div className="break-inputs">
                                        <input
                                            type="time"
                                            value={weeklyAvailability[day].breakStart}
                                            onChange={(e) => updateWeeklyAvailability(day, 'breakStart', e.target.value)}
                                            disabled={!weeklyAvailability[day].enabled}
                                            placeholder="Bắt đầu"
                                        />
                                        <span>-</span>
                                        <input
                                            type="time"
                                            value={weeklyAvailability[day].breakEnd}
                                            onChange={(e) => updateWeeklyAvailability(day, 'breakEnd', e.target.value)}
                                            disabled={!weeklyAvailability[day].enabled}
                                            placeholder="Kết thúc"
                                        />
                                    </div>
                                    
                                    <div className="enabled-status">
                                        {weeklyAvailability[day].enabled ? (
                                            <CheckCircle size={20} className="enabled-icon" />
                                        ) : (
                                            <AlertCircle size={20} className="disabled-icon" />
                                        )}
                                    </div>
                                </div>
                            ))}
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Thời lượng mỗi slot (phút):</label>
                                    <select
                                        value={slotDuration}
                                        onChange={(e) => setSlotDuration(Number(e.target.value))}
                                    >
                                        <option value={15}>15 phút</option>
                                        <option value={30}>30 phút</option>
                                        <option value={45}>45 phút</option>
                                        <option value={60}>60 phút</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="form-actions">
                                <button 
                                    className="save-working-hours-btn"
                                    onClick={saveAvailability}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <div className="loading-spinner small"></div>
                                            Đang lưu...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} />
                                            Lưu lịch làm việc
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </Card>

                    <div className="main-content">
                        {/* Calendar */}
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
                                    <div className="legend-color today"></div>
                                    <span>Hôm nay</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-color selected"></div>
                                    <span>Đã chọn</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-color has-slots"></div>
                                    <span>Có slot</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-color non-working"></div>
                                    <span>Không làm việc</span>
                                </div>
                            </div>
                        </Card>

                        {/* Time Slots */}
                        <Card className="slots-card">
                            {renderTimeSlots()}
                        </Card>
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default DoctorAvailabilityPage;
