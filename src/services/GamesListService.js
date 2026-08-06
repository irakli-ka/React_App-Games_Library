import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

class GamesListService {
  static async addGameToUserList(gameDto) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/Users/games`, gameDto, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  static async removeGameFromUserList(gameId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/Users/games?gameId=${gameId}`, {
        withCredentials: true
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  static async getUserGamesList(username) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Games/username/${encodeURIComponent(username)}`, {
        withCredentials: true
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  static async getAllGames() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Games`, {
        withCredentials: true
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  static async getGameById(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Games/${id}`, {
        withCredentials: true
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}

export default GamesListService;