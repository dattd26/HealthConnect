import React, { useContext, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Homepage from "../../pages/Homepage";
import { LoginPage } from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import PatientDashboard from "../patient/PatientDashboard";
import BookAppointmentPage from "../../pages/BookAppointmentPage";
import ProfilePage from "../../pages/ProfilePage";

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
            {/* <Route path="/about" element={<RegisterPage/>}/> */}

            {/* Patient Routes */}
            {/* <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={["PATIENT"]}>
                    <PatientDashboard />
                </ProtectedRoute>
            }/> */}
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
            {/* <Route path="*" element={(< />} /> */}
        </Routes>
    );
}
export default AppRouter;