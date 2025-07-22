import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Snackbar, Paper } from '@mui/material';
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
    <Paper
      elevation={3}
      sx={{
        mt: 4,
        p: 3,
        maxWidth: 450,
        borderRadius: 3,
        bgcolor: '#1c1c1c',
        color: '#fff'
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          fontWeight: 'bold',
          color: '#d4af37',
          textAlign: 'center'
        }}
      >
        Create New Event
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Event Name"
          value={name}
          onChange={e => setName(e.target.value)}
          fullWidth
          required
          sx={{
            mb: 2,
            input: { color: '#fff' },
            label: { color: '#d4af37' },
            '& .MuiOutlinedInput-root fieldset': { borderColor: '#d4af37' }
          }}
        />
        <TextField
          label="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
          sx={{
            mb: 2,
            input: { color: '#fff' },
            label: { color: '#d4af37' },
            '& .MuiOutlinedInput-root fieldset': { borderColor: '#d4af37' }
          }}
        />
        <TextField
          label="Date"
          type="datetime-local"
          value={date}
          onChange={e => setDate(e.target.value)}
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          sx={{
            mb: 2,
            input: { color: '#fff' },
            label: { color: '#d4af37' },
            '& .MuiOutlinedInput-root fieldset': { borderColor: '#d4af37' }
          }}
        />
        <TextField
          label="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          fullWidth
          required
          sx={{
            mb: 2,
            input: { color: '#fff' },
            label: { color: '#d4af37' },
            '& .MuiOutlinedInput-root fieldset': { borderColor: '#d4af37' }
          }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            bgcolor: '#d4af37',
            color: '#000',
            fontWeight: 'bold',
            mt: 2,
            '&:hover': { bgcolor: '#b38f1d' }
          }}
        >
          {loading ? 'Creating...' : 'Create Event'}
        </Button>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Paper>
  );
};

export default EventCreateForm;
