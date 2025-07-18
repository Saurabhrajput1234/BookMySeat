import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Snackbar from '@mui/material/Snackbar';

import {
  getAllEvents,
  deleteEvent,
  getSeatsForEvent,
  deleteSeat,
  getBookingsForEvent,
  deleteBooking
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
    if (!seats[eventId]) {
      try {
        const seatData = await getSeatsForEvent(eventId);
        const bookingData = await getBookingsForEvent(eventId);
        setSeats(prev => ({ ...prev, [eventId]: seatData }));
        setBookings(prev => ({ ...prev, [eventId]: bookingData }));
      } catch {
        setSnackbarMsg('Failed to load event details');
        setSnackbarOpen(true);
      }
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
                            toggleExpand(event.id);
                          })
                        }
                      >
                        Delete
                      </Button>
                    </Box>
                  ))}

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
                            toggleExpand(event.id);
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
