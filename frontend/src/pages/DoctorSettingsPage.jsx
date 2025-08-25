import React from 'react';
import DoctorLayout from '../Components/doctor/DoctorLayout';

const DoctorSettingsPage = () => {
    return (
        <DoctorLayout>
            <div className="doctor-settings-page">
                <h1>Cài đặt</h1>
                <p>Trang này sẽ hiển thị các tùy chọn cài đặt cho bác sĩ.</p>
            </div>
        </DoctorLayout>
    );
};

export default DoctorSettingsPage;
