import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  TextField
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EventCreateForm from '../components/EventCreateForm';

import {
  getAllEvents,
  deleteEvent,
  getSeatsForEvent,
  deleteSeat,
  getBookingsForEvent,
  deleteBooking,
  addSeat
} from '../services/api';

interface Event {
  id: number;
  name: string;
  date: string;
}

interface Seat {
  id: number;
  row: string;
  number: number;
}

interface Booking {
  id: number;
  userName: string;
  seatId: number;
}

const Admin: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  const [seats, setSeats] = useState<Record<number, Seat[]>>({});
  const [bookings, setBookings] = useState<Record<number, Booking[]>>({});
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [onConfirm, setOnConfirm] = useState<() => void>(() => {});

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const [newSeatRow, setNewSeatRow] = useState<Record<number, string>>({});
  const [newSeatNumber, setNewSeatNumber] = useState<Record<number, string>>({});
  const [addingSeat, setAddingSeat] = useState<Record<number, boolean>>({});

  // ✅ Fetch all events
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch (error: any) {
      setSnackbarMsg('Failed to load events');
      setSnackbarOpen(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ✅ Expand/Collapse Event
  const toggleExpand = async (eventId: number) => {
    if (expandedEvent === eventId) {
      setExpandedEvent(null);
      return;
    }
    setExpandedEvent(eventId);
    await fetchEventDetails(eventId);
  };

  const fetchEventDetails = async (eventId: number) => {
    try {
      const seatData = await getSeatsForEvent(eventId);
      const bookingData = await getBookingsForEvent(eventId);
      setSeats(prev => ({ ...prev, [eventId]: seatData }));
      setBookings(prev => ({ ...prev, [eventId]: bookingData }));
    } catch {
      setSnackbarMsg('Failed to load event details');
      setSnackbarOpen(true);
    }
  };

  // ✅ Delete Confirm Dialog
  const handleDelete = (msg: string, confirmAction: () => void) => {
    setDialogMessage(msg);
    setOnConfirm(() => confirmAction);
    setDialogOpen(true);
  };

  const confirmAction = () => {
    onConfirm();
    setDialogOpen(false);
  };

  // ✅ Add Seat with better error handling
  const handleAddSeat = async (eventId: number) => {
    const row = newSeatRow[eventId];
    const number = Number(newSeatNumber[eventId]);

    if (!row || !number || number <= 0) {
      setSnackbarMsg('Please enter valid row and seat number');
      setSnackbarOpen(true);
      return;
    }

    setAddingSeat(prev => ({ ...prev, [eventId]: true }));
    try {
      await addSeat(eventId, { row, number });
      setNewSeatRow(prev => ({ ...prev, [eventId]: '' }));
      setNewSeatNumber(prev => ({ ...prev, [eventId]: '' }));
      await fetchEventDetails(eventId); // ✅ Refresh without collapsing
      setSnackbarMsg('Seat added successfully');
    } catch (error: any) {
      setSnackbarMsg(error.response?.data || 'Failed to add seat');
    }
    setSnackbarOpen(true);
    setAddingSeat(prev => ({ ...prev, [eventId]: false }));
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4 }}>Admin Panel</Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List sx={{ mt: 4 }}>
          {events.map(event => (
            <React.Fragment key={event.id}>
              <ListItem
                secondaryAction={
                  <>
                    <IconButton onClick={() => toggleExpand(event.id)}>
                      {expandedEvent === event.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() =>
                        handleDelete('Delete this event?', async () => {
                          await deleteEvent(event.id);
                          fetchEvents();
                        })
                      }
                    >
                      Delete
                    </Button>
                  </>
                }
              >
                <ListItemText primary={event.name} secondary={event.date} />
              </ListItem>

              {expandedEvent === event.id && (
                <Box sx={{ pl: 4, pb: 2 }}>
                  <Typography variant="h6">Seats</Typography>

                  {/* Add Seat Form */}
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                    <TextField
                      label="Row"
                      value={newSeatRow[event.id] || ''}
                      onChange={e => setNewSeatRow(prev => ({ ...prev, [event.id]: e.target.value }))}
                      size="small"
                    />
                    <TextField
                      label="Number"
                      type="number"
                      value={newSeatNumber[event.id] || ''}
                      onChange={e => setNewSeatNumber(prev => ({ ...prev, [event.id]: e.target.value }))}
                      size="small"
                    />
                    <Button
                      variant="contained"
                      onClick={() => handleAddSeat(event.id)}
                      disabled={addingSeat[event.id]}
                    >
                      {addingSeat[event.id] ? 'Adding...' : 'Add Seat'}
                    </Button>
                  </Box>

                  {/* Seat List */}
                  {seats[event.id]?.map(seat => (
                    <Box key={seat.id} sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography>
                        Row {seat.row} - #{seat.number}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() =>
                          handleDelete('Delete this seat?', async () => {
                            await deleteSeat(seat.id);
                            fetchEventDetails(event.id);
                          })
                        }
                      >
                        Delete
                      </Button>
                    </Box>
                  ))}

                  {/* Bookings */}
                  <Typography variant="h6" sx={{ mt: 2 }}>Bookings</Typography>
                  {bookings[event.id]?.map(booking => (
                    <Box key={booking.id} sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography>
                        {booking.userName} (Seat #{booking.seatId})
                      </Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() =>
                          handleDelete('Delete this booking?', async () => {
                            await deleteBooking(booking.id);
                            fetchEventDetails(event.id);
                          })
                        }
                      >
                        Delete
                      </Button>
                    </Box>
                  ))}
                </Box>
              )}
            </React.Fragment>
          ))}
        </List>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmAction} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      {/* Event Create Form */}
      <EventCreateForm onEventCreated={fetchEvents} />
    </Container>
  );
};

export default Admin;
