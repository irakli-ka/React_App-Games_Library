import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/api/igdb`;
const CACHE_VERSION = 'v1-igdb';

const STORE_DOMAINS = [
  { match: 'store.steampowered.com', name: 'Steam' },
  { match: 'epicgames.com/store', name: 'Epic Games' },
  { match: 'gog.com', name: 'GOG' },
  { match: 'itch.io', name: 'itch.io' },
  { match: 'xbox.com', name: 'Xbox' },
  { match: 'store.playstation.com', name: 'PlayStation Store' },
  { match: 'nintendo.com', name: 'Nintendo eShop' },
];

class GameService {
  static cache = {
    games: JSON.parse(sessionStorage.getItem(`gamesCache_${CACHE_VERSION}`)) || {},
    gameDetails: JSON.parse(sessionStorage.getItem(`gameDetailsCache_${CACHE_VERSION}`)) || {},
    searchResults: JSON.parse(sessionStorage.getItem(`searchResultsCache_${CACHE_VERSION}`)) || {},
    gameScreenshots: JSON.parse(sessionStorage.getItem(`gameScreenshotsCache_${CACHE_VERSION}`)) || {}
  };

  static saveCache() {
    sessionStorage.setItem(`gamesCache_${CACHE_VERSION}`, JSON.stringify(this.cache.games));
    sessionStorage.setItem(`gameDetailsCache_${CACHE_VERSION}`, JSON.stringify(this.cache.gameDetails));
    sessionStorage.setItem(`searchResultsCache_${CACHE_VERSION}`, JSON.stringify(this.cache.searchResults));
    sessionStorage.setItem(`gameScreenshotsCache_${CACHE_VERSION}`, JSON.stringify(this.cache.gameScreenshots));
  }

  static extractStores(websites) {
  const stores = [];
  for (const site of websites || []) {
    const found = STORE_DOMAINS.find(store => site.url?.includes(store.match));
    if (found) {
      stores.push({ id: site.id, name: found.name, url: site.url });
    }
  }
  return stores;
}

  static normalizeGame(g) {
    if (!g) return g;
    return {
      id: g.id,
      name: g.name,
      background_image: g.cover?.url || null,
      released: g.first_release_date
        ? new Date(g.first_release_date * 1000).toISOString().split('T')[0]
        : null,
      rating: g.rating ? +(g.rating / 20).toFixed(2) : 0,
      genres: (g.genres || []).map(genre => ({ name: genre.name })),
      description_raw: g.summary,
      developers: (g.involved_companies || []).map(ic => ({ name: ic.company?.name })),
      metacritic: g.rating ? Math.round(g.rating) : undefined,
      stores: this.extractStores(g.websites),
      platforms: (g.platforms || []).map(p => ({ platform: { name: p.name } })),
    };
  }

  static normalizeGames(list) {
    return (Array.isArray(list) ? list : []).map(g => this.normalizeGame(g));
  }

  static normalizeScreenshots(list) {
    return (Array.isArray(list) ? list : []).map(s => ({ image: s.url }));
  }


  static async getGames({ page = 1, page_size = 15 } = {}) {
    const offset = (page - 1) * page_size;
    const cacheKey = `offset_${offset}_limit_${page_size}`;
    if (this.cache.games[cacheKey]) {
      return this.cache.games[cacheKey];
    }

    try {
      const response = await axios.get(BASE_URL, {
        params: { offset, limit: page_size }
      });
      const raw = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      const result = { results: this.normalizeGames(raw) };
      this.cache.games[cacheKey] = result;
      this.saveCache();
      return result;
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
      const response = await axios.get(`${BASE_URL}/${gameId}`);
      const raw = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      const game = this.normalizeGame(Array.isArray(raw) ? raw[0] : raw);
      this.cache.gameDetails[gameId] = game;
      this.saveCache();
      return game;
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
      const response = await axios.get(`${BASE_URL}/${gameId}/screenshots`);
      const raw = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      const screenshots = this.normalizeScreenshots(raw);
      this.cache.gameScreenshots[gameId] = screenshots;
      this.saveCache();
      return screenshots;
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
      const response = await axios.get(`${BASE_URL}/search`, {
        params: { query }
      });
      const raw = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      const result = { results: this.normalizeGames(raw) };
      this.cache.searchResults[query] = result;
      this.saveCache();
      return result;
    } catch (error) {
      console.error(`Error searching games with query "${query}":`, error);
      throw error;
    }
  }
}

export default GameService;