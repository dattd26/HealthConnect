import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import ProfileSidebar from '../Components/patient/profile/ProfileSidebar';
import PersonalInfo from '../Components/patient/profile/PersonalInfo';
import HealthRecord from '../Components/patient/profile/HealthRecord';
import MedicalHistory from '../Components/patient/profile/MedicalHistory';
import Appointments from '../Components/patient/profile/Appointments';
import Payments from '../Components/patient/profile/Payments';
import Settings from '../Components/patient/profile/Settings';
import LoadingOverlay from '../Components/common/LoadingOverlay';
import PatientLayout from '../Components/patient/PatientLayout';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal-info');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async() => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:8080/api/user/profile", {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        });
        setUserData(response.data);
      } catch (error) {
        setError("Lỗi tải dữ liệu: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    setTimeout(fetchUserData, 1000);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal-info':
        return <PersonalInfo userData={userData} isLoading={loading} />;
      case 'health-record':
        return <HealthRecord userData={userData} />;
      case 'medical-history':
        return <MedicalHistory />;
      case 'appointments':
        return <Appointments userId={user?.id} />;
      case 'payments':
        return <Payments />;
      case 'settings':
        return <Settings />;
      default:
        return <PersonalInfo userData={userData} isLoading={loading} />;
    }
  };

  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <LoadingOverlay 
      isLoading={loading} 
      message="Đang tải thông tin hồ sơ..."
      overlayOpacity="bg-white/80"
      position="center"
    >
      <PatientLayout>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8"> 
            <div className="bg-gradient-to-tr from-primary-600 to-secondary-600 rounded-2xl p-8 text-white shadow-lg">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="mb-4 md:mb-0">
                  <h1 className="text-3xl font-bold mb-2">Hồ sơ người dùng</h1>
                  <p className="text-blue-100 text-lg">
                    Quản lý thông tin cá nhân và lịch sử y tế của bạn
                  </p>
                </div>
                {/* <div className="flex flex-col sm:flex-row gap-3">
                  <button className="bg-white/20 hover:bg-white/30 text-white py-3 px-6 rounded-xl transition duration-300 border border-white/30 backdrop-blur-sm flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Đặt lịch khám
                  </button>
                  <button className="bg-white/20 hover:bg-white/30 text-white py-3 px-6 rounded-xl transition duration-300 border border-white/30 backdrop-blur-sm flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 00-2-2V8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Tư vấn trực tuyến
                  </button>
                </div> */}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            {/* <div className="lg:w-80">
              <div className="sticky top-4">
                <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
              </div>
            </div> */}

            {/* Main Content Area */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 capitalize">
                    {activeTab === 'personal-info' && 'Thông tin cá nhân'}
                    {activeTab === 'health-record' && 'Hồ sơ sức khỏe'}
                    {activeTab === 'medical-history' && 'Lịch sử y tế'}
                    {activeTab === 'appointments' && 'Lịch hẹn'}
                    {activeTab === 'payments' && 'Thanh toán'}
                    {activeTab === 'settings' && 'Cài đặt'}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {activeTab === 'personal-info' && 'Cập nhật và quản lý thông tin cá nhân của bạn'}
                    {activeTab === 'health-record' && 'Xem và quản lý hồ sơ sức khỏe'}
                    {activeTab === 'medical-history' && 'Lịch sử khám bệnh và điều trị'}
                    {activeTab === 'appointments' && 'Quản lý lịch hẹn khám bệnh'}
                    {activeTab === 'payments' && 'Lịch sử thanh toán và hóa đơn'}
                    {activeTab === 'settings' && 'Cài đặt tài khoản và bảo mật'}
                  </p>
                </div>
                <div className="p-6">
                  {renderTabContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PatientLayout>
    </LoadingOverlay>
  );
};

export default ProfilePage; 