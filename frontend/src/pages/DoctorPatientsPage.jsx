import React from 'react';
import DoctorLayout from '../Components/doctor/DoctorLayout';

const DoctorPatientsPage = () => {
    return (
        <DoctorLayout>
            <div className="doctor-patients-page">
                <h1>Quản lý bệnh nhân</h1>
                <p>Trang này sẽ hiển thị danh sách bệnh nhân và thông tin chi tiết.</p>
            </div>
        </DoctorLayout>
    );
};

export default DoctorPatientsPage;
