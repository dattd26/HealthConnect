import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '../../../config/config.js';
import { Calendar, Clock, MapPin, User, AlertCircle } from 'lucide-react';

const Appointments = ({ userId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.API_BASE_URL}/appointments/patient/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        });
        setAppointments(response.data);
      } catch (error) {
        setError("Đã xảy ra lỗi khi tải lịch hẹn: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userId]);

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này không?')) {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        await axios.put(`${config.API_BASE_URL}/appointments/${appointmentId}/cancel`, 
          { reason: "Hủy bởi người dùng" },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            }
          }
        );
        
        // Update the appointment status in the UI
        setAppointments(prevAppointments => 
          prevAppointments.map(appointment => 
            appointment.id === appointmentId 
              ? { ...appointment, status: 'CANCELLED' } 
              : appointment
          )
        );
      } catch (error) {
        alert("Đã xảy ra lỗi khi hủy lịch hẹn: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRescheduleAppointment = (appointmentId) => {
    // Navigate to reschedule page/modal
    console.log("Reschedule appointment:", appointmentId);
  };

  // Filter appointments based on active tab
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.appointmentDate);
    const today = new Date();
    
    if (activeTab === 'upcoming') {
      return appointmentDate >= today && appointment.status !== 'CANCELLED';
    } else if (activeTab === 'past') {
      return appointmentDate < today || appointment.status === 'COMPLETED';
    } else if (activeTab === 'cancelled') {
      return appointment.status === 'CANCELLED';
    }
    return true;
  });
  
  // Sort appointments by date (newest first for past, oldest first for upcoming)
  filteredAppointments.sort((a, b) => {
    const dateA = new Date(a.appointmentDate);
    const dateB = new Date(b.appointmentDate);
    return activeTab === 'past' ? dateB - dateA : dateA - dateB;
  });

  const getStatusLabel = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return { label: 'Đã đặt lịch', color: 'blue' };
      case 'CONFIRMED':
        return { label: 'Đã xác nhận', color: 'green' };
      case 'COMPLETED':
        return { label: 'Đã hoàn thành', color: 'green' };
      case 'CANCELLED':
        return { label: 'Đã hủy', color: 'red' };
      case 'PENDING':
        return { label: 'Đang chờ', color: 'yellow' };
      default:
        return { label: 'Không xác định', color: 'gray' };
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Lịch hẹn khám bệnh</h2>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <button
            className={`py-2 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'upcoming'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('upcoming')}
          >
            Sắp tới
          </button>
          <button
            className={`ml-6 py-2 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'past'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('past')}
          >
            Đã qua
          </button>
          <button
            className={`ml-6 py-2 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'cancelled'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('cancelled')}
          >
            Đã hủy
          </button>
        </nav>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Không có lịch hẹn nào</p>
          {activeTab === 'upcoming' && (
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
              Đặt lịch khám mới
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => {
            const status = getStatusLabel(appointment.status);
            return (
              <div key={appointment.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      {appointment.appointmentType === 'ONLINE' ? 'Tư vấn trực tuyến' : 'Khám trực tiếp'}
                    </h3>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>
                        {new Date(appointment.appointmentDate).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{appointment.timeSlot}</span>
                    </div>
                  </div>
                  <div className="mt-3 md:mt-0 md:text-right">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${status.color}-100 text-${status.color}-800`}
                    >
                      {status.label}
                    </span>
                    {appointment.status === 'CANCELLED' && appointment.cancellationReason && (
                      <div className="flex items-start mt-1 text-sm text-red-500">
                        <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                        <span>{appointment.cancellationReason}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-start mb-2">
                    <User className="w-4 h-4 mr-2 mt-0.5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Bác sĩ</p>
                      <p className="font-medium">BS. {appointment.doctor.fullName}</p>
                      <p className="text-sm text-gray-500">{appointment.doctor.specialty}</p>
                    </div>
                  </div>

                  {appointment.appointmentType === 'OFFLINE' && appointment.location && (
                    <div className="flex items-start mb-2">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Địa điểm</p>
                        <p className="font-medium">{appointment.location}</p>
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-gray-600 mt-2">
                    {appointment.notes || 'Không có ghi chú'}
                  </p>
                </div>

                {(appointment.status === 'SCHEDULED' || appointment.status === 'CONFIRMED') && (
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      onClick={() => handleRescheduleAppointment(appointment.id)}
                      className="px-3 py-1.5 text-sm bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-300"
                    >
                      Đổi lịch
                    </button>
                    <button
                      onClick={() => handleCancelAppointment(appointment.id)}
                      className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition duration-300"
                    >
                      Hủy lịch
                    </button>
                  </div>
                )}

                {appointment.appointmentType === 'ONLINE' && appointment.status === 'CONFIRMED' && (
                  <div className="mt-4">
                    <button className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300">
                      Vào phòng tư vấn
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Appointments; 