import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { keyframes } from '@emotion/react';

// Animated background keyframes
const backgroundMotion = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Floating rectangle keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: 'linear-gradient(-45deg,rgb(239, 207, 78),rgb(255, 250, 232),rgb(254, 252, 219), #fef9c3)',
        backgroundSize: '400% 400%',
        animation: `${backgroundMotion} 12s ease-in-out infinite`,
      }}
    >
      <Box
        sx={{
          width: { xs: '95%', sm: '80%', md: '60%', lg: '40%' },
          bgcolor: '#fff',
          borderRadius: 4,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
          p: { xs: 4, md: 8 },
          textAlign: 'center',
          border: '1px solid #e9ecef',
          position: 'relative',
          zIndex: 2,
          animation: `${float} 3s ease-in-out infinite`,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: '#000',
            letterSpacing: 1,
          }}
        >
          Welcome to <span style={{ color: '#d4af37' }}>BookMySeat</span>
        </Typography>
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
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#1e40af',
              color: '#fff',
              px: 4,
              py: 1.5,
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(30,64,175,0.15)',
              '&:hover': { bgcolor: '#1e3a8a' },
            }}
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            sx={{
              borderColor: '#a21caf',
              color: '#a21caf',
              px: 4,
              py: 1.5,
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              borderRadius: '8px',
              '&:hover': { borderColor: '#86198f', color: '#86198f' },
            }}
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
