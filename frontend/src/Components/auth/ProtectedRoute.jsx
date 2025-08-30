import React, { useContext } from "react"
import { AuthContext } from "../../context/AuthContext";
import { Navigate, replace, useLocation } from "react-router-dom";
import getDefaultRoute from "../common/getDefaultRoute"
export const ProtectedRoute = ( { children, allowedRoles }  ) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();
    console.log("User in ProtectedRoute:", user);
    if (loading) {
        return <div>Đang tải...</div>;
    }
    if (!user) {
        alert("Vui lòng đăng nhập trước")
        return <Navigate to="/login" state={ { from: location } } replace/>
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={getDefaultRoute(user.role)} replace />;
    }

    return children;
}