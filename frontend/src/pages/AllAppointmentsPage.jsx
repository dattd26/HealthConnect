import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { appointmentService } from '../services/appointmentService';
import PatientLayout from '../Components/patient/PatientLayout';
import AppointmentCardEnhanced from '../Components/appointment/AppointmentCardEnhanced';
import axios from 'axios';
import './AllAppointmentsPage.css';

const AllAppointmentsPage = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past', 'pending', 'confirmed', 'completed', 'cancelled'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date', 'doctor', 'status'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', 'calendar'

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAppointments(user?.id, 'PATIENT');
      setAppointments(data);
    } catch (error) {
      console.error('Lỗi tải lịch hẹn:', error);
      // Fallback data for demo
      setAppointments([
        {
          id: 1,
          doctorName: 'Dr. Nguyễn Văn A',
          specialty: 'Tim mạch',
          date: '2024-01-15',
          time: '09:00',
          status: 'CONFIRMED',
          patientName: 'Nguyễn Thị B',
          symptoms: 'Đau ngực, khó thở',
          notes: 'Khám định kỳ'
        },
        {
          id: 2,
          doctorName: 'Dr. Trần Thị B',
          specialty: 'Nội khoa',
          date: '2024-01-10',
          time: '14:00',
          status: 'COMPLETED',
          patientName: 'Nguyễn Thị B',
          symptoms: 'Sốt, ho',
          notes: 'Khám bệnh'
        },
        {
          id: 3,
          doctorName: 'Dr. Lê Văn C',
          specialty: 'Da liễu',
          date: '2024-01-20',
          time: '10:30',
          status: 'PENDING_PAYMENT',
          patientName: 'Nguyễn Thị B',
          symptoms: 'Nổi mẩn đỏ',
          notes: 'Khám mới'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/appointments/${appointmentId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Lịch hẹn đã được hủy.");
      fetchAppointments();
    } catch (err) {
      console.error("Lỗi hủy lịch hẹn:", err);
      alert("Không thể hủy lịch hẹn này.");
    }
  };

  const handleConfirm = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/appointments/${appointmentId}/confirm`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Lịch hẹn đã được xác nhận.");
      fetchAppointments();
    } catch (err) {
      console.error("Lỗi xác nhận lịch hẹn:", err);
      alert("Không thể xác nhận lịch hẹn này.");
    }
  };

  const handleStart = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/appointments/${appointmentId}/start`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Lịch hẹn đã bắt đầu.");
      fetchAppointments();
    } catch (err) {
      console.error("Lỗi bắt đầu lịch hẹn:", err);
      alert("Không thể bắt đầu lịch hẹn này.");
    }
  };

  const handleComplete = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/appointments/${appointmentId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Lịch hẹn đã hoàn thành.");
      fetchAppointments();
    } catch (err) {
      console.error("Lỗi hoàn thành lịch hẹn:", err);
      alert("Không thể hoàn thành lịch hẹn này.");
    }
  };

  const handlePayment = async (appointmentId) => {
    try {
      window.location.href = `/payment/${appointmentId}`;
    } catch (err) {
      console.error("Lỗi chuyển hướng thanh toán:", err);
      alert("Không thể chuyển hướng đến trang thanh toán.");
    }
  };

  // Filter appointments
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.patientName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'upcoming' && new Date(appointment.date) > new Date()) ||
                         (filter === 'past' && new Date(appointment.date) <= new Date()) ||
                         appointment.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  // Sort appointments
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
      case 'doctor':
        aValue = a.doctorName || '';
        bValue = b.doctorName || '';
        break;
      case 'status':
        aValue = a.status || '';
        bValue = b.status || '';
        break;
      default:
        aValue = a.date;
        bValue = b.date;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PAYMENT_PENDING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return 'Chờ thanh toán';
      case 'PAYMENT_PENDING':
        return 'Đang xử lý thanh toán';
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'IN_PROGRESS':
        return 'Đang diễn ra';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <PatientLayout>
        <div className="all-appointments-page">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải lịch hẹn...</p>
          </div>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <div className="all-appointments-page">
        {/* Header Section */}
        <div className="page-header">
          <div className="header-content">
            <h1>Quản lý lịch hẹn</h1>
            <p>Xem và quản lý tất cả lịch hẹn của bạn</p>
          </div>
          <div className="header-actions">
            <button className="btn-primary" onClick={() => window.location.href = '/book-appointment'}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Đặt lịch hẹn mới
            </button>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="controls-section">
          <div className="search-filter">
            <div className="search-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên bác sĩ, chuyên khoa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-buttons">
            <button
                className={`filter-btn in-progress-filter ${filter === 'IN_PROGRESS' ? 'active' : ''}`}
                onClick={() => setFilter('IN_PROGRESS')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{marginRight: '6px'}}>
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Đang diễn ra
              </button>
              <button
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                Tất cả
              </button>
              <button
                className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
                onClick={() => setFilter('upcoming')}
              >
                Sắp tới
              </button>
              <button
                className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
                onClick={() => setFilter('past')}
              >
                Đã qua
              </button>
              <button
                className={`filter-btn ${filter === 'CONFIRMED' ? 'active' : ''}`}
                onClick={() => setFilter('CONFIRMED')}
              >
                Đã xác nhận
              </button>
              <button
                className={`filter-btn ${filter === 'PENDING_PAYMENT' ? 'active' : ''}`}
                onClick={() => setFilter('PENDING_PAYMENT')}
              >
                Chờ thanh toán
              </button>
              
            </div>
          </div>

          <div className="sort-controls">
            <div className="sort-group">
              <label>Sắp xếp theo:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date">Ngày</option>
                <option value="doctor">Bác sĩ</option>
                <option value="status">Trạng thái</option>
              </select>
            </div>
            
            <div className="sort-order">
              <button
                className={`sort-btn ${sortOrder === 'asc' ? 'active' : ''}`}
                onClick={() => setSortOrder('asc')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M7 14l5-5 5 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                className={`sort-btn ${sortOrder === 'desc' ? 'active' : ''}`}
                onClick={() => setSortOrder('desc')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M7 10l5 5 5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="view-mode">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Xem dạng lưới"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="7" height="7" strokeWidth="2"/>
                  <rect x="14" y="3" width="7" height="7" strokeWidth="2"/>
                  <rect x="14" y="14" width="7" height="7" strokeWidth="2"/>
                  <rect x="3" y="14" width="7" height="7" strokeWidth="2"/>
                </svg>
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="Xem dạng danh sách"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="8" y1="6" x2="21" y2="6" strokeWidth="2"/>
                  <line x1="8" y1="12" x2="21" y2="12" strokeWidth="2"/>
                  <line x1="8" y1="18" x2="21" y2="18" strokeWidth="2"/>
                  <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="2"/>
                  <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="2"/>
                  <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon upcoming">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" strokeWidth="2"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3>{appointments.filter(a => new Date(a.date) > new Date()).length}</h3>
              <p>Lịch hẹn sắp tới</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon confirmed">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" strokeWidth="2"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3>{appointments.filter(a => a.status === 'CONFIRMED').length}</h3>
              <p>Đã xác nhận</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon pending">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3>{appointments.filter(a => a.status === 'PENDING_PAYMENT').length}</h3>
              <p>Chờ thanh toán</p>
            </div>
          </div>
          
          <div className="stat-card in-progress-stat">
            <div className="stat-icon in-progress">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3>{appointments.filter(a => a.status === 'IN_PROGRESS').length}</h3>
              <p>Đang diễn ra</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon completed">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" strokeWidth="2"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3>{appointments.filter(a => a.status === 'COMPLETED').length}</h3>
              <p>Đã hoàn thành</p>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="appointments-section">
          {sortedAppointments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="1"/>
                </svg>
              </div>
              <h3>Không có lịch hẹn nào</h3>
              <p>
                {filter === 'all' 
                  ? 'Bạn chưa có lịch hẹn nào. Hãy đặt lịch hẹn đầu tiên!'
                  : `Không có lịch hẹn nào phù hợp với bộ lọc "${filter}"`
                }
              </p>
              <button 
                className="btn-primary"
                onClick={() => {
                  setFilter('all');
                  setSearchTerm('');
                }}
              >
                Xem tất cả lịch hẹn
              </button>
            </div>
          ) : (
            <div className={`appointments-container ${viewMode}`}>
              {sortedAppointments.map((appointment) => (
                <AppointmentCardEnhanced
                  key={appointment.id}
                  appointment={appointment}
                  onCancel={handleCancel}
                  onConfirm={handleConfirm}
                  onStart={handleStart}
                  onComplete={handleComplete}
                  onPayment={handlePayment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </PatientLayout>
  );
};

export default AllAppointmentsPage;
