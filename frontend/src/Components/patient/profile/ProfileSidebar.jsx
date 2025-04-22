import React from 'react';
import { 
  User, 
  Heart, 
  ClipboardList, 
  Calendar, 
  CreditCard, 
  Settings as SettingsIcon 
} from 'lucide-react';

const ProfileSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'personal-info', label: 'Thông tin cá nhân', icon: <User className="w-5 h-5" /> },
    { id: 'health-record', label: 'Hồ sơ sức khỏe', icon: <Heart className="w-5 h-5" /> },
    { id: 'medical-history', label: 'Lịch sử khám bệnh', icon: <ClipboardList className="w-5 h-5" /> },
    { id: 'appointments', label: 'Lịch hẹn', icon: <Calendar className="w-5 h-5" /> },
    { id: 'payments', label: 'Thanh toán và hóa đơn', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'settings', label: 'Cài đặt tài khoản', icon: <SettingsIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Hồ sơ của tôi</h2>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`w-full flex items-center p-3 rounded-md transition duration-200
                  ${activeTab === item.id
                    ? 'bg-blue-100 text-blue-600 hover:bg-gray-100'
                    : 'text-gray-600 hover:bg-gray-100 bg-white'
                  }`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default ProfileSidebar; 