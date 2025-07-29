import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Snackbar, Paper } from '@mui/material';

interface EventFormProps {
  initialValues?: {
    name?: string;
    description?: string;
    date?: string;
    location?: string;
    price?: number;
  };
  loading?: boolean;
  onSubmit: (values: {
    name: string;
    description: string;
    date: string;
    location: string;
    price: number;
  }) => Promise<void>;
  onSuccess?: () => void;
  submitLabel?: string;
  title?: string;
}

const EventForm: React.FC<EventFormProps> = ({
  initialValues = {},
  loading = false,
  onSubmit,
  onSuccess,
  submitLabel = 'Save',
  title = 'Event',
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setName(initialValues.name || '');
    setDescription(initialValues.description || '');
    setDate(initialValues.date || '');
    setLocation(initialValues.location || '');
    setPrice(initialValues.price !== undefined ? initialValues.price.toString() : '');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        name,
        description,
        date,
        location,
        price: parseFloat(price) || 0,
      });
      setSnackbarMsg('Event saved successfully!');
      setSnackbarOpen(true);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      let msg = 'Failed to save event.';
      if (error.response && error.response.data) {
        msg +=
          ' ' +
          (typeof error.response.data === 'string'
            ? error.response.data
            : JSON.stringify(error.response.data));
      }
      setSnackbarMsg(msg);
      setSnackbarOpen(true);
    }
    setSubmitting(false);
  };

  const inputStyles = {
    mb: 2,
    input: {
      backgroundColor: '#fff',
      color: '#000',
    },
    textarea: {
      backgroundColor: '#fff',
      color: '#000',
    },
    label: { color: '#d4af37' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: '#d4af37' },
      '&:hover fieldset': { borderColor: '#d4af37' },
      '&.Mui-focused fieldset': { borderColor: '#d4af37' },
    },
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          maxWidth: 450,
          width: '100%',
          borderRadius: 3,
          bgcolor: '#1c1c1c',
          color: '#fff',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontWeight: 'bold',
            color: '#d4af37',
            textAlign: 'center',
          }}
        >
          {title}
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Event Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            sx={inputStyles}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            sx={inputStyles}
          />
          <TextField
            label="Date"
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            sx={inputStyles}
          />
          <TextField
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
            required
            sx={inputStyles}
          />
          <TextField
            label="Ticket Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            required
            sx={inputStyles}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading || submitting}
            sx={{
              bgcolor: '#d4af37',
              color: '#000',
              fontWeight: 'bold',
              mt: 2,
              '&:hover': { bgcolor: '#b38f1d' },
            }}
          >
            {submitting || loading ? 'Saving...' : submitLabel}
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
    </Box>
  );
};

export default EventForm;
