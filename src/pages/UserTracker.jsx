import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { DarkModeContext } from '../context/DarkModeContext';
import GameCard from '../components/GameCard';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/Home.module.css';
import GamesListService from '../services/GamesListService';

function UserTracker() {
  const { username } = useParams();
  const { darkMode } = useContext(DarkModeContext);
  const [gameList, setGameList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUserGameList();
  }, [username]);

  const loadUserGameList = async () => {
    setLoading(true);
    try {
      const userGames = await GamesListService.getUserGamesList(username);
      
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
    } catch (error) {
      console.error('Error loading user game list:', error);
      setError(`Failed to load ${username}'s game list`);
    } finally {
      setLoading(false);
    }
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
              Loading {username}'s game list...
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
            <Typography 
            variant="h4" 
            color="text.primary" 
            style={{ 
                position: 'absolute',
                top: '70px', 
                left: '20px',
                marginBottom: '20px',
                zIndex: 999
            }}
            >
            {username}'s Game List
            </Typography>
            
            {error && (
            <Typography variant="h6" color="error" style={{ marginBottom: '20px' }}>
                {error}
            </Typography>
            )}
            
            {gameList.length === 0 ? (
            <Typography variant="h6" color="text.primary">
                {username} hasn't added any games to their list yet.
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
                    <GameCard game={game} onRemove={() => {}} /> {}
                </motion.div>
                ))}
            </AnimatePresence>
            )}
        </Container>
        </div>
    </ThemeProvider>
    );
}

export default UserTracker;