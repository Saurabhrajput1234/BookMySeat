import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Button, CircularProgress, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5224/api/events')
      .then(res => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Container maxWidth={false} sx={{ py: 6, bgcolor: '#fff', minHeight: '100vh' }}>
      <Typography
        variant="h3"
        sx={{
          mb: 4,
          fontWeight: 700,
          textAlign: 'center',
          color: '#d4af37', 
        }}
      >
        Upcoming Events
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: 'block', mx: 'auto', color: '#d4af37' }} />
      ) : events.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', color: '#888' }}>
          No events available.
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 4,
            px: 2,
          }}
        >
          {events.map((ev) => (
            <Card
              key={ev.id}
              sx={{
                width: '300px',
                bgcolor: '#000', 
                color: '#fff',
                border: '1px solid #d4af37', 
                borderRadius: 2,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
                },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <CardContent>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 700, color: '#d4af37' }}>
                  {ev.name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: '#ccc' }}>
                  {ev.description}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Date:</strong> {new Date(ev.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Location:</strong> {ev.location}
                </Typography>
              </CardContent>
              <Button
                component={Link}
                to={`/events/${ev.id}`}
                sx={{
                  bgcolor: '#d4af37',
                  color: '#000',
                  fontWeight: 600,
                  textTransform: 'none',
                  m: 2,
                  borderRadius: '8px',
                  '&:hover': {
                    bgcolor: '#b58e2b',
                  },
                }}
              >
                View Details
              </Button>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Events;
