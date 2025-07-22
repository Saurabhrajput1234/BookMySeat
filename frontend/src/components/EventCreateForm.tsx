import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Snackbar } from '@mui/material';
import { createEvent } from '../services/api';

interface EventCreateFormProps {
  onEventCreated?: () => void;
}

const EventCreateForm: React.FC<EventCreateFormProps> = ({ onEventCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert date string to ISO format for backend compatibility
      const isoDate = date ? new Date(date).toISOString() : '';
      await createEvent({ name, description, date: isoDate, location });
      setSnackbarMsg('Event created successfully!');
      setSnackbarOpen(true);
      setName('');
      setDescription('');
      setDate('');
      setLocation('');
      if (onEventCreated) onEventCreated();
    } catch (error: any) {
      let msg = 'Failed to create event.';
      if (error.response && error.response.data) {
        msg += ' ' + (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data));
      }
      setSnackbarMsg(msg);
      setSnackbarOpen(true);
    }
    setLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, mb: 4, maxWidth: 400 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Create New Event</Typography>
      <TextField
        label="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        fullWidth
        multiline
        rows={3}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Date"
        type="datetime-local"
        value={date}
        onChange={e => setDate(e.target.value)}
        fullWidth
        required
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Location"
        value={location}
        onChange={e => setLocation(e.target.value)}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
        {loading ? 'Creating...' : 'Create Event'}
      </Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default EventCreateForm;