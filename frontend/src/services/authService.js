
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

export const authService = {
    login: async (username, password) => {
        const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, { username, password });
        return response.data;
    },

    register: async (userData) => {
        const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, userData);
        return response.data;
    },

    validate: async (token) => {
        const response = await axios.post(API_ENDPOINTS.AUTH.VALIDATE, { token });
        return response.data;
    },

    verifyEmail: async (token) => {
        const response = await fetch(`${API_ENDPOINTS.BASE_URL}/verify-email?token=${token}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    },

    resendVerification: async (email) => {
        const response = await fetch(`${API_ENDPOINTS.BASE_URL}/api/auth/resend-verification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        return response;
    }
}
