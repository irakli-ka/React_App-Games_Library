import React, { useEffect, useState, useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { DarkModeContext } from '../context/DarkModeContext';
import GameCard from '../components/GameCard';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/Home.module.css';

function Tracker() {
  const { darkMode } = useContext(DarkModeContext);
  const [gameList, setGameList] = useState([]);

  useEffect(() => {
    const storedList = JSON.parse(localStorage.getItem('gameList')) || [];
    setGameList(storedList);
  }, []);

  const handleRemove = (gameId) => {
    const updatedList = gameList.filter((game) => game.id !== gameId);
    localStorage.setItem('gameList', JSON.stringify(updatedList));
    setGameList(updatedList);
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

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.home}>
        <Container className={styles.container}>
          {gameList.length === 0 ? (
            <Typography variant="h6" color="text.primary">
              Your list is empty. Add some games to your list!
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