import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
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
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          mb: 4,
          textAlign: 'center',
          color: '#d4af37'
        }}
      >
        User Dashboard
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{ mb: 2, color: '#d4af37', fontWeight: 600 }}
        >
          My Bookings
        </Typography>

        {loading && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <CircularProgress sx={{ color: '#d4af37' }} />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && bookings.length === 0 && (
          <Alert
            severity="info"
            sx={{ bgcolor: '#fffbe6', color: '#000', fontWeight: 500 }}
          >
            No bookings found.
          </Alert>
        )}

        {!loading &&
          !error &&
          bookings.map(booking => (
            <Card
              key={booking.id}
              sx={{
                mb: 3,
                bgcolor: '#000',
                color: '#fff',
                border: '1px solid #d4af37',
                borderRadius: 3,
                boxShadow: '0px 4px 12px rgba(0,0,0,0.4)'
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: '#d4af37',
                    mb: 1
                  }}
                >
                  {booking.event.name}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: '#ccc', mb: 1 }}
                >
                  Seat: Row {booking.seat.row} - #{booking.seat.number}
                </Typography>
                <Divider sx={{ borderColor: '#333', my: 1 }} />
                <Typography variant="body2" sx={{ color: '#bbb' }}>
                  Date: {booking.event.date}
                </Typography>
                <Typography variant="body2" sx={{ color: '#bbb' }}>
                  Location: {booking.event.location}
                </Typography>
                <Typography variant="body2" sx={{ color: '#bbb' }}>
                  Status: {booking.paymentStatus}
                </Typography>
                <Typography variant="body2" sx={{ color: '#bbb' }}>
                  Booked At: {new Date(booking.bookingTime).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
      </Box>
    </Container>
  );
};

export default Dashboard;
