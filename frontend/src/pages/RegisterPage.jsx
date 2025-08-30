import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Heart, User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, Stethoscope, FileText } from "lucide-react";
import medicalSpecialtyService from "../services/medicalSpecialtyService";
import "./RegisterPage.css";

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
  const [specialties, setSpecialties] = useState([]); // Danh sách chuyên khoa từ API
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Lấy danh sách chuyên khoa khi component mount
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const specs = await medicalSpecialtyService.getMedicalSpecialties();
        setSpecialties(specs || []);
      } catch (err) {
        console.error("Error loading specialties:", err);
      }
    };
    fetchSpecialties();
  }, []);

  const handleSubmit = async (e) => {
    setIsRegistered(true);
    e.preventDefault();
    try {
      // Chuẩn bị dữ liệu gửi lên backend
      const submitData = {
        ...formData,
        // Nếu là DOCTOR, gửi specialties dưới dạng array các object có code
        specialties: formData.role === "DOCTOR" ? formData.specialties.map(code => ({ code })) : []
      };
      
      console.log("Submitting data:", submitData);
      const response = await axios.post("http://localhost:8080/api/auth/register", submitData);
      
      if (formData.role === "DOCTOR") {
        alert("Đăng ký thành công! Vui lòng chờ Admin xác thực.");
      } else {
        alert("Đăng ký thành công! check email để xác thực");
      }
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại!");
      setIsRegistered(false);
    }
  };

  // Xử lý chọn chuyên khoa
  const handleSpecialtyChange = (e) => {
    const selectedCode = e.target.value;
    if (selectedCode) {
      setFormData(prev => ({
        ...prev,
        specialties: [selectedCode] // Chỉ cho phép chọn 1 chuyên khoa
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        specialties: []
      }));
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        {/* Header */}
        <div className="register-header">
          <div className="logo">
            <Heart />
          </div>
          <h1>HealthConnect</h1>
          <p>Tạo tài khoản mới</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
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
            <div className="role-buttons">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "PATIENT", specialties: [], license: "" })}
                className={`role-button ${formData.role === "PATIENT" ? "active" : ""}`}
              >
                <User />
                <div className="text">Bệnh nhân</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "DOCTOR", specialties: [], license: "" })}
                className={`role-button ${formData.role === "DOCTOR" ? "active" : ""}`}
              >
                <Stethoscope />
                <div className="text">Bác sĩ</div>
              </button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="form-grid">
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
                placeholder="Nhập họ và tên đầy đủ"
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

          <div className="form-grid">
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
            <div className="password-container">
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
                className="password-toggle"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="help-text">
              Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
            </p>
          </div>

          {/* Doctor-specific fields */}
          {formData.role === "DOCTOR" && (
            <div className="doctor-section">
              <h3>
                <Stethoscope className="w-4 h-4 mr-2" />
                Thông tin bác sĩ
              </h3>
              
              <div className="form-group mb-0">
                <label className="form-label">
                  <Stethoscope className="w-4 h-4 inline mr-2" />
                  Chuyên khoa
                </label>
                <select
                  value={formData.specialties[0] || ""}
                  onChange={handleSpecialtyChange}
                  className="input"
                  required
                >
                  <option value="">-- Chọn chuyên khoa --</option>
                  {specialties.map((specialty) => (
                    <option key={specialty.code} value={specialty.code}>
                      {specialty.name}
                    </option>
                  ))}
                </select>
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
            className="button button-primary"
            disabled={isRegistered}
          >
            {isRegistered ? "Đang đăng ký..." : "Đăng ký"}
          </button>
          
          {isRegistered && (
            <p className="help-text">
              Lưu ý: Ứng dụng sử dụng SMTP để gửi email xác thực, nên quá trình đăng ký có thể mất vài phút. 
              Vui lòng kiểm tra hộp thư đến hoặc thư mục spam.
            </p>
          )}
          
          <div className="text-center">
            <p className="text-gray-600">
              Đã có tài khoản?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="link"
              >
                Đăng nhập ngay
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;