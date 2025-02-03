import React, { useContext, useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { DarkModeContext } from '../context/DarkModeContext';
import { Link } from 'react-router';

function GameCard({ game, onRemove }) {
  const { darkMode } = useContext(DarkModeContext);
  const [inList, setInList] = useState(false);

  useEffect(() => {
    const existingList = JSON.parse(localStorage.getItem('gameList')) || [];
    const isInList = existingList.some((item) => item.id === game.id);
    setInList(isInList);
  }, [game.id]);

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

  const toggleList = () => {
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
            Rating: {game.rating}⭐
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" component={Link} to={`/game/${game.id}`}>
            Details
          </Button>
        </CardActions>
        <CardActions>
          <Button size="small" onClick={toggleList}>
            {inList ? 'Remove from list' : 'Add to list'}
          </Button>
        </CardActions>
      </Card>
    </ThemeProvider>
  );
};

export default GameCard;