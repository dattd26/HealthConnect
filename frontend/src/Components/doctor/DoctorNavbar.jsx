import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
    LayoutDashboard, 
    Calendar, 
    Clock, 
    Users, 
    Settings, 
    FileText,
    LogOut,
    User,
    Menu,
    X,
    Heart
} from 'lucide-react';
import './DoctorNavbar.css';

const DoctorNavbar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        {
            path: '/doctor/dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard
        },
        {
            path: '/doctor/appointments',
            label: 'Lịch hẹn',
            icon: Calendar
        },
        {
            path: '/doctor/schedule',
            label: 'Lịch làm việc',
            icon: Clock
        },
        {
            path: '/doctor/availability',
            label: 'Thiết lập lịch',
            icon: Clock
        },
        {
            path: '/doctor/patients',
            label: 'Bệnh nhân',
            icon: Users
        },
        {
            path: '/doctor/medical-records',
            label: 'Hồ sơ y tế',
            icon: FileText
        },
        {
            path: '/doctor/settings',
            label: 'Cài đặt',
            icon: Settings
        }
    ];

    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleNavClick = (path) => {
        setIsMobileMenuOpen(false);
        navigate(path);
    };

    return (
        <div className="doctor-navbar">
            {/* Top Bar - Logo and Mobile Menu Toggle */}
            <div className="navbar-top">
                <div className="navbar-brand">
                    <Link to="/" className="brand-link">
                        <Heart className="brand-icon" />
                        <span className="brand-text">HealthConnect</span>
                    </Link>
                </div>
                
                {/* Mobile Menu Toggle */}
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="mobile-toggle-btn"
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Doctor Info */}
            <div className="navbar-header">
                <div className="doctor-info">
                    <div className="doctor-avatar">
                        <User size={24} />
                    </div>
                    <div className="doctor-details">
                        <h3 className="doctor-name-navbar">BS. {user?.fullName}</h3>
                        <p>{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className={`navbar-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.path}
                            onClick={() => handleNavClick(item.path)}
                            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="navbar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={20} />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </div>
    );
};

export default DoctorNavbar;
