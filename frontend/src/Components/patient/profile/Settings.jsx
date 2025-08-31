import React, { useState, useContext } from 'react';
import { Eye, EyeOff, Lock, Bell, Shield, Trash2 } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';
import axios from 'axios';
import { config } from '../../../config/config.js';

const Settings = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('security');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: true,
    app: true,
    appointments: true,
    reminders: true,
    promotions: false
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    shareHealthData: false,
    allowAnonymousData: true,
    showProfileToPublic: false
  });
  
  const [deleteAccount, setDeleteAccount] = useState({
    confirmText: '',
    reason: ''
  });
  
  const [saving, setSaving] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked
    });
  };

  const handlePrivacyChange = (e) => {
    const { name, checked } = e.target;
    setPrivacySettings({
      ...privacySettings,
      [name]: checked
    });
  };

  const handleDeleteAccountChange = (e) => {
    const { name, value } = e.target;
    setDeleteAccount({
      ...deleteAccount,
      [name]: value
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setPasswordError("Mật khẩu mới phải có ít nhất 8 ký tự");
      return;
    }
    
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      await axios.post(`${config.API_BASE_URL}/user/change-password`, passwordData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      });
      
      setPasswordSuccess("Mật khẩu đã được thay đổi thành công");
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setPasswordError(error.response?.data?.message || "Đã xảy ra lỗi khi thay đổi mật khẩu");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotificationSettings = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
              await axios.put(`${config.API_BASE_URL}/user/settings/notifications`, notificationSettings, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      });
      
      alert("Cài đặt thông báo đã được lưu");
    } catch (error) {
      alert("Đã xảy ra lỗi khi lưu cài đặt thông báo");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePrivacySettings = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
              await axios.put(`${config.API_BASE_URL}/user/settings/privacy`, privacySettings, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      });
      
      alert("Cài đặt quyền riêng tư đã được lưu");
    } catch (error) {
      alert("Đã xảy ra lỗi khi lưu cài đặt quyền riêng tư");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccountSubmit = async () => {
    if (deleteAccount.confirmText !== 'XÓA TÀI KHOẢN') {
      alert("Vui lòng nhập chính xác cụm từ XÓA TÀI KHOẢN để xác nhận");
      return;
    }
    
    if (!deleteAccount.reason) {
      alert("Vui lòng cho chúng tôi biết lý do bạn muốn xóa tài khoản");
      return;
    }
    
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.")) {
      try {
        setSaving(true);
        const token = localStorage.getItem('token');
        await axios.delete(`${config.API_BASE_URL}/user/delete-account`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          data: {
            reason: deleteAccount.reason
          }
        });
        
        alert("Tài khoản của bạn đã được xóa thành công");
        logout();
      } catch (error) {
        alert("Đã xảy ra lỗi khi xóa tài khoản");
      } finally {
        setSaving(false);
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'security':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Bảo mật tài khoản</h3>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h4 className="font-medium mb-4">Thay đổi mật khẩu</h4>
              
              {passwordError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {passwordError}
                </div>
              )}
              
              {passwordSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                  {passwordSuccess}
                </div>
              )}
              
              <form onSubmit={handleChangePassword}>
                <div className="mb-4">
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu hiện tại
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Mật khẩu phải có ít nhất 8 ký tự</p>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className={`px-4 py-2 ${saving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md transition duration-300`}
                  >
                    {saving ? 'Đang lưu...' : 'Thay đổi mật khẩu'}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
              <h4 className="font-medium mb-4">Xác thực hai yếu tố (2FA)</h4>
              <p className="text-gray-600 mb-4">
                Bảo vệ tài khoản của bạn với xác thực hai yếu tố. Mỗi khi đăng nhập, bạn sẽ cần nhập mã từ email hoặc tin nhắn SMS.
              </p>
              
              <div className="flex items-center">
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300">
                  Bật xác thực hai yếu tố
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'notifications':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Cài đặt thông báo</h3>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h4 className="font-medium mb-4">Kênh thông báo</h4>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="email"
                      name="email"
                      checked={notificationSettings.email}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="email" className="ml-2 block text-gray-700">
                      Email
                    </label>
                  </div>
                  <span className="text-sm text-gray-500">{user.email}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sms"
                      name="sms"
                      checked={notificationSettings.sms}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="sms" className="ml-2 block text-gray-700">
                      SMS
                    </label>
                  </div>
                  <span className="text-sm text-gray-500">{user.phone}</span>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="app"
                    name="app"
                    checked={notificationSettings.app}
                    onChange={handleNotificationChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="app" className="ml-2 block text-gray-700">
                    Thông báo ứng dụng
                  </label>
                </div>
              </div>
              
              <h4 className="font-medium mb-4">Loại thông báo</h4>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="appointments"
                    name="appointments"
                    checked={notificationSettings.appointments}
                    onChange={handleNotificationChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="appointments" className="ml-2 block text-gray-700">
                    Lịch hẹn (xác nhận, nhắc nhở, thay đổi)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="reminders"
                    name="reminders"
                    checked={notificationSettings.reminders}
                    onChange={handleNotificationChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="reminders" className="ml-2 block text-gray-700">
                    Nhắc nhở về sức khỏe (uống thuốc, tái khám)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="promotions"
                    name="promotions"
                    checked={notificationSettings.promotions}
                    onChange={handleNotificationChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="promotions" className="ml-2 block text-gray-700">
                    Khuyến mãi và tin tức
                  </label>
                </div>
              </div>
              
              <button
                onClick={handleSaveNotificationSettings}
                disabled={saving}
                className={`px-4 py-2 ${saving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md transition duration-300`}
              >
                {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
              </button>
            </div>
          </div>
        );
        
      case 'privacy':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Quyền riêng tư</h3>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h4 className="font-medium mb-4">Chia sẻ dữ liệu</h4>
              
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id="shareHealthData"
                      name="shareHealthData"
                      checked={privacySettings.shareHealthData}
                      onChange={handlePrivacyChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="shareHealthData" className="ml-2 block text-gray-700 font-medium">
                      Chia sẻ dữ liệu sức khỏe với bác sĩ
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 ml-6">
                    Cho phép bác sĩ xem hồ sơ sức khỏe của bạn ngay cả khi không có cuộc hẹn hiện tại
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id="allowAnonymousData"
                      name="allowAnonymousData"
                      checked={privacySettings.allowAnonymousData}
                      onChange={handlePrivacyChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="allowAnonymousData" className="ml-2 block text-gray-700 font-medium">
                      Cho phép chia sẻ dữ liệu ẩn danh
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 ml-6">
                    Chia sẻ dữ liệu ẩn danh cho mục đích nghiên cứu và cải thiện dịch vụ
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id="showProfileToPublic"
                      name="showProfileToPublic"
                      checked={privacySettings.showProfileToPublic}
                      onChange={handlePrivacyChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="showProfileToPublic" className="ml-2 block text-gray-700 font-medium">
                      Hiển thị hồ sơ với người dùng khác
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 ml-6">
                    Cho phép người dùng khác thấy thông tin cơ bản của bạn
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleSavePrivacySettings}
                disabled={saving}
                className={`px-4 py-2 ${saving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md transition duration-300`}
              >
                {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
              <h4 className="font-medium mb-4">Xuất dữ liệu</h4>
              <p className="text-gray-600 mb-4">
                Bạn có thể tải xuống một bản sao dữ liệu hồ sơ và lịch sử y tế của mình bất kỳ lúc nào.
              </p>
              <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-300">
                Xuất dữ liệu của tôi
              </button>
            </div>
          </div>
        );
        
      case 'delete':
        return (
          <div>
            <h3 className="text-lg font-medium text-red-600 mb-4">Xóa tài khoản</h3>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="bg-red-50 p-4 rounded-md mb-6">
                <h4 className="font-medium text-red-800 mb-2">Cảnh báo</h4>
                <p className="text-red-700 text-sm">
                  Xóa tài khoản sẽ xóa vĩnh viễn tất cả dữ liệu của bạn, bao gồm hồ sơ cá nhân, lịch sử khám bệnh, lịch hẹn và giao dịch. Hành động này không thể hoàn tác.
                </p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                  Lý do bạn muốn xóa tài khoản
                </label>
                <select
                  id="reason"
                  name="reason"
                  value={deleteAccount.reason}
                  onChange={handleDeleteAccountChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Chọn lý do --</option>
                  <option value="Không còn sử dụng dịch vụ">Không còn sử dụng dịch vụ</option>
                  <option value="Không hài lòng với dịch vụ">Không hài lòng với dịch vụ</option>
                  <option value="Lo ngại về quyền riêng tư">Lo ngại về quyền riêng tư</option>
                  <option value="Tạo tài khoản mới">Tạo tài khoản mới</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirmText" className="block text-sm font-medium text-gray-700 mb-1">
                  Để xác nhận, vui lòng nhập "XÓA TÀI KHOẢN"
                </label>
                <input
                  type="text"
                  id="confirmText"
                  name="confirmText"
                  value={deleteAccount.confirmText}
                  onChange={handleDeleteAccountChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="XÓA TÀI KHOẢN"
                />
              </div>
              
              <button
                onClick={handleDeleteAccountSubmit}
                disabled={saving}
                className={`px-4 py-2 ${saving ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'} text-white rounded-md transition duration-300 flex items-center`}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {saving ? 'Đang xử lý...' : 'Xóa tài khoản của tôi'}
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Cài đặt tài khoản</h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <button
              className={`w-full text-left px-4 py-3 border-l-4 ${
                activeTab === 'security'
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-transparent hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('security')}
            >
              <div className="flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                <span>Bảo mật</span>
              </div>
            </button>
            
            <button
              className={`w-full text-left px-4 py-3 border-l-4 ${
                activeTab === 'notifications'
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-transparent hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('notifications')}
            >
              <div className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                <span>Thông báo</span>
              </div>
            </button>
            
            <button
              className={`w-full text-left px-4 py-3 border-l-4 ${
                activeTab === 'privacy'
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-transparent hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('privacy')}
            >
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                <span>Quyền riêng tư</span>
              </div>
            </button>
            
            <button
              className={`w-full text-left px-4 py-3 border-l-4 ${
                activeTab === 'delete'
                  ? 'border-red-600 bg-red-50 text-red-600'
                  : 'border-transparent hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('delete')}
            >
              <div className="flex items-center">
                <Trash2 className="w-5 h-5 mr-2" />
                <span>Xóa tài khoản</span>
              </div>
            </button>
          </div>
        </div>
        
        {/* Settings Content */}
        <div className="w-full md:w-3/4">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings; 