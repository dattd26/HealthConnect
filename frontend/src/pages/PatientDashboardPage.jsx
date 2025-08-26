import React from 'react';
import PatientDashboard from '../Components/patient/PatientDashboard';
import PatientLayout from '../Components/patient/PatientLayout';

const PatientDashboardPage = () => {
    return (
        <PatientLayout>
            <PatientDashboard />
        </PatientLayout>
    );
};

export default PatientDashboardPage;
