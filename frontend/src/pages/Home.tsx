import React from 'react';
import {
  Typography,
  Box,
  Button,
  Container,
  Card,
  CardContent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { keyframes } from '@emotion/react';
import EventIcon from '@mui/icons-material/Event';
import ChairIcon from '@mui/icons-material/Chair';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';

// Animated background keyframes
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Floating animation
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(1deg); }
  66% { transform: translateY(5px) rotate(-1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

// Pulse animation for icons
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <EventIcon sx={{ fontSize: 50, color: '#d4af37' }} />,
      title: 'Discover Events',
      description: 'Browse through thousands of events from concerts to sports, theater to conferences',
      stats: '10,000+ Events'
    },
    {
      icon: <ChairIcon sx={{ fontSize: 50, color: '#d4af37' }} />,
      title: 'Choose Your Seat',
      description: 'Interactive seating charts with real-time availability and pricing',
      stats: 'Live Seat Maps'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 50, color: '#d4af37' }} />,
      title: 'Secure Booking',
      description: 'Bank-level security with encrypted payments and fraud protection',
      stats: '100% Secure'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 50, color: '#d4af37' }} />,
      title: 'Instant Confirmation',
      description: 'Get your tickets immediately with QR codes and mobile entry',
      stats: 'Instant Delivery'
    }
  ];





  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 48px)',
        background: 'linear-gradient(-45deg, #000000, #1a1a1a, #2d2d2d, #1a1a1a)',
        backgroundSize: '400% 400%',
        animation: `${gradientShift} 15s ease-in-out infinite`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
          animation: `${float} 6s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '5%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
          animation: `${float} 8s ease-in-out infinite reverse`,
        }}
      />

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, position: 'relative', zIndex: 2 }}>
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 6, md: 10 },
            pt: { xs: 4, md: 6 },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 3,
              background: 'linear-gradient(135deg, #d4af37, #f4d03f, #d4af37)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
              letterSpacing: '-0.02em',
              textShadow: '0 0 30px rgba(212, 175, 55, 0.3)',
            }}
          >
            BookMySeat
          </Typography>

          <Typography
            variant="h5"
            sx={{
              color: '#ffffff',
              mb: 4,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
              fontWeight: 300,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              opacity: 0.9,
            }}
          >
            Your gateway to unforgettable experiences. Book premium seats for the best events in town with just a few clicks.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 3,
              flexWrap: 'wrap',
              mb: 6,
            }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #d4af37, #b38f1d)',
                color: '#000',
                px: 5,
                py: 2,
                fontWeight: 700,
                fontSize: '1.1rem',
                textTransform: 'none',
                borderRadius: '50px',
                boxShadow: '0 8px 25px rgba(212, 175, 55, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #b38f1d, #8f7315)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 35px rgba(212, 175, 55, 0.6)',
                },
              }}
              onClick={() => navigate('/events')}
            >
              Explore Events
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: '#d4af37',
                color: '#d4af37',
                px: 5,
                py: 2,
                fontWeight: 600,
                fontSize: '1.1rem',
                textTransform: 'none',
                borderRadius: '50px',
                borderWidth: '2px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: '#d4af37',
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 25px rgba(212, 175, 55, 0.2)',
                },
              }}
              onClick={() => navigate('/login')}
            >
              Get Started
            </Button>
          </Box>
        </Box>

        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            sx={{
              textAlign: 'center',
              color: '#ffffff',
              fontWeight: 700,
              mb: 6,
              fontSize: { xs: '1.8rem', md: '2.2rem' },
            }}
          >
            Why Choose BookMySeat?
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 4,
              justifyContent: 'center',
            }}
          >
            {features.map((feature, index) => (
              <Box
                key={index}
                sx={{
                  flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', md: '1 1 calc(25% - 24px)' },
                  minWidth: { xs: '100%', sm: '280px', md: '250px' },
                }}
              >
                <Card
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: 4,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(212, 175, 55, 0.2)',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Box
                      sx={{
                        mb: 3,
                        animation: `${pulse} 2s ease-in-out infinite`,
                        animationDelay: `${index * 0.2}s`,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#ffffff',
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        lineHeight: 1.6,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
            px: 4,
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05))',
            borderRadius: 4,
            border: '1px solid rgba(212, 175, 55, 0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: '#ffffff',
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '1.5rem', md: '2rem' },
            }}
          >
            Ready to Book Your Next Experience?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              mb: 4,
              maxWidth: '500px',
              mx: 'auto',
            }}
          >
            Join thousands of satisfied customers who trust BookMySeat for their event booking needs.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #d4af37, #b38f1d)',
              color: '#000',
              px: 6,
              py: 2.5,
              fontWeight: 700,
              fontSize: '1.2rem',
              textTransform: 'none',
              borderRadius: '50px',
              boxShadow: '0 8px 25px rgba(212, 175, 55, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #b38f1d, #8f7315)',
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 35px rgba(212, 175, 55, 0.6)',
              },
            }}
            onClick={() => navigate('/signup')}
          >
            Sign Up Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
