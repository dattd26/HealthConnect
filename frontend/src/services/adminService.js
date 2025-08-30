import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import { getAuthHeader } from "../utils/getAuthHeader";

const adminService = {
    // Quản lý yêu cầu đăng ký bác sĩ
    getPendingDoctorRequests: async () => {
        const response = await axios.get(API_ENDPOINTS.ADMIN.DOCTOR_REQUESTS, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    approveDoctorRequest: async (requestId) => {
        const response = await axios.post(API_ENDPOINTS.ADMIN.APPROVE_DOCTOR(requestId), {}, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    rejectDoctorRequest: async (requestId, reason) => {
        const response = await axios.post(API_ENDPOINTS.ADMIN.REJECT_DOCTOR(requestId), { reason }, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Quản lý chuyên khoa
    createSpecialty: async (specialtyData) => {
        const response = await axios.post(API_ENDPOINTS.ADMIN.CREATE_SPECIALTY, specialtyData, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    updateSpecialty: async (id, specialtyData) => {
        const response = await axios.put(API_ENDPOINTS.ADMIN.UPDATE_SPECIALTY(id), specialtyData, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    deleteSpecialty: async (id) => {
        const response = await axios.delete(API_ENDPOINTS.ADMIN.DELETE_SPECIALTY(id), {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getAllSpecialties: async () => {
        const response = await axios.get(API_ENDPOINTS.ADMIN.ALL_SPECIALTIES, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Quản lý người dùng
    getAllUsers: async () => {
        const response = await axios.get(API_ENDPOINTS.ADMIN.ALL_USERS, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getUserById: async (id) => {
        const response = await axios.get(API_ENDPOINTS.ADMIN.GET_USER(id), {
            headers: getAuthHeader()
        });
        return response.data;
    },

    verifyUser: async (id) => {
        const response = await axios.put(API_ENDPOINTS.ADMIN.VERIFY_USER(id), {}, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    blockUser: async (id) => {
        const response = await axios.put(API_ENDPOINTS.ADMIN.BLOCK_USER(id), {}, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    unblockUser: async (id) => {
        const response = await axios.put(API_ENDPOINTS.ADMIN.UNBLOCK_USER(id), {}, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    updateUserRole: async (id, role) => {
        const response = await axios.put(API_ENDPOINTS.ADMIN.UPDATE_USER_ROLE(id), { role }, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Thống kê dashboard
    getDashboardStats: async () => {
        const response = await axios.get(API_ENDPOINTS.ADMIN.DASHBOARD_STATS, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};

export default adminService;
