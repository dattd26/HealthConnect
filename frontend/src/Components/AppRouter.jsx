import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Homepage from "../pages/Homepage";
import { LoginPage } from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import { ProtectedRoute } from "./ProtectedRoute";
import PatientDashboard from "./PatientDashboard";
import AppointmentsPage from "../pages/AppointmentsPage";

export const AppRouter = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

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
            <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={ ["PATIENT"] }>
                    <PatientDashboard />
                </ProtectedRoute>
            }/>
            <Route path="/appointments" element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                    <AppointmentsPage />
                </ProtectedRoute>
            } />
        </Routes>
    );
}