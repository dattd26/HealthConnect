import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "PATIENT", // Mặc định là PATIENT
    specialty: [], // Chỉ hiển thị nếu role là DOCTOR
    license: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);

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
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Đăng ký tài khoản</h2>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Họ và tên</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Tên người dùng</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Số điện thoại</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Mật khẩu</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Bạn là:</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="PATIENT">Người dùng</option>
            <option value="DOCTOR">Bác sĩ</option>
          </select>
        </div>

        {/* Hiển thị thêm trường cho Bác sĩ */}
        {formData.role === "DOCTOR" && (
          <>
            <div className="form-group">
              <label>Chuyên khoa</label>
              <input
                type="text"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: [e.target.value] })}
                required
              />
            </div>

            <div className="form-group">
              <label>Số giấy phép hành nghề</label>
              <input
                type="text"
                value={formData.license}
                onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                required
              />
            </div>
          </>
        )}

        <button type="submit" className="register-button">
          {!isRegistered ? "Đăng ký" : "Đang đăng ký..."}
        </button>

        <p className="login-link">
          Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;