import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Button,
  Alert,
  Card,
  CardContent
} from '@mui/material';
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
      .withUrl('http://localhost:5224/seathub', {
        accessTokenFactory: () => localStorage.getItem('token') || ''
      })
      .withAutomaticReconnect()
      .build();

    conn
      .start()
      .then(() => conn.invoke('JoinEventGroup', eventId))
      .catch(err => console.error('SignalR Connection Error:', err));

    conn.on('SeatStatusUpdated', (seatId: number, isBooked: boolean) => {
      setSeats(prevSeats =>
        prevSeats.map(s => (s.id === seatId ? { ...s, isBooked } : s))
      );
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
      setSeats(seats.map(s => (s.id === seatId ? { ...s, isBooked: true } : s)));
    } catch {
      setBookingMsg('Booking failed.');
    }
  };

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <CircularProgress sx={{ color: '#d4af37' }} />
      </Box>
    );

  if (!event)
    return (
      <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
        Event not found.
      </Typography>
    );

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Event Card */}
      <Card
        sx={{
          bgcolor: '#000',
          color: '#fff',
          border: '1px solid #d4af37',
          borderRadius: 3,
          p: 3,
          mb: 5
        }}
      >
        <CardContent>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: '#d4af37',
              textAlign: 'center'
            }}
          >
            {event.name}
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 1, textAlign: 'center', color: '#ccc' }}
          >
            {new Date(event.date).toLocaleDateString()} | {event.location}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mt: 2,
              textAlign: 'center',
              color: '#e4e4e4',
              fontSize: '1.1rem'
            }}
          >
            {event.description}
          </Typography>
        </CardContent>
      </Card>

      {/* Seats Section */}
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          textAlign: 'center',
          fontWeight: 700,
          color: '#d4af37'
        }}
      >
        Available Seats
      </Typography>

      {bookingMsg && (
        <Alert
          severity="info"
          sx={{
            mb: 3,
            textAlign: 'center',
            fontWeight: 600,
            bgcolor: '#fffbe6'
          }}
        >
          {bookingMsg}
        </Alert>
      )}

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'center'
        }}
      >
        {seats.map(seat => (
          <Button
            key={seat.id}
            fullWidth
            sx={{
              maxWidth: '150px',
              bgcolor: seat.isBooked ? '#333' : '#d4af37',
              color: seat.isBooked ? '#999' : '#000',
              fontWeight: 600,
              borderRadius: '8px',
              textTransform: 'none',
              border: seat.isBooked ? '1px solid #777' : '1px solid #d4af37',
              '&:hover': {
                bgcolor: seat.isBooked ? '#333' : '#b58e2b'
              }
            }}
            disabled={seat.isBooked}
            onClick={() => handleBook(seat.id)}
          >
            Row {seat.row} - #{seat.number}
          </Button>
        ))}
      </Box>
    </Container>
  );
};

export default EventDetail;
