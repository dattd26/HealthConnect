import axios from 'axios';


export async function getSignature(meetingNumber, role, token) {
  try {
    console.log(meetingNumber, role, token);
    const response = await axios.post(
      'http://localhost:8080/api/zoom',
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
