import React from 'react';
import DoctorAppointments from '../Components/doctor/DoctorAppointments';
import DoctorLayout from '../Components/doctor/DoctorLayout';

const DoctorAppointmentsPage = () => {
    return (
        <DoctorLayout>
            <DoctorAppointments />
        </DoctorLayout>
    );
};

export default DoctorAppointmentsPage;
