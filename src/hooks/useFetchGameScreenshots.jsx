import { useState, useEffect } from 'react';
import GameService from '../services/GameService';

const useFetchGameScreenshots = (id) => {
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScreenshots = async () => {
      try {
        const response = await GameService.getGameScreenshots(id);
        setScreenshots(response);
      } catch (error) {
        setError('Failed to fetch game screenshots! refresh the page');
        console.error('Failed to fetch game screenshots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScreenshots();
  }, [id]);

  return { screenshots, loading, error };
};

export default useFetchGameScreenshots;