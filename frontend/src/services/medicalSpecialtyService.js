import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import { getAuthHeader } from "../utils/getAuthHeader";

const medicalSpecialtyService = {
    getMedicalSpecialties: async () => {
        const response = await axios.get(API_ENDPOINTS.SPECIALTY.ALL, {
            headers: getAuthHeader()
        });
        return response.data;
    },
    getMedicalSpecialty: async (code) => {
        const response = await axios.get(API_ENDPOINTS.SPECIALTY.GET(code), {
            headers: getAuthHeader()
        }); 
        return response.data;
    }
}

export default medicalSpecialtyService;