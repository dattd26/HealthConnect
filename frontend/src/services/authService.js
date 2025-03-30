
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
    }

}
