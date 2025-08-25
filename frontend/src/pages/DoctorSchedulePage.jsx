import React from 'react';
import DoctorLayout from '../Components/doctor/DoctorLayout';
import AppointmentCalendar from '../Components/doctor/AppointmentCalendar';

const DoctorSchedulePage = () => {
    return (
        <DoctorLayout>
            <div className="doctor-schedule-page">
                <h1>Lịch làm việc</h1>
                <AppointmentCalendar />
            </div>
        </DoctorLayout>
    );
};

export default DoctorSchedulePage;
