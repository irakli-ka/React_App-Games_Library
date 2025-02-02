import React, { useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { DarkModeContext } from '../context/DarkModeContext';
import { Link } from 'react-router';

const GameCard = ({ game }) => {
  const { darkMode } = useContext(DarkModeContext);

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
      </Card>
    </ThemeProvider>
  );
};

export default GameCard;
