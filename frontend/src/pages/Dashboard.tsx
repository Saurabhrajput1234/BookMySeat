import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Alert from '@mui/material/Alert';
import { getMyBookings } from '../services/api';

interface Booking {
  id: number;
  event: { name: string; date: string; location: string };
  seat: { row: string; number: number };
  bookingTime: string;
  paymentStatus: string;
}

const Dashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyBookings()
      .then(data => {
        setBookings(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load bookings.');
        setLoading(false);
      });
  }, []);

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4 }}>User Dashboard</Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">My Bookings</Typography>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && (
          <List>
            {bookings.length === 0 && (
              <ListItem>
                <ListItemText primary="No bookings found." />
              </ListItem>
            )}
            {bookings.map(booking => (
              <ListItem key={booking.id}>
                <ListItemText
                  primary={`${booking.event.name} - Row ${booking.seat.row} #${booking.seat.number}`}
                  secondary={`Date: ${booking.event.date} | Location: ${booking.event.location} | Status: ${booking.paymentStatus} | Booked at: ${new Date(booking.bookingTime).toLocaleString()}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard; 