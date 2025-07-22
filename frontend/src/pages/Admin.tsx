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
  TextField,
  Divider,
  Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
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

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch {
      setSnackbarMsg('Failed to load events');
      setSnackbarOpen(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

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

  const handleDelete = (msg: string, confirmAction: () => void) => {
    setDialogMessage(msg);
    setOnConfirm(() => confirmAction);
    setDialogOpen(true);
  };

  const confirmAction = () => {
    onConfirm();
    setDialogOpen(false);
  };

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
      await fetchEventDetails(eventId);
      setSnackbarMsg('Seat added successfully');
    } catch {
      setSnackbarMsg('Failed to add seat');
    }
    setSnackbarOpen(true);
    setAddingSeat(prev => ({ ...prev, [eventId]: false }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ color: '#d4af37', fontWeight: 'bold', mb: 3 }}>
        Admin Panel
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress sx={{ color: '#d4af37' }} />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ p: 3, bgcolor: '#1c1c1c', borderRadius: 3 }}>
          <List>
            {events.map(event => (
              <React.Fragment key={event.id}>
                <ListItem
                  sx={{
                    bgcolor: '#2a2a2a',
                    mb: 2,
                    borderRadius: 2,
                    color: '#fff',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <ListItemText
                    primary={event.name}
                    secondary={event.date}
                    primaryTypographyProps={{ fontWeight: 600, color: '#d4af37' }}
                    secondaryTypographyProps={{ color: '#bbb' }}
                  />
                  <Box>
                    <IconButton onClick={() => toggleExpand(event.id)} sx={{ color: '#d4af37' }}>
                      {expandedEvent === event.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                    <Button
                      variant="contained"
                      sx={{
                        ml: 2,
                        bgcolor: '#b22222',
                        '&:hover': { bgcolor: '#8b0000' }
                      }}
                      onClick={() =>
                        handleDelete('Delete this event?', async () => {
                          await deleteEvent(event.id);
                          fetchEvents();
                        })
                      }
                    >
                      Delete
                    </Button>
                  </Box>
                </ListItem>

                {expandedEvent === event.id && (
                  <Box sx={{ pl: 2, py: 2, bgcolor: '#2f2f2f', borderRadius: 2, mb: 2 }}>
                    <Typography variant="h6" sx={{ color: '#d4af37', mb: 2 }}>
                      Seats
                    </Typography>

                    {/* Add Seat */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <TextField
                        label="Row"
                        value={newSeatRow[event.id] || ''}
                        onChange={e => setNewSeatRow(prev => ({ ...prev, [event.id]: e.target.value }))}
                        size="small"
                        sx={{
                          input: { color: '#fff' },
                          label: { color: '#d4af37' },
                          '& .MuiOutlinedInput-root fieldset': { borderColor: '#d4af37' }
                        }}
                      />
                      <TextField
                        label="Number"
                        type="number"
                        value={newSeatNumber[event.id] || ''}
                        onChange={e => setNewSeatNumber(prev => ({ ...prev, [event.id]: e.target.value }))}
                        size="small"
                        sx={{
                          input: { color: '#fff' },
                          label: { color: '#d4af37' },
                          '& .MuiOutlinedInput-root fieldset': { borderColor: '#d4af37' }
                        }}
                      />
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: '#d4af37',
                          color: '#000',
                          fontWeight: 'bold',
                          '&:hover': { bgcolor: '#b38f1d' }
                        }}
                        onClick={() => handleAddSeat(event.id)}
                        disabled={addingSeat[event.id]}
                      >
                        {addingSeat[event.id] ? 'Adding...' : 'Add Seat'}
                      </Button>
                    </Box>

                    {seats[event.id]?.map(seat => (
                      <Box
                        key={seat.id}
                        sx={{ display: 'flex', justifyContent: 'space-between', color: '#fff', mb: 1 }}
                      >
                        <Typography>
                          Row {seat.row} - #{seat.number}
                        </Typography>
                        <Button
                          variant="outlined"
                          sx={{
                            borderColor: '#b22222',
                            color: '#b22222',
                            '&:hover': { borderColor: '#8b0000', color: '#8b0000' }
                          }}
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

                    <Divider sx={{ my: 2, borderColor: '#444' }} />

                    <Typography variant="h6" sx={{ color: '#d4af37', mb: 1 }}>
                      Bookings
                    </Typography>
                    {bookings[event.id]?.map(booking => (
                      <Box
                        key={booking.id}
                        sx={{ display: 'flex', justifyContent: 'space-between', color: '#fff', mb: 1 }}
                      >
                        <Typography>
                          {booking.userName} (Seat #{booking.seatId})
                        </Typography>
                        <Button
                          variant="outlined"
                          sx={{
                            borderColor: '#b22222',
                            color: '#b22222',
                            '&:hover': { borderColor: '#8b0000', color: '#8b0000' }
                          }}
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
        </Paper>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmAction} sx={{ color: '#d4af37' }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

    </Container>
  );
};

export default Admin;
