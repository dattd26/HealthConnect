import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Homepage from "../../pages/Homepage";
import { LoginPage } from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import PatientDashboard from "../patient/PatientDashboard";
import BookAppointmentPage from "../../pages/BookAppointmentPage";
import ProfilePage from "../../pages/ProfilePage";
import ZoomMeeting from "../../pages/ZoomTest";
import AppointmentMeetingPage from "../../pages/AppointmentMeetingPage";
import DoctorDashboardPage from "../../pages/DoctorDashboardPage";
import DoctorAppointmentsPage from "../../pages/DoctorAppointmentsPage";
import DoctorSchedulePage from "../../pages/DoctorSchedulePage";
import DoctorPatientsPage from "../../pages/DoctorPatientsPage";
import DoctorMedicalRecordsPage from "../../pages/DoctorMedicalRecordsPage";
import DoctorSettingsPage from "../../pages/DoctorSettingsPage";

const AppRouter = () => {
    // const { user } = useContext(AuthContext);
    // const location = useLocation();
    // const navigate = useNavigate();

    // useEffect(() => {
    //     const defaultRoute = getDefaultRoute(user?.role?.toLowerCase());
    //     if (user && location.pathname === '/' && location.pathname !== defaultRoute) {
    //       navigate(defaultRoute);
    //     }
    // }, [user, location, navigate]);

    return (
        
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Homepage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/test" element={<ZoomMeeting/>}/>
            <Route path="/appointments/:appointmentId/meeting" element={<AppointmentMeetingPage/>}/>
            {/* <Route path="/about" element={<RegisterPage/>}/> */}

            <Route path="/book-appointment" element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                    <BookAppointmentPage />
                </ProtectedRoute>
            } />
            <Route path="/profile" element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                    <ProfilePage />
                </ProtectedRoute>
            } />

            {/* Doctor Routes */}
            <Route path="/doctor/dashboard" element={
                <ProtectedRoute allowedRoles={['DOCTOR']}>
                    <DoctorDashboardPage />
                </ProtectedRoute>
            } />
            <Route path="/doctor/appointments" element={
                <ProtectedRoute allowedRoles={['DOCTOR']}>
                    <DoctorAppointmentsPage />
                </ProtectedRoute>
            } />
            <Route path="/doctor/schedule" element={
                <ProtectedRoute allowedRoles={['DOCTOR']}>
                    <DoctorSchedulePage />
                </ProtectedRoute>
            } />
            <Route path="/doctor/patients" element={
                <ProtectedRoute allowedRoles={['DOCTOR']}>
                    <DoctorPatientsPage />
                </ProtectedRoute>
            } />
            <Route path="/doctor/medical-records" element={
                <ProtectedRoute allowedRoles={['DOCTOR']}>
                    <DoctorMedicalRecordsPage />
                </ProtectedRoute>
            } />
            <Route path="/doctor/settings" element={
                <ProtectedRoute allowedRoles={['DOCTOR']}>
                    <DoctorSettingsPage />
                </ProtectedRoute>
            } />
        </Routes>
    );
}
export default AppRouter;