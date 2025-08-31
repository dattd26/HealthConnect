import api from '../config/api';
import { getAuthHeader } from '../utils/getAuthHeader';

import { config } from '../config/config.js';

const PATIENT_API_BASE = `${config.API_BASE_URL}/user`;

export const patientService = {
  // Get patient profile
  getPatientProfile: async () => {
    try {
      const response = await api.get(`${PATIENT_API_BASE}/profile`, {
        headers: getAuthHeader()
      });
      return response;
    } catch (error) {
      console.error('Error getting patient profile:', error);
      throw error;
    }
  },

  // Update patient profile
  updatePatientProfile: async (profileData) => {
    try {
      const response = await api.put(`${PATIENT_API_BASE}/profile/update`, profileData, {
        headers: getAuthHeader()
      });
      return response;
    } catch (error) {
      console.error('Error updating patient profile:', error);
      throw error;
    }
  },

  // Get patient health records
  getHealthRecords: async () => {
    try {
      const response = await api.get(`${PATIENT_API_BASE}/health-record`, {
        headers: getAuthHeader()
      });
      return response;
    } catch (error) {
      console.error('Error getting health records:', error);
      throw error;
    }
  },

  // Update patient health records
  updateHealthRecords: async (healthData) => {
    try {
      const response = await api.put(`${PATIENT_API_BASE}/health-record/update`, healthData, {
        headers: getAuthHeader()
      });
      return response;
    } catch (error) {
      console.error('Error updating health records:', error);
      throw error;
    }
  },

  // Get patient health data by type
  getHealthData: async (type, startDate = null, endDate = null) => {
    try {
      const params = { type };
      if (startDate) params.start = startDate;
      if (endDate) params.end = endDate;
      
              const response = await api.get(`${config.API_BASE_URL}/health-data`, {
        headers: getAuthHeader(),
        params
      });
      return response;
    } catch (error) {
      console.error('Error getting health data:', error);
      throw error;
    }
  },

  // Add new health data
  addHealthData: async (healthData) => {
    try {
              const response = await api.post(`${config.API_BASE_URL}/health-data`, healthData, {
        headers: getAuthHeader()
      });
      return response;
    } catch (error) {
      console.error('Error adding health data:', error);
      throw error;
    }
  },

  // Get patient dashboard summary
  getDashboardSummary: async () => {
    try {
      // This would be a dedicated endpoint in a real system
      // For now, we'll return a summary object
      return {
        totalAppointments: 0,
        upcomingAppointments: 0,
        completedAppointments: 0,
        totalPayments: 0,
        healthScore: 0
      };
    } catch (error) {
      console.error('Error getting dashboard summary:', error);
      throw error;
    }
  }
};

export default patientService;
