import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { getAllEvents, createEvent, deleteEvent } from '../services/api';
import { getSeatsForEvent, addSeatToEvent, deleteSeat } from '../services/api';
import { getBookingsForEvent, deleteBooking } from '../services/api';

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

interface Booking {
  id: number;
  user: { id: number; name: string; email: string };
  seat: { id: number; row: string; number: number };
  bookingTime: string;
  paymentStatus: string;
}

const Admin: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ name: '', description: '', date: '', location: '' });
  const [expandedEventId, setExpandedEventId] = useState<number | null>(null);
  const [seats, setSeats] = useState<Record<number, Seat[]>>({});
  const [seatLoading, setSeatLoading] = useState<Record<number, boolean>>({});
  const [seatError, setSeatError] = useState<Record<number, string>>({});
  const [seatForm, setSeatForm] = useState<Record<number, { row: string; number: string }>>({});
  const [bookings, setBookings] = useState<Record<number, Booking[]>>({});
  const [bookingLoading, setBookingLoading] = useState<Record<number, boolean>>({});
  const [bookingError, setBookingError] = useState<Record<number, string>>({});

  const fetchEvents = () => {
    setLoading(true);
    getAllEvents()
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load events.');
        setLoading(false);
      });
  };

  const handleExpand = (eventId: number) => {
    if (expandedEventId === eventId) {
      setExpandedEventId(null);
      return;
    }
    setExpandedEventId(eventId);
    if (!seats[eventId]) {
      fetchSeats(eventId);
    }
    if (!bookings[eventId]) {
      fetchBookings(eventId);
    }
  };

  const fetchSeats = async (eventId: number) => {
    setSeatLoading(prev => ({ ...prev, [eventId]: true }));
    setSeatError(prev => ({ ...prev, [eventId]: '' }));
    try {
      const data = await getSeatsForEvent(eventId);
      setSeats(prev => ({ ...prev, [eventId]: data }));
    } catch {
      setSeatError(prev => ({ ...prev, [eventId]: 'Failed to load seats.' }));
    } finally {
      setSeatLoading(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const fetchBookings = async (eventId: number) => {
    setBookingLoading(prev => ({ ...prev, [eventId]: true }));
    setBookingError(prev => ({ ...prev, [eventId]: '' }));
    try {
      const data = await getBookingsForEvent(eventId);
      setBookings(prev => ({ ...prev, [eventId]: data }));
    } catch {
      setBookingError(prev => ({ ...prev, [eventId]: 'Failed to load bookings.' }));
    } finally {
      setBookingLoading(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await createEvent(form);
      setSuccess('Event created!');
      setForm({ name: '', description: '', date: '', location: '' });
      fetchEvents();
    } catch {
      setError('Failed to create event.');
    }
  };

  const handleDelete = async (id: number) => {
    setError('');
    setSuccess('');
    try {
      await deleteEvent(id);
      setSuccess('Event deleted!');
      fetchEvents();
    } catch {
      setError('Failed to delete event.');
    }
  };

  const handleSeatInputChange = (eventId: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSeatForm(prev => ({
      ...prev,
      [eventId]: { ...prev[eventId], [e.target.name]: e.target.value }
    }));
  };

  const handleAddSeat = async (eventId: number, e: React.FormEvent) => {
    e.preventDefault();
    setSeatError(prev => ({ ...prev, [eventId]: '' }));
    try {
      const form = seatForm[eventId];
      if (!form?.row || !form?.number) return;
      await addSeatToEvent(eventId, { row: form.row, number: Number(form.number) });
      fetchSeats(eventId);
      setSeatForm(prev => ({ ...prev, [eventId]: { row: '', number: '' } }));
    } catch {
      setSeatError(prev => ({ ...prev, [eventId]: 'Failed to add seat.' }));
    }
  };

  const handleDeleteSeat = async (eventId: number, seatId: number) => {
    setSeatError(prev => ({ ...prev, [eventId]: '' }));
    try {
      await deleteSeat(seatId);
      fetchSeats(eventId);
    } catch {
      setSeatError(prev => ({ ...prev, [eventId]: 'Failed to delete seat.' }));
    }
  };

  const handleCancelBooking = async (eventId: number, bookingId: number) => {
    setBookingError(prev => ({ ...prev, [eventId]: '' }));
    try {
      await deleteBooking(bookingId);
      fetchBookings(eventId);
    } catch {
      setBookingError(prev => ({ ...prev, [eventId]: 'Failed to cancel booking.' }));
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4 }}>Admin Dashboard</Typography>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Create Event</Typography>
        <Box component="form" onSubmit={handleCreate} sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TextField label="Name" name="name" value={form.name} onChange={handleInputChange} required sx={{ flex: '1 1 200px' }} />
          <TextField label="Location" name="location" value={form.location} onChange={handleInputChange} required sx={{ flex: '1 1 200px' }} />
          <TextField label="Date" name="date" type="date" value={form.date} onChange={handleInputChange} required InputLabelProps={{ shrink: true }} sx={{ flex: '1 1 200px' }} />
          <TextField label="Description" name="description" value={form.description} onChange={handleInputChange} required sx={{ flex: '2 1 300px' }} />
          <Button type="submit" variant="contained" color="primary" sx={{ minWidth: 150 }}>Create Event</Button>
        </Box>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">All Events</Typography>
        <List>
          {events.map(ev => (
            <React.Fragment key={ev.id}>
              <ListItem
                secondaryAction={
                  <>
                    <Button color="error" onClick={() => handleDelete(ev.id)}>Delete</Button>
                    <IconButton onClick={() => handleExpand(ev.id)} sx={{ ml: 1 }}>
                      {expandedEventId === ev.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </>
                }
              >
                <ListItemText
                  primary={ev.name}
                  secondary={`Date: ${ev.date} | Location: ${ev.location} | ${ev.description}`}
                />
              </ListItem>
              <Collapse in={expandedEventId === ev.id} timeout="auto" unmountOnExit>
                <Box sx={{ pl: 4, pr: 2, pb: 2 }}>
                  <Typography variant="subtitle1">Seats</Typography>
                  {seatError[ev.id] && <Alert severity="error">{seatError[ev.id]}</Alert>}
                  {seatLoading[ev.id] ? (
                    <Typography>Loading...</Typography>
                  ) : (
                    <List dense>
                      {seats[ev.id]?.map(seat => (
                        <ListItem key={seat.id} secondaryAction={
                          <Button color="error" size="small" onClick={() => handleDeleteSeat(ev.id, seat.id)} disabled={seat.isBooked}>
                            Delete
                          </Button>
                        }>
                          <ListItemText
                            primary={`Row ${seat.row} - #${seat.number}`}
                            secondary={seat.isBooked ? 'Booked' : 'Available'}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                  <Box component="form" onSubmit={e => handleAddSeat(ev.id, e)} sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <TextField
                      label="Row"
                      name="row"
                      size="small"
                      value={seatForm[ev.id]?.row || ''}
                      onChange={e => handleSeatInputChange(ev.id, e)}
                      required
                    />
                    <TextField
                      label="Number"
                      name="number"
                      size="small"
                      type="number"
                      value={seatForm[ev.id]?.number || ''}
                      onChange={e => handleSeatInputChange(ev.id, e)}
                      required
                    />
                    <Button type="submit" variant="contained" size="small">Add Seat</Button>
                  </Box>
                  {/* Bookings Section */}
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle1">Bookings</Typography>
                    {bookingError[ev.id] && <Alert severity="error">{bookingError[ev.id]}</Alert>}
                    {bookingLoading[ev.id] ? (
                      <Typography>Loading...</Typography>
                    ) : (
                      <List dense>
                        {bookings[ev.id]?.length ? bookings[ev.id].map(booking => (
                          <ListItem key={booking.id} secondaryAction={
                            <Button color="error" size="small" onClick={() => handleCancelBooking(ev.id, booking.id)}>
                              Cancel
                            </Button>
                          }>
                            <ListItemText
                              primary={`User: ${booking.user.name} (${booking.user.email})`}
                              secondary={`Seat: Row ${booking.seat.row} - #${booking.seat.number} | Time: ${new Date(booking.bookingTime).toLocaleString()} | Payment: ${booking.paymentStatus}`}
                            />
                          </ListItem>
                        )) : <Typography>No bookings yet.</Typography>}
                      </List>
                    )}
                  </Box>
                </Box>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Admin; 