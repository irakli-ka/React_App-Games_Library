import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class AuthService {
  static async login(username, password) {
    console.log(API_BASE_URL);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/Users/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, 
        {}, 
        {
          withCredentials: true
        }
      );
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  static async signup(username, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/Users/signup?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, 
        {},
        {
          withCredentials: true
        }
      );
      

      return response.status === 200 ? { success: true } : response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  static async logout() {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/Users/logout`, {}, {
        withCredentials: true
      });

      return { success: true };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}

export default AuthService;