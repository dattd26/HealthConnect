import { getAuthHeader } from '../utils/getAuthHeader';

import { config } from '../config/config.js';

const API_BASE_URL = config.API_BASE_URL.replace('/api', '');

class DoctorService {
    // Get doctor dashboard data
    async getDashboard(doctorId) {
        const response = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}/dashboard`, {
            method: 'GET',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch dashboard data');
        }

        return await response.json();
    }

    // Get doctor appointments
    async getAppointments(doctorId, filters = {}) {
        const params = new URLSearchParams();
        
        if (filters.status) params.append('status', filters.status);
        if (filters.date) params.append('date', filters.date);
        if (filters.page !== undefined) params.append('page', filters.page);
        if (filters.size !== undefined) params.append('size', filters.size);

        const queryString = params.toString();
        const url = `${API_BASE_URL}/api/doctors/${doctorId}/appointments${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch appointments');
        }

        return await response.json();
    }

    // Get doctor profile
    async getProfile(doctorId) {
        const response = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}/profile`, {
            method: 'GET',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch doctor profile');
        }

        return await response.json();
    }

    // Update doctor profile
    async updateProfile(doctorId, profileData) {
        const response = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}/profile`, {
            method: 'PUT',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
        });

        if (!response.ok) {
            throw new Error('Failed to update doctor profile');
        }

        return await response.json();
    }

    // Get doctor availability
    async getAvailability(doctorId) {
        const response = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}/availability`, {
            method: 'GET',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch availability');
        }

        return await response.json();
    }

    // Update doctor availability
    async updateAvailability(doctorId, availability) {
        const response = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}/availability`, {
            method: 'POST',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(availability),
        });

        if (!response.ok) {
            throw new Error('Failed to update availability');
        }

        return await response.json();
    }

    // Get doctor slots
    async getSlots(doctorId, startDate, endDate) {
        const params = new URLSearchParams({
            startDate: startDate,
            endDate: endDate
        });

        const response = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}/slots?${params.toString()}`, {
            method: 'GET',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch slots');
        }

        return await response.json();
    }

    // Get available slots
    async getAvailableSlots(doctorId) {
        const response = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}/available-slots`, {
            method: 'GET',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch available slots');
        }

        return await response.json();
    }

    // Update appointment status
    async updateAppointmentStatus(appointmentId, status) {
        const response = await fetch(`${API_BASE_URL}/api/appointments/${appointmentId}/status`, {
            method: 'PUT',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            throw new Error('Failed to update appointment status');
        }

        return await response.json();
    }

    // Get appointment details
    async getAppointmentDetails(appointmentId) {
        const response = await fetch(`${API_BASE_URL}/api/appointments/${appointmentId}`, {
            method: 'GET',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch appointment details');
        }

        return await response.json();
    }

    // Get dashboard statistics
    async getDashboardStats(doctorId, days = 30) {
        const response = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}/dashboard/stats?days=${days}`, {
            method: 'GET',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch dashboard statistics');
        }

        return await response.json();
    }

    // Get appointment calendar
    async getAppointmentCalendar(doctorId, month, includeSlots = false) {
        const params = new URLSearchParams({
            month: month,
            includeSlots: includeSlots
        });

        const response = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}/appointments/calendar?${params.toString()}`, {
            method: 'GET',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch appointment calendar');
        }

        return await response.json();
    }

    // Get doctor schedule for specific date
    async getDoctorSchedule(doctorId, date) {
        const params = new URLSearchParams({
            date: date
        });

        const response = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}/schedule?${params.toString()}`, {
            method: 'GET',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch doctor schedule');
        }

        return await response.json();
    }

    // Get weekly schedule
    async getWeeklySchedule(doctorId, weekStart) {
        const params = new URLSearchParams({
            weekStart: weekStart
        });

        const response = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}/schedule/weekly?${params.toString()}`, {
            method: 'GET',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch weekly schedule');
        }

        return await response.json();
    }

    // Get patient health records for appointment
    async getPatientHealthRecords(doctorId, appointmentId) {
        const response = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}/appointments/${appointmentId}/patient-records`, {
            method: 'GET',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch patient health records');
        }

        return await response.json();
    }

    // Update appointment status
    async updateAppointmentStatus(doctorId, appointmentId, status) {
        const response = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}/appointments/${appointmentId}/status`, {
            method: 'PUT',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            throw new Error('Failed to update appointment status');
        }

        return await response.json();
    }
}

export const doctorService = new DoctorService();
export default doctorService;
