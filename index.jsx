import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardContent, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    background: '#FAF9F6',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    padding: theme.spacing(3),
  },
}));

const TrainsDetails = () => {
  const classes = useStyles();
  const [trains, setTrains] = useState([]);

  useEffect(() => {
    // Replace this with your API URL
    const URL = '/trains';

    axios.get(URL)
      .then((response) => setTrains(response.data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h3" gutterBottom>
        Train Details
      </Typography>
      <Grid container spacing={3}>
        {trains.map((train) => (
          <Grid key={train.trainNumber} item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {train.trainName} - {train.trainNumber}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Departure Time: {new Date(train.departureTime).toLocaleTimeString()}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Seats Available: {train.seatsAvailable}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Price: ${train.price}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Delay: {train.delay} minutes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TrainsDetails;
