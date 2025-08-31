import axios from 'axios';
import { config } from '../config/config.js';

export async function getSignature(meetingNumber, role, token) {
  try {
    console.log(meetingNumber, role, token);
    const response = await axios.post(
      `${config.API_BASE_URL}/zoom`,
      {
        meetingNumber,
        role
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.signature;
  } catch (error) {
    console.error('Error fetching signature:', error.response?.data || error.message);
  }
}
