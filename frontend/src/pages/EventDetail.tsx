import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import { getEventById, getSeatsForEvent, bookSeat } from '../services/api';

interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
}

interface Seat {
  id: number;
  row: string;
  number: number;
  isBooked: boolean;
}

const EventDetail: React.FC = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingMsg, setBookingMsg] = useState('');

  useEffect(() => {
    if (id) {
      getEventById(Number(id)).then(data => setEvent(data));
      getSeatsForEvent(Number(id)).then(data => {
        setSeats(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleBook = async (seatId: number) => {
    setBookingMsg('');
    try {
      await bookSeat(Number(id), seatId);
      setBookingMsg('Seat booked successfully!');
      setSeats(seats.map(s => s.id === seatId ? { ...s, isBooked: true } : s));
    } catch {
      setBookingMsg('Booking failed.');
    }
  };

  if (loading) return <CircularProgress />;
  if (!event) return <Typography>Event not found.</Typography>;

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4 }}>{event.name}</Typography>
      <Box sx={{ mt: 2 }}>
        <Typography>Date: {event.date}</Typography>
        <Typography>Location: {event.location}</Typography>
        <Typography>Description: {event.description}</Typography>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Seats</Typography>
        {bookingMsg && <Alert severity="info">{bookingMsg}</Alert>}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {seats.map(seat => (
            <Grid item key={seat.id}>
              <Button
                variant={seat.isBooked ? 'outlined' : 'contained'}
                color={seat.isBooked ? 'secondary' : 'primary'}
                disabled={seat.isBooked}
                onClick={() => handleBook(seat.id)}
              >
                Row {seat.row} - #{seat.number}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default EventDetail; 