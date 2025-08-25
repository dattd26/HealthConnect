import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { User, Calendar, Home, LogOut, Menu, X, Heart } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav style={{background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--secondary-600) 100%)'}} className="shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <Heart className="w-8 h-8 text-white" />
              <span className="text-white font-bold text-xl">HealthConnect</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all">
              Trang chủ
            </Link>
            
            {user ? (
              <>
                {user.role === 'PATIENT' && (
                  <>
                    <Link to="/book-appointment" className="px-3 py-2 rounded-md text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all">
                      Đặt lịch khám
                    </Link>
                    <Link to="/profile" className="px-3 py-2 rounded-md text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all">
                      Hồ sơ của tôi
                    </Link>
                  </>
                )}
                {user.role === 'DOCTOR' && (
                  <>
                    <Link to="/doctor/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all">
                      Dashboard
                    </Link>
                    <Link to="/doctor/appointments" className="px-3 py-2 rounded-md text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all">
                      Lịch hẹn
                    </Link>
                  </>
                )}
                <button 
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-red-200 hover:text-white hover:bg-red-500/20 flex items-center transition-all ml-2"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-md text-sm font-medium text-white bg-white/10 hover:bg-white/20 transition-all">
                  Đăng nhập
                </Link>
                <Link to="/register" className="px-4 py-2 rounded-md text-sm font-medium text-white border border-white/30 hover:bg-white/10 transition-all">
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white/90 hover:text-white hover:bg-white/10 focus:outline-none transition-all"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm shadow-lg border-t border-white/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all"
              onClick={toggleMenu}
            >
              <div className="flex items-center">
                <Home className="w-5 h-5 mr-2" />
                Trang chủ
              </div>
            </Link>

            {user ? (
              <>
                {user.role === 'PATIENT' && (
                  <>
                    <Link 
                      to="/book-appointment"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all"
                      onClick={toggleMenu}
                    >
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        Đặt lịch khám
                      </div>
                    </Link>
                    <Link 
                      to="/profile"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all"
                      onClick={toggleMenu}
                    >
                      <div className="flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Hồ sơ của tôi
                      </div>
                    </Link>
                  </>
                )}
                {user.role === 'DOCTOR' && (
                  <>
                    <Link 
                      to="/doctor/dashboard"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all"
                      onClick={toggleMenu}
                    >
                      <div className="flex items-center">
                        <Home className="w-5 h-5 mr-2" />
                        Dashboard
                      </div>
                    </Link>
                    <Link 
                      to="/doctor/appointments"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all"
                      onClick={toggleMenu}
                    >
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        Lịch hẹn
                      </div>
                    </Link>
                  </>
                )}
                <button 
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-all"
                >
                  <div className="flex items-center">
                    <LogOut className="w-5 h-5 mr-2" />
                    Đăng xuất
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:bg-primary-50 transition-all"
                  onClick={toggleMenu}
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:bg-primary-50 transition-all"
                  onClick={toggleMenu}
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 