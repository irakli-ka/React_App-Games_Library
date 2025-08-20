import React, { useContext, useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { DarkModeContext } from '../context/DarkModeContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router';
import GamesListService from '../services/GamesListService';

function GameCard({ game, onRemove }) {
  const { darkMode } = useContext(DarkModeContext);
  const { isAuthenticated, user } = useAuth();  
  const [inList, setInList] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      checkIfInList();
    } else {
      const existingList = JSON.parse(localStorage.getItem('gameList')) || [];
      const isInList = existingList.some((item) => item.id === game.id);
      setInList(isInList);
    }
  }, [game.id, isAuthenticated]);

  
  const checkIfInList = async () => {
    try {
      if (user?.username) {
        const userGames = await GamesListService.getUserGamesList(user.username);
        
        const mappedGames = userGames.map(game => ({
          id: game.rawgId || game.RawgId || game.id
        }));
        
        const isInList = mappedGames.some((item) => item.id === game.id);
        setInList(isInList);
      }
    } catch (error) {
      console.error('Error checking if game is in list:', error);
      const existingList = JSON.parse(localStorage.getItem('gameList')) || [];
      const isInList = existingList.some((item) => item.id === game.id);
      setInList(isInList);
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
        secondary: darkMode ? '#b0bec5' : '#000',
      },
    },
  });

  
  const toggleList = async () => {
    if (!isAuthenticated) {
      const existingList = JSON.parse(localStorage.getItem('gameList')) || [];
      const isInList = existingList.some((item) => item.id === game.id);
  
      let updatedList;
      if (isInList) {
        updatedList = existingList.filter((item) => item.id !== game.id);
        if (onRemove) onRemove(game.id);
      } else {
        updatedList = [...existingList, game];
      }
  
      localStorage.setItem('gameList', JSON.stringify(updatedList));
      setInList(!isInList);
      return;
    }
  
    setLoading(true);
    try {
      if (inList) {
        await GamesListService.removeGameFromUserList(game.id);
        if (onRemove) onRemove(game.id);
      } else {
        const gameDto = {
          RawgId: game.id, 
          Name: game.name || '',
          Release: game.released || '', 
          Rating: game.rating?.toString() || '0', 
          BackgroundImage: game.background_image || '', 
          Genres: game.genres?.map(g => g.name) || []
        };
        
        console.log('Sending game DTO:', gameDto); 
        await GamesListService.addGameToUserList(gameDto);
      }
      setInList(!inList);
    } catch (error) {
      console.error('Error toggling game in list:', error);
      
      let errorMessage = 'Failed to update your list. ';
      if (error.errors) {
        const validationErrors = Object.entries(error.errors).map(([field, messages]) => 
          `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
        ).join('; ');
        errorMessage += `Validation errors: ${validationErrors}`;
      } else {
        errorMessage += 'Please try again.';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ backgroundColor: theme.palette.background.paper }}>
        <CardMedia
          component="img"
          loading="lazy"
          image={game.background_image || "/placeholder.jpg"}
          alt={game.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" color="text.primary">
            {game.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Released: {game.released}
          </Typography>
          <Typography variant="body2" color="text.secondary">
                Genres: {game.genres?.map(genre => genre.name).join(', ')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Rating: {game.rating}⭐
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" component={Link} to={`/game/${game.id}`}>
            Details
          </Button>
        </CardActions>
        <CardActions>
          <Button size="small" onClick={toggleList} disabled={loading}>
            {loading ? 'Loading...' : (inList ? 'Remove from list' : 'Add to list')}
          </Button>
        </CardActions>
      </Card>
    </ThemeProvider>
  );
};

export default GameCard;