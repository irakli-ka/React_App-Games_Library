import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import theme from '../theme';

const GameCard = ({ game }) => {
    console.log(game);
  return (
    <ThemeProvider theme={theme}>
      <Card>
        <CardMedia
          component="img"
          image={game.background_image}
          alt={game.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
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
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </ThemeProvider>
  );
};

export default GameCard;