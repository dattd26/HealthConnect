import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import { getAuthHeader } from "../utils/getAuthHeader";
import SlotService from "./slotService";

export const appointmentService = {
    getAppointments: async (userId, role) => {
        const response = await axios.get(role === "PATIENT" ? API_ENDPOINTS.APPOINTMENTS.PATIENT(userId) : API_ENDPOINTS.APPOINTMENTS.DOCTOR(userId), {
            headers: getAuthHeader()
        });
        return response.data;
    },

    createAppointment: async (data) => {
        try {
            const response = await axios.post(API_ENDPOINTS.APPOINTMENTS.CREATE, data, {
                headers: getAuthHeader()
            });
            
            // Clear cache for the doctor after successful booking
            if (data.doctorId) {
                SlotService.clearDoctorCache(data.doctorId);
            }
            
            return response.data;
        } catch (error) {
            // Handle specific booking errors
            if (error.response?.status === 409) {
                throw new Error('Slot đã được đặt bởi người khác. Vui lòng chọn slot khác.');
            } else if (error.response?.status === 400) {
                throw new Error(error.response.data?.message || 'Dữ liệu đặt lịch không hợp lệ.');
            }
            throw error;
        }
    },

    cancelAppointment: async (appointmentId) => {
        try {
            const response = await axios.put(`${API_ENDPOINTS.APPOINTMENTS.CANCEL}/${appointmentId}/cancel`, {}, {
                headers: getAuthHeader()
            });
            
            // Clear all slot cache after cancellation to refresh availability
            SlotService.clearAllCache();
            
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error('Lịch hẹn không tồn tại.');
            }
            throw error;
        }
    },

    getAppointmentById: async (id) => {
        const response = await axios.get(API_ENDPOINTS.APPOINTMENTS.GET(id), {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getUserAppointments: async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.APPOINTMENTS.USER, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Vui lòng đăng nhập lại.');
            }
            throw error;
        }
    }
}