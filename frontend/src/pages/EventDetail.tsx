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
import { getEventById, getSeatsForEvent, bookSeat, createPaymentIntent, confirmPayment } from '../services/api';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
  price?: number; // Add price property
}

interface Seat {
  id: number;
  row: string;
  number: number;
  isBooked: boolean;
}

const stripePromise = loadStripe('pk_test_XXXXXXXXXXXXXXXXXXXXXXXX'); // Replace with your Stripe public key

const PaymentForm: React.FC<{ bookingId: number; onSuccess: () => void }> = ({ bookingId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError('');
    try {
      const { clientSecret } = await createPaymentIntent(bookingId);
      if (!stripe || !elements) throw new Error('Stripe not loaded');
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });
      if (result.error) {
        setError(result.error.message || 'Payment failed');
        setProcessing(false);
        return;
      }
      if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        await confirmPayment(bookingId, result.paymentIntent.id);
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Payment error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={{ style: { base: { fontSize: '18px', color: '#fff' } } }} />
      <Button type="submit" variant="contained" sx={{ mt: 2, bgcolor: '#d4af37', color: '#000' }} disabled={processing}>
        {processing ? 'Processing...' : 'Pay & Confirm'}
      </Button>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </form>
  );
};

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const [event, setEvent] = useState<Event | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingMsg, setBookingMsg] = useState('');
  const [showPayment, setShowPayment] = useState<number | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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
      .withUrl('https://bookmyseat-gm9o.onrender.com/seathub', {
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

  // In the event card section, display the price:


  const handleBook = async (seatId: number) => {
    setBookingMsg('');
    try {
      const { bookingId } = await bookSeat(eventId, seatId);
      setShowPayment(bookingId);
      setBookingMsg('Seat reserved! Please complete payment below.');
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
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#d4af37', textAlign: 'center' }}>
            {event.name}
          </Typography>
          <Typography variant="h6" sx={{ mb: 1, textAlign: 'center', color: '#ccc' }}>
            {new Date(event.date).toLocaleDateString()} | {event.location}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, textAlign: 'center', color: '#e4e4e4', fontSize: '1.1rem' }}>
            {event.description}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, textAlign: 'center', color: '#d4af37', fontWeight: 600 }}>
            Ticket Price: {typeof event.price === 'number' ? `$${event.price.toFixed(2)}` : 'N/A'}
          </Typography>
        </CardContent>
      </Card>

      {/* Seats Section */}
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 700, color: '#d4af37' }}>
        Available Seats
      </Typography>

      {bookingMsg && (
        <Alert severity="info" sx={{ mb: 3, textAlign: 'center', fontWeight: 600, bgcolor: '#fffbe6' }}>
          {bookingMsg}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
        {seats.map(seat => (
          <Button
            key={seat.id}
            fullWidth
            sx={{
              maxWidth: '150px',
              bgcolor: seat.isBooked ? 'red' : '#d4af37',
              color: seat.isBooked ? 'red' : 'green',
              fontWeight: 600,
              borderRadius: '8px',
              textTransform: 'none',
              border: seat.isBooked ? '1px solid #777' : '1px solid #d4af37',
              '&:hover': { bgcolor: seat.isBooked ? '#333' : '#b58e2b' }
            }}
            disabled={seat.isBooked}
            onClick={() => handleBook(seat.id)}
          >
            <Typography>
              Row {seat.row} - #{seat.number}
            </Typography>
          </Button>
        ))}
      </Box>

      {/* Payment Section */}
      {showPayment && !paymentSuccess && (
        <Box sx={{ mt: 4, mb: 2, maxWidth: 400, mx: 'auto', bgcolor: '#000', p: 3, borderRadius: 2, border: '1px solid #d4af37' }}>
          <Typography variant="h6" sx={{ color: '#d4af37', mb: 2, textAlign: 'center' }}>Complete Your Payment</Typography>
          <Elements stripe={stripePromise}>
            <PaymentForm bookingId={showPayment} onSuccess={() => {
              setPaymentSuccess(true);
              setBookingMsg('Payment successful! Confirmation email sent.');
              setShowPayment(null);
            }} />
          </Elements>
        </Box>
      )}
    </Container>
  );
};

export default EventDetail;
