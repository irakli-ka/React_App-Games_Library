import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router';
import GameService from '../services/GameService';
import { DarkModeContext } from '../context/DarkModeContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import Collapse from '@mui/material/Collapse';
import { Button } from '@mui/material';
import styles from '../styles/Game.module.css';

const Game = () => {
  const { id } = useParams(); 
  const { darkMode } = useContext(DarkModeContext); 
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [descriptionOpen, setDescriptionOpen] = useState(false); 
  const [tagsOpen, setTagsOpen] = useState(false); 

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
      <Container className={styles.container}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className={styles.container}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const getStoreUrl = (store) => {
    return `https://${store.store.domain}`;
  };


  return (
    <ThemeProvider theme={theme}>
      <div className={styles.body}>
        <Container className={styles.container}>
          <Card className={`${styles['game-details-card']} ${darkMode ? styles['dark-mode'] : ''}`}>
            <div className={styles['game-image-container']}>
              <CardMedia
                component="img"
                image={game.background_image}
                alt={game.name}
                className={styles['game-image']}
              />
            </div>
            <CardContent className={styles['game-info']}>
              <Typography gutterBottom variant="h5" component="div" color="text.primary">
                {game.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Creator: {game.developers?.map(dev => dev.name).join(', ')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Website: <a href={game.website} target="_blank" rel="noopener noreferrer">{game.website}</a>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Released: {game.released}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rating: {game.rating}⭐
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Metacritic: {game.metacritic}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Genres: {game.genres?.map(genre => genre.name).join(', ')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Platforms: {game.platforms?.map(platform => platform.platform.name).join(', ')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ESRB Rating: {game.esrb_rating?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Stores: {game.stores?.map(store => (
                  <span key={store.id}>
                    <a href={getStoreUrl(store)} target="_blank" rel="noopener noreferrer">{store.store.name}</a>{' '}
                  </span>
                ))}
              </Typography>
              <div>
                <Typography variant="body2" color="text.secondary">
                  Tags: {game.tags?.slice(0, 3).map(tag => tag.name).join(', ')}
                </Typography>
                {game.tags?.length > 3 && (
                  <>
                    <Collapse in={tagsOpen} timeout="auto" unmountOnExit>
                      <Typography variant="body2" color="text.secondary">
                        {game.tags.slice(3).map(tag => (
                          <span key={tag.id}>{tag.name}, </span>
                        ))}
                      </Typography>
                    </Collapse>
                    <Button
                      onClick={() => setTagsOpen(!tagsOpen)}
                      aria-expanded={tagsOpen}
                      aria-label="expand"
                    >
                      {tagsOpen ? 'Show Less Tags' : 'Show More Tags'}
                    </Button>
                  </>
                )}
              </div>
              <Button
                onClick={() => setDescriptionOpen(!descriptionOpen)}
                aria-expanded={descriptionOpen}
                aria-label="show more"
              >
                {descriptionOpen ? 'Hide Description' : 'Show Description'}
              </Button>
              <Collapse in={descriptionOpen} timeout="auto" unmountOnExit>
                <Typography variant="body2" color="text.secondary">
                  Description: {game.description_raw}
                </Typography>
              </Collapse>
            </CardContent>
          </Card>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default Game;