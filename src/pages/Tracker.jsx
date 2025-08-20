import React, { useEffect, useState, useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { DarkModeContext } from '../context/DarkModeContext';
import { useAuth } from '../context/AuthContext';
import GameCard from '../components/GameCard';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/Home.module.css';
import GamesListService from '../services/GamesListService';

function Tracker() {
  const { darkMode } = useContext(DarkModeContext);
  const { isAuthenticated, user } = useAuth();
  const [gameList, setGameList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGameList();
  }, [isAuthenticated]);

  
  const loadGameList = async () => {
    setLoading(true);
    try {
      if (isAuthenticated && user?.username) {
        const userGames = await GamesListService.getUserGamesList(user.username);
        
        const mappedGames = userGames.map(game => ({
          id: game.rawgId || game.RawgId || game.id,
          name: game.name || game.Name,
          background_image: game.backgroundImage || game.BackgroundImage,
          released: game.release || game.Release,
          rating: parseFloat(game.rating || game.Rating) || 0,
          genres: typeof (game.genres || game.Genres) === 'string' 
            ? (game.genres || game.Genres).split(', ').map(name => ({ name: name.trim() }))
            : (game.genres || game.Genres || []).map(genre => 
                typeof genre === 'string' ? { name: genre } : genre
              )
        }));
        
        setGameList(mappedGames);
      } else {
        const storedList = JSON.parse(localStorage.getItem('gameList')) || [];
        setGameList(storedList);
      }
    } catch (error) {
      console.error('Error loading game list:', error);
      setError('Failed to load your game list');
      const storedList = JSON.parse(localStorage.getItem('gameList')) || [];
      setGameList(storedList);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (gameId) => {
    setGameList(prevList => prevList.filter((game) => game.id !== gameId));
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      background: {
        paper: darkMode ? '#424242' : '#d1d1d1',
      },
      text: {
        primary: darkMode ? '#fff' : '#000',
        secondary: darkMode ? '#dae0e3' : '#000',
      },
    },
  });

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <div className={styles.home}>
          <Container className={styles.container}>
            <Typography variant="h6" color="text.primary">
              Loading your game list...
            </Typography>
          </Container>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.home}>
        <Container className={styles.container}>
          {error && (
            <Typography variant="h6" color="error" style={{ marginBottom: '20px' }}>
              {error}
            </Typography>
          )}
          {gameList.length === 0 ? (
            <Typography variant="h6" color="text.primary">
              {!isAuthenticated 
                ? "Your list is empty. Please login to sync your games across devices, or add some games to your local list!"
                : "Your list is empty. Add some games to your list!"
              }
            </Typography>
          ) : (
            <AnimatePresence>
              {gameList.map((game) => (
                <motion.div
                  key={game.id}
                  className={styles["game-card"]}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <GameCard game={game} onRemove={handleRemove} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default Tracker;