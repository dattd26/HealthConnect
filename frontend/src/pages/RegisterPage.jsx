import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Heart, User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, Stethoscope, FileText } from "lucide-react";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "PATIENT", // Mặc định là PATIENT
    specialties: [], // Chỉ hiển thị nếu role là DOCTOR
    license: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    setIsRegistered(true);
    e.preventDefault();
    try {
      console.log(formData)
      const response = await axios.post("http://localhost:8080/api/auth/register", formData);
      if (response.data.role === "DOCTOR") {
        alert("Đăng ký thành công! Vui lòng chờ Admin xác thực.");
      } else {
        alert("Đăng ký thành công!");
      }
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại!");
      setIsRegistered(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--secondary-50) 100%)'}}>
      <div className="card max-w-lg w-full p-8 fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Heart className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">HealthConnect</h1>
          <p className="text-secondary">Tạo tài khoản mới</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message mb-6 p-3 bg-error-50 border border-error-200 rounded-lg">
            {error}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div className="form-group">
            <label className="form-label">
              <UserPlus className="w-4 h-4 inline mr-2" />
              Loại tài khoản
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "PATIENT" })}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.role === "PATIENT"
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <User className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Bệnh nhân</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "DOCTOR" })}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.role === "DOCTOR"
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Stethoscope className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Bác sĩ</div>
              </button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">
                <User className="w-4 h-4 inline mr-2" />
                Họ và tên
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="input"
                placeholder="Nhập họ và tên"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <User className="w-4 h-4 inline mr-2" />
                Tên đăng nhập
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="input"
                placeholder="Nhập tên đăng nhập"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
                placeholder="Nhập địa chỉ email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Phone className="w-4 h-4 inline mr-2" />
                Số điện thoại
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input"
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock className="w-4 h-4 inline mr-2" />
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input pr-10"
                placeholder="Nhập mật khẩu"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Doctor-specific fields */}
          {formData.role === "DOCTOR" && (
            <div className="space-y-4 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
              <h3 className="font-semibold text-secondary-800 flex items-center">
                <Stethoscope className="w-4 h-4 mr-2" />
                Thông tin bác sĩ
              </h3>
              
              <div className="form-group mb-0">
                <label className="form-label">
                  <Stethoscope className="w-4 h-4 inline mr-2" />
                  Chuyên khoa
                </label>
                <input
                  type="text"
                  value={formData.specialties}
                  onChange={(e) => setFormData({ ...formData, specialties: [e.target.value] })}
                  className="input"
                  placeholder="Ví dụ: Tim mạch, Nhi khoa, ..."
                  required
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Số giấy phép hành nghề
                </label>
                <input
                  type="text"
                  value={formData.license}
                  onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                  className="input"
                  placeholder="Nhập số giấy phép"
                  required
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="button button-primary w-full py-3"
            disabled={isRegistered}
          >
            {isRegistered ? (
              <div className="flex items-center justify-center">
                <div className="loading-spinner w-4 h-4 mr-2"></div>
                Đang đăng ký...
              </div>
            ) : (
              "Đăng ký tài khoản"
            )}
          </button>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-secondary">
              Đã có tài khoản? {' '}
              <a 
                href="/login" 
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Đăng nhập ngay
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;