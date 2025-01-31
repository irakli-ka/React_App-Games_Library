import axios from "axios";

const API_KEY = import.meta.env.VITE_RAWG_API_KEY
const BASE_URL = "https://api.rawg.io/api/games";

class GameService {
  static async getGames(params) {
    try {
      const response = await axios.get(BASE_URL, {
        params: { ...params, key: API_KEY }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching games:", error);
      throw error;
    }
  }

  static async getGameDetails(gameId) {
    try {
      const response = await axios.get(`${BASE_URL}/${gameId}`, {
        params: { key: API_KEY },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching details for game ID ${gameId}:`, error);
      throw error;
    }
  }
}

export default GameService;