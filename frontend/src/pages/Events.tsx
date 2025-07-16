import React, { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
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
    axios.get('http://localhost:5000/api/events')
      .then(res => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4 }}>Events</Typography>
      {loading ? <CircularProgress /> : (
        <List>
          {events.map(ev => (
            <ListItem key={ev.id} component={Link} to={`/events/${ev.id}`}>
              <ListItemText
                primary={ev.name}
                secondary={`${ev.date} | ${ev.location}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default Events; 