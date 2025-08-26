const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';


// API Client object for making HTTP requests
const api = {
    get: async (url, config = {}) => {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...config.headers
                },
                ...config
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return response.json();
        } catch (error) {
            console.error('API GET request failed:', error);
            throw error;
        }
    },
    
    post: async (url, data = null, config = {}) => {
        try {
            // Xử lý params nếu có
            let finalUrl = url;
            if (config.params) {
                const params = new URLSearchParams();
                Object.keys(config.params).forEach(key => {
                    if (config.params[key] !== null && config.params[key] !== undefined) {
                        params.append(key, config.params[key]);
                    }
                });
                finalUrl = `${url}?${params.toString()}`;
            }
            
            const response = await fetch(finalUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...config.headers
                },
                body: data ? JSON.stringify(data) : null
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return response.json();
        } catch (error) {
            console.error('API POST request failed:', error);
            throw error;
        }
    },
    
    put: async (url, data = null, config = {}) => {
        try {
            // Xử lý params nếu có
            let finalUrl = url;
            if (config.params) {
                const params = new URLSearchParams();
                Object.keys(config.params).forEach(key => {
                    if (config.params[key] !== null && config.params[key] !== undefined) {
                        params.append(key, config.params[key]);
                    }
                });
                finalUrl = `${url}?${params.toString()}`;
            }
            
            const response = await fetch(finalUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...config.headers
                },
                body: data ? JSON.stringify(data) : null
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return response.json();
        } catch (error) {
            console.error('API PUT request failed:', error);
            throw error;
        }
    },
    
    delete: async (url, config = {}) => {
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...config.headers
                },
                ...config
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return response.json();
        } catch (error) {
            console.error('API DELETE request failed:', error);
            throw error;
        }
    }
};

export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        LOGIN: `${API_BASE_URL}/auth/login`,
        REGISTER: `${API_BASE_URL}/auth/register`,
        VALIDATE: `${API_BASE_URL}/auth/validate`
    },
    
    // Appointment endpoints
    APPOINTMENTS: {
        PATIENT: (userId) => `${API_BASE_URL}/appointments/patient/${userId}`,
        DOCTOR: (userId) => `${API_BASE_URL}/appointments/doctor/${userId}`,
        CREATE: `${API_BASE_URL}/appointments`,
        UPDATE: (id) => `${API_BASE_URL}/appointments/${id}`,
        DELETE: (id) => `${API_BASE_URL}/appointments/${id}`,
        CANCEL: `${API_BASE_URL}/appointments`,
        GET: (id) => `${API_BASE_URL}/appointments/${id}`,
        USER: `${API_BASE_URL}/appointments`
    },
    
    // Patient endpoints
    PATIENT: {
        PROFILE: (userId) => `${API_BASE_URL}/patients/${userId}`,
        HEALTH_METRICS: (userId) => `${API_BASE_URL}/patients/${userId}/health-metrics`,
        MEDICATIONS: (userId) => `${API_BASE_URL}/patients/${userId}/medications`
    },
    
    // Doctor endpoints
    DOCTOR: {
        PROFILE: (userId) => `${API_BASE_URL}/doctors/${userId}`,
        PATIENTS: (userId) => `${API_BASE_URL}/doctors/${userId}/patients`,
        AVAILABILITY: (doctorId) => `${API_BASE_URL}/doctors/${doctorId}/availability`,
        AVAILABLE_SLOTS: (doctorId) => `${API_BASE_URL}/doctors/${doctorId}/available-slots`,
        SLOTS_BY_DATE: (doctorId) => `${API_BASE_URL}/doctors/${doctorId}/slots`
    },
    
    // Slots endpoints (optimized)
    SLOTS: {
        AVAILABLE: (doctorId) => `${API_BASE_URL}/slots/doctor/${doctorId}/available`,
        BY_DATE_RANGE: (doctorId) => `${API_BASE_URL}/slots/doctor/${doctorId}`,
        SUMMARY: (doctorId) => `${API_BASE_URL}/slots/doctor/${doctorId}/summary`
    },
    
    SPECIALTY: {
        ALL: `${API_BASE_URL}/specialties`,
        GET: (code) => `${API_BASE_URL}/specialties/${code}`
    }
};

// Export the API client as default
export default api; 