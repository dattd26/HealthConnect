import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './PatientLayout.css';

const PatientLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/profile',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      name: 'Đặt lịch khám',
      path: '/book-appointment',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 2V5M16 2V5M3.5 4H20.5M21 8.5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V8.5C3 7.39543 3.89543 6.5 5 6.5H19C20.1046 6.5 21 7.39543 21 8.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      name: 'Lịch hẹn',
      path: '/profile/appointments',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    {
      name: 'Hồ sơ sức khỏe',
      path: '/profile/health-record',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      name: 'Lịch sử khám',
      path: '/profile/medical-history',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    {
      name: 'Thanh toán',
      path: '/profile/payments',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      name: 'Cài đặt',
      path: '/profile/settings',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2579 9.77251 19.9887C9.5799 19.7195 9.31074 19.5149 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.1441C4.69632 20.0435 4.47575 19.896 4.29 19.71C4.10405 19.5243 3.95653 19.3037 3.85588 19.0609C3.75523 18.8181 3.70343 18.5578 3.70343 18.295C3.70343 18.0322 3.75523 17.7719 3.85588 17.5291C3.95653 17.2863 4.10405 17.0657 4.29 16.88L4.35 16.82C4.58054 16.5843 4.73519 16.285 4.794 15.9606C4.85282 15.6362 4.81312 15.3016 4.68 15C4.55324 14.7042 4.34276 14.452 4.07447 14.2743C3.80618 14.0966 3.49179 14.0013 3.17 14H3C2.46957 14 1.96086 13.7893 1.58579 13.4142C1.21071 13.0391 1 12.5304 1 12C1 11.4696 1.21071 10.9609 1.58579 10.5858C1.96086 10.2107 2.46957 10 3 10H3.17C3.49179 9.99873 3.80618 9.90344 4.07447 9.72572C4.34276 9.548 4.55324 9.29582 4.68 9C4.81312 8.69838 4.85282 8.36381 4.794 8.03941C4.73519 7.71502 4.58054 7.41568 4.35 7.18L4.29 7.12C4.10405 6.93425 3.95653 6.71368 3.85588 6.47088C3.75523 6.22808 3.70343 5.96783 3.70343 5.705C3.70343 5.44217 3.75523 5.18192 3.85588 4.93912C3.95653 4.69632 4.10405 4.47575 4.29 4.29C4.47575 4.10405 4.69632 3.95653 4.93912 3.85588C5.18192 3.75523 5.44217 3.70343 5.705 3.70343C5.96783 3.70343 6.22808 3.75523 6.47088 3.85588C6.71368 3.95653 6.93425 4.10405 7.12 4.29L7.18 4.35C7.41568 4.58054 7.71502 4.73519 8.03941 4.794C8.36381 4.85282 8.69838 4.81312 9 4.68H9.17C9.49179 4.67873 9.80618 4.58344 10.0745 4.40572C10.3428 4.228 10.5532 3.97582 10.68 3.68C10.8131 3.37838 10.8528 3.04381 10.794 2.71941C10.7352 2.39502 10.5805 2.09568 10.35 1.86L10.29 1.8C10.1043 1.61405 9.95677 1.39353 9.85612 1.15073C9.75547 0.907925 9.70367 0.647675 9.70367 0.385C9.70367 0.122325 9.75547 -0.137925 9.85612 -0.380725C9.95677 -0.623525 10.1043 -0.844045 10.29 -1.03C10.4758 -1.21595 10.6963 -1.36347 10.9391 -1.46412C11.1819 -1.56477 11.4422 -1.61657 11.705 -1.61657C11.9678 -1.61657 12.2281 -1.56477 12.4709 -1.46412C12.7137 -1.36347 12.9342 -1.21595 13.12 -1.03L13.18 1.86C13.4095 2.09568 13.5642 2.39502 13.623 2.71941C13.6818 3.04381 13.6421 3.37838 13.51 3.68C13.3832 3.97582 13.1728 4.228 12.9045 4.40572C12.6362 4.58344 12.3218 4.67873 12 4.68V4.68Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="patient-layout">
      {/* Mobile Sidebar Toggle */}
      <button className="mobile-sidebar-toggle" onClick={toggleSidebar}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`patient-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <h2>HealthConnect</h2>
            <p>Patient Portal</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {navigationItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="user-details">
              <p className="user-name">{user?.name || 'Bệnh nhân'}</p>
              <p className="user-role">Bệnh nhân</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="patient-main">
        <header className="patient-header">
          <div className="header-content">
            <h1>Patient Dashboard</h1>
            <div className="header-actions">
              <button className="notification-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.73 21A2 2 0 0 1 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

        <div className="patient-content">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </div>
  );
};

export default PatientLayout;
