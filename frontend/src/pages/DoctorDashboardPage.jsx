import React from 'react';
import DoctorDashboard from '../Components/doctor/DoctorDashboard';
import DoctorLayout from '../Components/doctor/DoctorLayout';

const DoctorDashboardPage = () => {
    return (
        <DoctorLayout>
            <DoctorDashboard />
        </DoctorLayout>
    );
};

export default DoctorDashboardPage;
