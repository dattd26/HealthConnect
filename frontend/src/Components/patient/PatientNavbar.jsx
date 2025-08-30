import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
    LayoutDashboard, 
    Calendar, 
    Clock, 
    FileText, 
    Settings, 
    LogOut,
    User,
    Menu,
    X,
    Heart,
    BookOpen,
    History,
    CreditCard
} from 'lucide-react';
import './PatientNavbar.css';

const PatientNavbar = ({ onMobileToggle }) => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Sync with external state
    useEffect(() => {
        if (onMobileToggle) {
            onMobileToggle(isMobileMenuOpen);
        }
    }, [isMobileMenuOpen, onMobileToggle]);

    const navItems = [
        {
            path: '/patient/dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard
        },
        {
            path: '/book-appointment',
            label: 'Đặt lịch khám',
            icon: BookOpen
        },
        {
            path: '/profile',
            label: 'Hồ sơ cá nhân',
            icon: FileText
        },
        {
            path: '/all-appointments',
            label: 'Lịch hẹn',
            icon: Calendar
        },
        {
            path: '/medical-records',
            label: 'Lịch sử khám',
            icon: History
        },
        {
            path: '/payments',
            label: 'Thanh toán',
            icon: CreditCard
        },
        {
            path: '/settings',
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
        if (onMobileToggle) {
            onMobileToggle(false);
        }
        navigate(path);
    };

    return (
        <div className="patient-navbar">
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
                    onClick={() => {
                        const newState = !isMobileMenuOpen;
                        setIsMobileMenuOpen(newState);
                        if (onMobileToggle) {
                            onMobileToggle(newState);
                        }
                    }}
                    className="mobile-toggle-btn"
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Patient Info */}
            <div className="navbar-header">
                <div className="patient-info">
                    <div className="patient-avatar">
                        <User size={24} />
                    </div>
                    <div className="patient-details">
                        <h3>{user?.fullName || user?.name || 'Bệnh nhân'}</h3>
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

export default PatientNavbar;
