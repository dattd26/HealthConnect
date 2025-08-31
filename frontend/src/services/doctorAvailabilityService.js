import axios from 'axios';
import { getAuthHeader } from '../utils/getAuthHeader';

import { config } from '../config/config.js';

const API_BASE_URL = config.API_BASE_URL;

class DoctorAvailabilityService {
    /**
     * Save doctor weekly availability
     */
    static async saveWeeklyAvailability(doctorId, availabilityDtos) {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/doctors/${doctorId}/availability`,
                availabilityDtos, // Send the list of AvailabilityDto directly
                {
                    headers: {
                        'Content-Type': 'application/json',
                        ...getAuthHeader()
                    }
                }
            );
            
            return response.data;
        } catch (error) {
            console.error('Error saving doctor availability:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Save doctor availability for a specific date (deprecated - use saveWeeklyAvailability instead)
     */
    static async saveAvailability(doctorId, date, availabilityDtos) {
        return this.saveWeeklyAvailability(doctorId, availabilityDtos);
    }

    /**
     * Update doctor availability for a specific date
     */
    static async updateAvailability(doctorId, date, slots) {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/doctors/${doctorId}/availability/${date}`,
                {
                    slots
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        ...getAuthHeader()
                    }
                }
            );
            
            return response.data;
        } catch (error) {
            console.error('Error updating doctor availability:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Get doctor availability for a specific date
     */
    static async getAvailability(doctorId, date) {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/doctors/${doctorId}/availability/${date}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        ...getAuthHeader()
                    }
                }
            );
            
            return response.data;
        } catch (error) {
            console.error('Error fetching doctor availability:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Get doctor availability for a date range
     */
    static async getAvailabilityRange(doctorId, startDate, endDate) {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/doctors/${doctorId}/availability`,
                {
                    params: {
                        startDate,
                        endDate
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        ...getAuthHeader()
                    }
                }
            );
            
            return response.data;
        } catch (error) {
            console.error('Error fetching doctor availability range:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Delete doctor availability for a specific date
     */
    static async deleteAvailability(doctorId, date) {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/doctors/${doctorId}/availability/${date}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        ...getAuthHeader()
                    }
                }
            );
            
            return response.data;
        } catch (error) {
            console.error('Error deleting doctor availability:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Get doctor working hours
     */
    static async getWorkingHours(doctorId) {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/doctors/${doctorId}/working-hours`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        ...getAuthHeader()
                    }
                }
            );
            
            return response.data;
        } catch (error) {
            console.error('Error fetching doctor working hours:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Update doctor working hours
     */
    static async updateWorkingHours(doctorId, workingHours) {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/doctors/${doctorId}/working-hours`,
                workingHours,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        ...getAuthHeader()
                    }
                }
            );
            
            return response.data;
        } catch (error) {
            console.error('Error updating doctor working hours:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Bulk save availability for multiple dates
     */
    static async bulkSaveAvailability(doctorId, availabilityData) {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/doctors/${doctorId}/availability/bulk`,
                availabilityData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        ...getAuthHeader()
                    }
                }
            );
            
            return response.data;
        } catch (error) {
            console.error('Error bulk saving doctor availability:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Get availability summary for a month
     */
    static async getMonthlySummary(doctorId, year, month) {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/doctors/${doctorId}/availability/summary`,
                {
                    params: {
                        year,
                        month
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        ...getAuthHeader()
                    }
                }
            );
            
            return response.data;
        } catch (error) {
            console.error('Error fetching monthly availability summary:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Handle API errors consistently
     */
    static handleError(error) {
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;
            
            switch (status) {
                case 400:
                    return new Error(data?.message || 'Dữ liệu không hợp lệ');
                case 401:
                    return new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
                case 403:
                    return new Error('Không có quyền thực hiện thao tác này.');
                case 404:
                    return new Error('Không tìm thấy thông tin bác sĩ hoặc lịch làm việc.');
                case 409:
                    return new Error('Xung đột dữ liệu. Có thể đã có lịch hẹn cho thời gian này.');
                case 500:
                    return new Error('Lỗi máy chủ. Vui lòng thử lại sau.');
                default:
                    return new Error(data?.message || 'Đã xảy ra lỗi khi lưu lịch làm việc.');
            }
        } else if (error.request) {
            // Network error
            return new Error('Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.');
        } else {
            // Other error
            return new Error('Đã xảy ra lỗi không mong muốn.');
        }
    }

    /**
     * Validate slot data before sending to API
     */
    static validateSlots(slots) {
        if (!Array.isArray(slots)) {
            throw new Error('Slots phải là một mảng');
        }

        if (slots.length === 0) {
            throw new Error('Phải có ít nhất một slot thời gian');
        }

        const errors = [];
        
        slots.forEach((slot, index) => {
            if (!slot.startTime || !slot.endTime) {
                errors.push(`Slot ${index + 1}: Thiếu thời gian bắt đầu hoặc kết thúc`);
            }
            
            if (slot.startTime >= slot.endTime) {
                errors.push(`Slot ${index + 1}: Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc`);
            }
        });

        if (errors.length > 0) {
            throw new Error(errors.join('\n'));
        }

        return true;
    }

    /**
     * Generate time slots based on working hours and duration
     */
    static generateTimeSlots(startTime, endTime, duration, breakStart = null, breakEnd = null) {
        const slots = [];
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        
        while (start < end) {
            const slotStart = start.toTimeString().slice(0, 5);
            start.setMinutes(start.getMinutes() + duration);
            const slotEnd = start.toTimeString().slice(0, 5);
            
            // Skip break time if specified
            if (breakStart && breakEnd && slotStart >= breakStart && slotStart < breakEnd) {
                continue;
            }
            
            slots.push({
                startTime: slotStart,
                endTime: slotEnd,
                available: true
            });
        }
        
        return slots;
    }
}

export default DoctorAvailabilityService;
