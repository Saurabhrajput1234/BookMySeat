import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, CircularProgress, Box, Button, Alert } from '@mui/material';
import { getEventById, getSeatsForEvent, bookSeat } from '../services/api';
import { HubConnectionBuilder } from '@microsoft/signalr';

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
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const [event, setEvent] = useState<Event | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingMsg, setBookingMsg] = useState('');

  useEffect(() => {
    if (!eventId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [eventData, seatData] = await Promise.all([
          getEventById(eventId),
          getSeatsForEvent(eventId)
        ]);
        setEvent(eventData);
        setSeats(seatData);
      } catch {
        setBookingMsg('Failed to load event data');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const conn = new HubConnectionBuilder()
      .withUrl('http://localhost:5224/seathub')
      .withAutomaticReconnect()
      .build();

    conn
      .start()
      .then(() => conn.invoke('JoinEventGroup', eventId))
      .catch(err => console.error('SignalR Connection Error:', err));

    conn.on('SeatStatusUpdated', (seatId: number, isBooked: boolean) => {
      setSeats(prevSeats => prevSeats.map(s => s.id === seatId ? { ...s, isBooked } : s));
    });

    return () => {
      conn.stop();
    };
  }, [eventId]);

  const handleBook = async (seatId: number) => {
    setBookingMsg('');
    try {
      await bookSeat(eventId, seatId);
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
        <Typography variant="h6" gutterBottom>Seats</Typography>
        {bookingMsg && <Alert severity="info" sx={{ mt: 2 }}>{bookingMsg}</Alert>}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
          {seats.map(seat => (
            <Box
              key={seat.id}
              sx={{
                width: { xs: '100%', sm: '48%', md: '23%' }, // responsive layout
              }}
            >
              <Button
                fullWidth
                variant={seat.isBooked ? 'outlined' : 'contained'}
                color={seat.isBooked ? 'secondary' : 'primary'}
                disabled={seat.isBooked}
                onClick={() => handleBook(seat.id)}
              >
                Row {seat.row} - #{seat.number}
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default EventDetail;
