import React, { useState, useEffect } from "react";
import axios from "axios";
import AppointmentsList from "../Components/appointment/AppointmentsList";
import CreateAppointment from "../Components/appointment/CreateAppointment";
import Loading from "../Components/common/Loading";

const BookAppointmentPage = () => {
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("create"); // 'create' or 'list'

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(response.data.id);
        setRole(response.data.role);

        if (response.data.role === "PATIENT") {
          const doctorsResponse = await axios.get("http://localhost:8080/api/user/doctors", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setDoctors(doctorsResponse.data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Lỗi tải thông tin người dùng:", err);
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) return <Loading />

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Đặt lịch khám bệnh</h1>
        <p className="text-gray-500">Đặt lịch khám với bác sĩ chuyên khoa một cách nhanh chóng và thuận tiện</p>
      </div>
      
      {/* Mobile Tabs - Only visible on small screens */}
      {role === "PATIENT" && (
        <div className="md:hidden mb-6">
          <div className="flex rounded-md shadow-sm bg-gray-100 p-1">
            <button
              className={`flex-1 py-2 px-4 rounded-md font-medium text-sm ${
                activeTab === "create" 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("create")}
            >
              Tạo lịch hẹn
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md font-medium text-sm ${
                activeTab === "list" 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("list")}
            >
              Lịch hẹn của tôi
            </button>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-8">
        {role === "PATIENT" && (
          <div 
            className={`w-full md:w-2/3 ${
              activeTab === "list" ? "hidden md:block" : ""
            }`}
          >
            <CreateAppointment doctors={doctors} />
          </div>
        )}
        
        <div 
          className={`w-full md:w-${role === "PATIENT" ? "1/3" : "full"} bg-gray-50 rounded-lg p-6 shadow-sm ${
            role === "PATIENT" && activeTab === "create" ? "hidden md:block" : ""
          }`}
        >
          <div className="sticky top-4">
            <h3 className="text-xl font-semibold text-blue-600 mb-4">Lịch hẹn của tôi</h3>
            <AppointmentsList userId={userId} role={role} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentPage; 