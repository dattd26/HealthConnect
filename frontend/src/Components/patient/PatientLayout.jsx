import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import PatientNavbar from './PatientNavbar';
import './PatientLayout.css';

const PatientLayout = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [isMobile, setIsMobile] = useState(false);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
    const navbar = document.querySelector('.patient-navbar');
    if (navbar) {
      navbar.classList.toggle('mobile-open');
    }
  };

  const closeNavbar = () => {
    setIsNavbarOpen(false);
    const navbar = document.querySelector('.patient-navbar');
    if (navbar) {
      navbar.classList.remove('mobile-open');
    }
  };

  return (
    <div className="patient-layout">
      {/* Patient Navigation Sidebar */}
      <PatientNavbar onMobileToggle={setIsNavbarOpen} />

      {/* Main Content Area */}
      <main className={`patient-main ${isMobile ? 'mobile' : ''}`}>
        <header className="patient-header">
          <div className="header-content">
            <div className="header-left">
              {isMobile && (
                <button 
                  className="mobile-menu-toggle"
                  onClick={toggleNavbar}
                  aria-label="Toggle mobile menu"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
              <h1>Patient Dashboard</h1>
            </div>
            <div className="header-actions">
              <button className="notification-btn" aria-label="Notifications">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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

      {/* Mobile Overlay */}
      {isMobile && (
        <div 
          className={`mobile-overlay ${isNavbarOpen ? 'active' : ''}`}
          onClick={closeNavbar}
        />
      )}
    </div>
  );
};

export default PatientLayout;
