import React, { useEffect, useState, useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { DarkModeContext } from '../context/DarkModeContext';
import { useAuth } from '../context/AuthContext';
import GameCard from '../components/GameCard';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/Home.module.css';
import GamesListService from '../services/GamesListService';
import UserSearch from '../components/UserSearch';

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
          genres:
            typeof (game.genres || game.Genres) === 'string'
              ? (game.genres || game.Genres)
                  .split(', ')
                  .map(name => ({ name: name.trim() }))
              : (game.genres || game.Genres || []).map(genre =>
                  typeof genre === 'string' ? { name: genre } : genre
                ),
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
    setGameList(prev => prev.filter(game => game.id !== gameId));
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? '#151414' : '#F3F1EC',
        paper: darkMode ? '#1F1D1B' : '#FFFFFF',
      },
      primary: {
        main: darkMode ? '#D4AA5C' : '#A6772A',
      },
      text: {
        primary: darkMode ? '#EDEAE3' : '#221F1B',
        secondary: darkMode ? '#B8B2A6' : '#5B564C',
      },
      divider: darkMode
        ? 'rgba(212,170,92,0.28)'
        : 'rgba(166,119,42,0.35)',
    },
    typography: {
      fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    },
  });

  const accent = theme.palette.primary.main;

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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: { xs: 6, md: 8 },
            pb: 2,
          }}
        >
          <Box
            sx={{
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 1,
              px: { xs: 2.5, md: 4 },
              py: { xs: 2.5, md: 3 },
              maxWidth: 720,
              width: '100%',
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", "Roboto Mono", monospace',
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                color: accent,
                textTransform: 'uppercase',
                mb: 0.75,
              }}
            >
              LIB — {isAuthenticated && user?.username ? user.username.toUpperCase() : 'LOCAL'}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                lineHeight: 1.15,
                color: 'text.primary',
                mb: 1,
              }}
            >
              {isAuthenticated && user?.username ? `${user.username}'s Collection` : 'Local Collection'}
            </Typography>
              <UserSearch />
            <Box
              sx={{
                borderTop: '1px dashed',
                borderColor: 'divider',
                pt: 1,
                mt: 1.5,
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"JetBrains Mono", "Roboto Mono", monospace',
                  fontSize: '0.8rem',
                  color: 'text.secondary',
                }}
              >
                {String(gameList.length).padStart(3, '0')} title
                {gameList.length === 1 ? '' : 's'} on record
              </Typography>
            </Box>
          </Box>
        </Box>

        <Container className={styles.container}>
          {error && (
            <Typography
              variant="h6"
              color="error"
              sx={{ marginBottom: '20px' }}
            >
              {error}
            </Typography>
          )}

          {gameList.length === 0 ? (
            <Typography variant="h6" color="text.primary">
              {!isAuthenticated
                ? 'Your list is empty. Please login to sync your games across devices, or add some games to your local list!'
                : 'Your list is empty. Add some games to your list!'}
            </Typography>
          ) : (
            <AnimatePresence>
              {gameList.map(game => (
                <motion.div
                  key={game.id}
                  className={styles['game-card']}
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
}

export default Tracker;