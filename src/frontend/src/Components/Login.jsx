import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password
      });
      // Lưu JWT vào localStorage
      localStorage.setItem('token', response.data);
      navigate('/dashboard'); // Chuyển hướng sau khi đăng nhập
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      }
      else
      setError('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Đăng nhập HealthConnect</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label>Tên đăng nhập</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Đăng nhập</button>
        <p className="register-link">
          Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
        </p>
      </form>
    </div>
  );
};

export default Login;