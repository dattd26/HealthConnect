import React, { useState, useEffect } from "react";
import axios from "axios";
import AppointmentsList from "../Components/appointment/AppointmentsList";
import CreateAppointment from "../Components/appointment/CreateAppointment";
import LoadingOverlay from "../Components/common/LoadingOverlay";
import PatientLayout from "../Components/patient/PatientLayout";

const BookAppointmentPage = () => {
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("create"); // 'create' | 'list'

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
          const doctorsResponse = await axios.get(
            "http://localhost:8080/api/user/doctors",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setDoctors(doctorsResponse.data || []);
        }
      } catch (err) {
        console.error("Lỗi tải thông tin người dùng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  return (
    <LoadingOverlay 
      isLoading={loading} 
      message="Đang tải thông tin đặt lịch..."
      overlayOpacity="bg-white/80"
      position="center"
    >
      <PatientLayout>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">Đặt lịch khám bệnh</h1>
            <p className="text-gray-500">
              Đặt lịch khám với bác sĩ chuyên khoa một cách nhanh chóng và thuận tiện
            </p>
          </div>

          {/* Mobile Tabs */}
          {role === "PATIENT" && (
            <div className="md:hidden mb-6">
              <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                <button
                  className={`flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition ${
                    activeTab === "create"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveTab("create")}
                >
                  Tạo lịch hẹn
                </button>
                <button
                  className={`flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition ${
                    activeTab === "list"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveTab("list")}
                >
                  Lịch hẹn của tôi
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Create appointment */}
            {role === "PATIENT" && (
              <div className={`w-full lg:w-2/3 ${activeTab === "list" ? "hidden lg:block" : ""}`}>
                <CreateAppointment doctors={doctors} />
              </div>
            )}

            {/* Right: My appointments */}
            <div
              className={`w-full ${
                role === "PATIENT" ? "lg:w-1/3" : "lg:w-full"
              } ${role === "PATIENT" && activeTab === "create" ? "hidden lg:block" : ""}`}
            >
              <div className="lg:sticky lg:top-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-blue-700 mb-4">Lịch hẹn của tôi</h3>
                  <AppointmentsList userId={userId} role={role} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PatientLayout>
    </LoadingOverlay>
  );
};

export default BookAppointmentPage;
