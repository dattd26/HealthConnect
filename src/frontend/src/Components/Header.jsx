import React from 'react';
// import './Header.css';  // Bạn có thể tạo CSS riêng cho Header

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src="/assets/images/healthconnect-logo.png" alt="HealthConnect Logo" />
        <span>HealthConnect</span>
      </div>
      <nav className="navigation">
        <ul>
          <li><a href="#">Trang chủ</a></li>
          <li><a href="#">Tìm bác sĩ</a></li>
          <li><a href="#">Giới thiệu</a></li>
          <li><a href="#">Blog/Tin tức</a></li>
        </ul>
      </nav>
      <div className="buttons">
        <button className="login-btn">Đăng nhập</button>
        <button className="signup-btn">Đăng ký</button>
        <button className="doctor-btn">Bác sĩ? Tham gia ngay</button>
      </div>
    </header>
  );
};

export default Header;
