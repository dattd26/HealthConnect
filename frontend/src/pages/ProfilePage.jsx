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
import Loading from '../Components/common/Loading';


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

  if (loading) return <Loading />;

  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Hồ sơ người dùng</h1>
          <div className="flex space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300">
              Đặt lịch khám
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-300">
              Tư vấn trực tuyến
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main Content Area */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 