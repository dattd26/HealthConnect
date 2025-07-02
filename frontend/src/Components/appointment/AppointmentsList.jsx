import React, { useEffect, useState } from "react";
import { appointmentService } from "../../services/appointmentService";
import AppointmentCard from "./AppointmentCard";

const AppointmentsList = ({ userId, role }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming"); // 'upcoming', 'past', 'all'

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await appointmentService.getAppointments(userId, role);
        setAppointments(data);
      } catch (err) {
        console.error("Lỗi tải lịch hẹn:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [userId, role]);

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    const now = new Date();
    
    if (filter === "upcoming") return appointmentDate > now;
    if (filter === "past") return appointmentDate <= now;
    return true; // 'all'
  });

  if (loading) return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span className="ml-2 text-gray-600">Đang tải lịch hẹn...</span>
    </div>
  );

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            filter === "upcoming" 
              ? "text-blue-600 border-b-2 border-blue-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setFilter("upcoming")}
        >
          Sắp tới
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            filter === "past" 
              ? "text-blue-600 border-b-2 border-blue-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setFilter("past")}
        >
          Đã qua
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            filter === "all" 
              ? "text-blue-600 border-b-2 border-blue-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setFilter("all")}
        >
          Tất cả
        </button>
      </div>
      
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2 text-gray-600">
            {filter === "upcoming" 
              ? "Không có lịch hẹn sắp tới nào." 
              : filter === "past" 
              ? "Không có lịch hẹn đã qua nào."
              : "Không có lịch hẹn nào."}
          </p>
          {filter !== "upcoming" && (
            <button 
              onClick={() => setFilter("upcoming")} 
              className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Xem lịch hẹn sắp tới
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              role={role}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;