import api from '../config/api';
import { getAuthHeader } from '../utils/getAuthHeader';
import { config } from '../config/config.js';

const PAYMENT_API_BASE = `${config.API_BASE_URL}/payments`;
const VNPAY_API_BASE = `${config.API_BASE_URL}/vnpay`;

export const paymentService = {
  // Tạo thanh toán thông thường
  createPayment: async (appointmentId, amount, method) => {
    try {
      const response = await api.post(`${PAYMENT_API_BASE}/create`, null, {
        headers: getAuthHeader(),
        params: {
          appointmentId,
          amount,
          method
        }
      });
      return response;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  // Tạo thanh toán VNPay
  createVNPayPayment: async (paymentData) => {
    try {
      const response = await api.post(`${PAYMENT_API_BASE}/vnpay/create`, paymentData, {
        headers: getAuthHeader(),
      });
      return response;
    } catch (error) {
      console.error('Error creating VNPay payment:', error);
      throw error;
    }
  },

  // Lấy thông tin thanh toán theo order ID
  getPaymentByOrderId: async (orderId) => {
    try {
      const response = await api.get(`${PAYMENT_API_BASE}/order/${orderId}`, {
        headers: getAuthHeader(),
      });
      return response;
    } catch (error) {
      console.error('Error getting payment by order ID:', error);
      throw error;
    }
  },

  // Lấy thông tin thanh toán theo appointment ID
  getPaymentByAppointmentId: async (appointmentId) => {
    try {
      const response = await api.get(`${PAYMENT_API_BASE}/appointment/${appointmentId}`, {
        headers: getAuthHeader(),
      });
      return response;
    } catch (error) {
      console.error('Error getting payment by appointment ID:', error);
      throw error;
    }
  },

  // Lấy danh sách thanh toán theo trạng thái
  getPaymentsByStatus: async (status) => {
    try {
      const response = await api.get(`${PAYMENT_API_BASE}/status/${status}`, {
        headers: getAuthHeader(),
      });
      return response;
    } catch (error) {
      console.error('Error getting payments by status:', error);
      throw error;
    }
  },

  // Cập nhật trạng thái thanh toán
  updatePaymentStatus: async (paymentId, status) => {
    try {
      const response = await api.put(`${PAYMENT_API_BASE}/${paymentId}/status`, null, {
        params: { status },
        headers: getAuthHeader(),
      });
      return response;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  },

  // Lấy tất cả thanh toán
  getAllPayments: async () => {
    try {
      const response = await api.get(`${PAYMENT_API_BASE}/all`, {
        headers: getAuthHeader(),
      });
      return response;
    } catch (error) {
      console.error('Error getting all payments:', error);
      throw error;
    }
  }
};

export default paymentService;
