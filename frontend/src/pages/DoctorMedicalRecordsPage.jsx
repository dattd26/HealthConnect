import React from 'react';
import DoctorLayout from '../Components/doctor/DoctorLayout';

const DoctorMedicalRecordsPage = () => {
    return (
        <DoctorLayout>
            <div className="doctor-medical-records-page">
                <h1>Hồ sơ y tế</h1>
                <p>Trang này sẽ hiển thị hồ sơ y tế của bệnh nhân.</p>
            </div>
        </DoctorLayout>
    );
};

export default DoctorMedicalRecordsPage;
