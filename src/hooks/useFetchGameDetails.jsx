import { useState, useEffect } from 'react';
import GameService from '../services/GameService';

const useFetchGameDetails = (id) => {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await GameService.getGameDetails(id);
        setGame(response);
      } catch (error) {
        setError('Failed to fetch game details! refresh the page');
        console.error('Failed to fetch game details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  return { game, loading, error };
};

export default useFetchGameDetails;