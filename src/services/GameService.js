import axios from "axios";

const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api/games";

class GameService {
  static cache = {
    games: JSON.parse(sessionStorage.getItem('gamesCache')) || {},
    gameDetails: JSON.parse(sessionStorage.getItem('gameDetailsCache')) || {},
    searchResults: JSON.parse(sessionStorage.getItem('searchResultsCache')) || {},
    gameScreenshots: JSON.parse(sessionStorage.getItem('gameScreenshotsCache')) || {}
  };

  static saveCache() {
    sessionStorage.setItem('gamesCache', JSON.stringify(this.cache.games));
    sessionStorage.setItem('gameDetailsCache', JSON.stringify(this.cache.gameDetails));
    sessionStorage.setItem('searchResultsCache', JSON.stringify(this.cache.searchResults));
    sessionStorage.setItem('gameScreenshotsCache', JSON.stringify(this.cache.gameScreenshots));
  }

  static async getGames(params) {
    const cacheKey = `page_${params.page}_size_${params.page_size}`;
    if (this.cache.games[cacheKey]) {
      return this.cache.games[cacheKey];
    }

    try {
      const response = await axios.get(BASE_URL, {
        params: { ...params, key: API_KEY }
      });
      this.cache.games[cacheKey] = response.data;
      this.saveCache();
      return response.data;
    } catch (error) {
      console.error("Error fetching games:", error);
      throw error;
    }
  }

  static async getGameDetails(gameId) {
    if (this.cache.gameDetails[gameId]) {
      return this.cache.gameDetails[gameId];
    }

    try {
      const response = await axios.get(`${BASE_URL}/${gameId}`, {
        params: { key: API_KEY },
      });
      this.cache.gameDetails[gameId] = response.data;
      this.saveCache();
      return response.data;
    } catch (error) {
      console.error(`Error fetching details for game ID ${gameId}:`, error);
      throw error;
    }
  }

  static async getGameScreenshots(gameId) {
    if (this.cache.gameScreenshots[gameId]) {
      return this.cache.gameScreenshots[gameId];
    }

    try {
      const response = await axios.get(`${BASE_URL}/${gameId}/screenshots`, {
        params: { key: API_KEY },
      });
      this.cache.gameScreenshots[gameId] = response.data.results;
      this.saveCache();
      return response.data.results;
    } catch (error) {
      console.error(`Error fetching screenshots for game ID ${gameId}:`, error);
      throw error;
    }
  }

  static async searchGames(query) {
    if (this.cache.searchResults[query]) {
      return this.cache.searchResults[query];
    }

    try {
      const response = await axios.get(BASE_URL, {
        params: { key: API_KEY, search: query, page_size: 100 },
      });
      this.cache.searchResults[query] = response.data;
      this.saveCache();
      return response.data;
    } catch (error) {
      console.error(`Error searching games with query "${query}":`, error);
      throw error;
    }
  }
}

export default GameService;
