import React, { useEffect, useState, useContext, useMemo } from 'react';
import { useParams } from 'react-router';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { DarkModeContext } from '../context/DarkModeContext';
import GameCard from '../components/GameCard';
import styles from '../styles/Home.module.css';
import GamesListService from '../services/GamesListService';
import { motion, AnimatePresence } from 'framer-motion';
import UserSearch from '../components/UserSearch';

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
    setError('');
    setGameList([]); 
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
    } catch (err) {
      console.error('Error loading user\'s game list:', err);
      setError(`Failed to load ${username}'s game list`);
    } finally {
      setLoading(false);
    }
  };

  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? '#151414' : '#F3F1EC',
        paper: darkMode ? '#1F1D1B' : '#FFFFFF',
      },
      primary: {
        main: darkMode ? '#D4AA5C' : '#A6772A', // brass accent
      },
      text: {
        primary: darkMode ? '#EDEAE3' : '#221F1B',
        secondary: darkMode ? '#B8B2A6' : '#5B564C',
      },
      divider: darkMode ? 'rgba(212,170,92,0.28)' : 'rgba(166,119,42,0.35)',
    },
    typography: {
      fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    },
  }), [darkMode]);

  const accent = theme.palette.primary.main;

  const spineColor = (genres) => {
    const key = genres?.[0]?.name?.toLowerCase().replace(/\s+/g, '-');
    return GENRE_SPINES[key] || FALLBACK_SPINE;
  };


const handleRemove = (gameId) => {
  setGameList(prevList => prevList.filter(game => game.id !== gameId));
};

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.home}>
        {/* Banner placed above the cards listing */}
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: { xs: 6, md: 8 }, pb: 2 }}>
          <Box
            sx={{
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 1,
              px: { xs: 2.5, md: 4 },
              py: { xs: 2.5, md: 3 },
              mb: 0,
              position: 'relative',
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
              LIB — {username}
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
              {username}'s Collection
            </Typography>
            <UserSearch />
            <Box sx={{ borderTop: '1px dashed', borderColor: 'divider', pt: 1, mt: 1.5 }}>
              <Typography
                sx={{
                  fontFamily: '"JetBrains Mono", "Roboto Mono", monospace',
                  fontSize: '0.8rem',
                  color: 'text.secondary',
                }}
              >
                {loading ? '—' : String(gameList.length).padStart(3, '0')} title{gameList.length === 1 ? '' : 's'} on record
              </Typography>
            </Box>
          </Box>
        </Box>
        <Container className={styles.container}>

          {/* Error state */}
          {error && (
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", "Roboto Mono", monospace',
                fontSize: '0.85rem',
                color: 'error.main',
                mb: 4,
              }}
            >
              ⚠ {error}
            </Typography>
          )}

          {/* Loading state — skeleton grid instead of a text line */}
          {loading && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 2.5,
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rounded"
                  height={280}
                  sx={{ borderRadius: 1.5, bgcolor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}
                />
              ))}
            </Box>
          )}

          {/* Empty state */}
          {!loading && !error && gameList.length === 0 && (
            <Box
              sx={{
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                py: 6,
                px: 3,
                textAlign: 'center',
                maxWidth: 480,
              }}
            >
              <Typography variant="h6" sx={{ color: 'text.primary', mb: 0.5 }}>
                Shelf is empty
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                {username} hasn't added any games to their library yet.
              </Typography>
            </Box>
          )}

          {/* Game list */}
          {!loading && gameList.length > 0 && (
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
}

export default UserTracker;