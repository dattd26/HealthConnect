import React, { useState, useEffect } from 'react';
import DoctorNavbar from './DoctorNavbar';
import './DoctorLayout.css';

const DoctorLayout = ({ children }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="doctor-layout">
            <DoctorNavbar />
            <main className={`doctor-main-content ${isMobile ? 'mobile' : ''}`}>
                {children}
            </main>
        </div>
    );
};

export default DoctorLayout;
