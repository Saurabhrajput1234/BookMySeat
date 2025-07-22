import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth={false} 
      disableGutters 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f8f9fa',
      }}
    >
      <Box
        sx={{
          width: '100%', 
          bgcolor: '#ffffff', 
          borderRadius: 0, 
          p: { xs: 4, md: 8 },
          textAlign: 'center',
          borderBottom: '1px solid #e9ecef',
        }}
      >
        {/* Title */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: '#000000', // Black text
          }}
        >
          Welcome to <span style={{ color: '#d4af37' }}>BookMySeat</span> 
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="h6"
          sx={{
            mb: 5,
            color: '#444', 
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          Discover and book seats for your favorite events with ease. Enjoy a simple and seamless experience.
        </Typography>

        {/* Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#d4af37', 
              color: '#000', 
              px: 4,
              py: 1.5,
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              borderRadius: '8px',
              '&:hover': {
                bgcolor: '#b58e2b', 
              },
            }}
            onClick={() => navigate('/login')}
          >
            Login
          </Button>

          <Button
            variant="outlined"
            sx={{
              borderColor: '#d4af37',
              color: '#d4af37',
              px: 4,
              py: 1.5,
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              borderRadius: '8px',
              '&:hover': {
                borderColor: '#b58e2b',
                color: '#b58e2b', 
              },
            }}
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
