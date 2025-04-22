import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import axios from 'axios';

const PersonalInfo = ({ userData, isLoading }) => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: userData?.fullName || '',
    dateOfBirth: userData?.dateOfBirth || '',
    gender: userData?.gender || 'cc',
    phone: userData?.phone || '',
    email: userData?.email || '',
    address: userData?.address || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      await axios.put("http://localhost:8080/api/user/profile/update", formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      });
      setSuccess("Thông tin đã được cập nhật thành công!");
      setIsEditing(false);
    } catch (error) {
      setError(error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật thông tin");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: userData?.fullName || '',
      dateOfBirth: userData?.dateOfBirth || '',
      gender: userData?.gender || '',
      phone: userData?.phone || '',
      email: userData?.email || '',
      address: userData?.address || '',
    });
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  // Function to mask sensitive data (e.g., ID card number)
  const maskData = (data, visibleChars = 4) => {
    if (!data) return '';
    const length = data.length;
    if (length <= visibleChars) return data;
    
    const visiblePart = data.slice(length - visibleChars);
    return '•'.repeat(length - visibleChars) + visiblePart;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Thông tin cá nhân</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            Chỉnh sửa
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-300"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className={`px-4 py-2 ${saving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md transition duration-300`}
            >
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên
            </label>
            {isEditing ? (
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800">{userData?.fullName || 'Chưa cập nhật'}</p>
            )}
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
              Ngày sinh
            </label>
            {isEditing ? (
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800">{userData?.dateOfBirth || 'Chưa cập nhật'}</p>
            )}
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Giới tính
            </label>
            {isEditing ? (
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Chọn giới tính --</option>
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            ) : (
              <p className="text-gray-800">
                {userData?.gender === 'MALE' ? 'Nam' : 
                 userData?.gender === 'FEMALE' ? 'Nữ' : 
                 userData?.gender === 'OTHER' ? 'Khác' : 'Chưa cập nhật'}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            {isEditing ? (
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800">{userData?.phone || 'Chưa cập nhật'}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800">{userData?.email || 'Chưa cập nhật'}</p>
            )}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ
            </label>
            {isEditing ? (
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800">{userData?.address || 'Chưa cập nhật'}</p>
            )}
          </div>
        </div>

        {userData?.identityCard && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-md font-medium text-gray-800 mb-2">Thông tin xác minh danh tính</h3>
            <p className="text-sm text-gray-600">
              Số CMND/CCCD: {maskData(userData.identityCard, 4)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Đã xác minh
              </span>
            </p>
          </div>
        )}

        {!userData?.identityCard && !isEditing && (
          <div className="mt-6 p-4 bg-yellow-50 rounded-md">
            <h3 className="text-md font-medium text-gray-800 mb-2">Xác minh danh tính</h3>
            <p className="text-sm text-gray-600 mb-3">
              Xác minh danh tính của bạn để sử dụng đầy đủ các dịch vụ y tế
            </p>
            <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition duration-300">
              Tải lên giấy tờ
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PersonalInfo; 