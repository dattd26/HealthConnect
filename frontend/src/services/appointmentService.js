import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import { getAuthHeader } from "../utils/getAuthHeader";

export const appointmentService = {
    getAppointments: async (userId, role) => {

        const response = await axios.get(role === "PATIENT" ? API_ENDPOINTS.APPOINTMENTS.PATIENT(userId) : API_ENDPOINTS.APPOINTMENTS.DOCTOR(userId), {
            headers: getAuthHeader()
        });
        return response.data;
    },

    createAppointment: async (data) => {
        const response = await axios.post(API_ENDPOINTS.APPOINTMENTS.CREATE, data, {
            headers: getAuthHeader()
        });
        return response.data;
    }
}