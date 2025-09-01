import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Homepage from "../../pages/Homepage";
import { LoginPage } from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";
import EmailVerificationPage from "../../pages/EmailVerificationPage";
import EmailVerificationSentPage from "../../pages/EmailVerificationSentPage";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import PatientDashboard from "../patient/PatientDashboard";
import BookAppointmentPage from "../../pages/BookAppointmentPage";
import PatientDashboardPage from "../../pages/PatientDashboardPage";
import ZoomMeeting from "../../pages/ZoomTest";
import AppointmentMeetingPage from "../../pages/AppointmentMeetingPage";
import DoctorDashboardPage from "../../pages/DoctorDashboardPage";
import DoctorAppointmentsPage from "../../pages/DoctorAppointmentsPage";
import DoctorSchedulePage from "../../pages/DoctorSchedulePage";
import DoctorPatientsPage from "../../pages/DoctorPatientsPage";
import DoctorMedicalRecordsPage from "../../pages/DoctorMedicalRecordsPage";
import DoctorSettingsPage from "../../pages/DoctorSettingsPage";
import DoctorAvailabilityPage from "../../pages/DoctorAvailabilityPage";
import PaymentPage from "../../pages/PaymentPage";
import PaymentSuccessPage from "../../pages/PaymentSuccessPage";
import PaymentCancelPage from "../../pages/PaymentCancelPage";
import ProfilePage from "../../pages/ProfilePage";
import AllAppointmentsPage from "../../pages/AllAppointmentsPage";
import AdminDashboardPage from "../../pages/AdminDashboardPage";
import PatientLayout from "../patient/PatientLayout";

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
            <Route path="/verify-email" element={<EmailVerificationPage/>}/>
            <Route path="/email-verification-sent" element={<EmailVerificationSentPage/>}/>
            <Route path="/test" element={<ZoomMeeting/>}/>
            <Route path="/appointments/:appointmentId/meeting" element={<AppointmentMeetingPage/>}/>
            
            {/* Payment Routes */}
            <Route path="/payment" element={<PaymentPage/>}/>
            <Route path="/payment/:appointmentId" element={<PaymentPage/>}/>
            <Route path="/payment-success" element={<PaymentSuccessPage/>}/>
            <Route path="/payment-cancel" element={<PaymentCancelPage/>}/>
            
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
            <Route path="/patient/dashboard" element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                    <PatientDashboardPage />
                </ProtectedRoute>
            } />
            <Route path="/all-appointments" element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                    <AllAppointmentsPage />
                </ProtectedRoute>
            } />
            <Route path="/medical-records" element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                    <PatientLayout>
                        <div>
                            <h1>Lịch sử khám bệnh</h1>
                            <p>Trang này sẽ hiển thị lịch sử khám bệnh của bạn.</p>
                        </div>
                    </PatientLayout>
                </ProtectedRoute>
            } />
            <Route path="/payments" element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                    <PatientLayout>
                        <div>
                            <h1>Thanh toán</h1>
                            <p>Trang này sẽ hiển thị thanh toán của bạn.</p>
                        </div>
                    </PatientLayout>
                </ProtectedRoute>
            } />
            <Route path="/settings" element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                    <PatientLayout>
                        <div>
                            <h1>Cài đặt</h1>
                            <p>Trang này sẽ hiển thị cài đặt của bạn.</p>
                        </div>
                    </PatientLayout>
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
            <Route path="/doctor/availability" element={
                <ProtectedRoute allowedRoles={['DOCTOR']}>
                    <DoctorAvailabilityPage />
                </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboardPage />
                </ProtectedRoute>
            } />
        </Routes>
    );
}
export default AppRouter;