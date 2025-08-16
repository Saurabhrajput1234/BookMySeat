import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NavBar: React.FC = () => {
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: '#000', 
        color: '#d4af37', 
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
        borderBottom: '1px solid #d4af37',
        minHeight: '48px',
        height: '48px',
      }}
    >
      <Toolbar 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          minHeight: '48px !important',
          height: '48px',
          padding: '0 16px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography 
            variant="h6" 
            component={Link}
            to="/"
            sx={{ 
              color: '#d4af37',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1.1rem',
              mr: 2,
              '&:hover': { color: '#e6c757' }
            }}
          >
            BookMySeat
          </Typography>
          <Button
            sx={{
              color: '#d4af37',
              fontWeight: 500,
              textTransform: 'none',
              fontSize: '0.9rem',
              minWidth: 'auto',
              padding: '4px 12px',
              '&:hover': { 
                color: '#b58e2b',
                backgroundColor: 'rgba(212, 175, 55, 0.1)'
              }, 
            }}
            component={Link}
            to="/events"
          >
            Events
          </Button>

          {token && user?.role === 'User' && (
            <Button
              sx={{
                color: '#d4af37',
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '0.9rem',
                minWidth: 'auto',
                padding: '4px 12px',
                '&:hover': { 
                  color: '#b58e2b',
                  backgroundColor: 'rgba(212, 175, 55, 0.1)'
                },
              }}
              component={Link}
              to="/dashboard"
            >
              Dashboard
            </Button>
          )}

          {user?.role === 'Admin' && (
            <>
              <Button
                sx={{
                  color: '#d4af37',
                  fontWeight: 500,
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  minWidth: 'auto',
                  padding: '4px 12px',
                  '&:hover': { 
                    color: '#b58e2b',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)'
                  },
                }}
                component={Link}
                to="/admin"
              >
                Admin
              </Button>
              <Button
                sx={{
                  color: '#d4af37',
                  fontWeight: 500,
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  minWidth: 'auto',
                  padding: '4px 12px',
                  '&:hover': { 
                    color: '#b58e2b',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)'
                  },
                }}
                component={Link}
                to="/admin/users"
              >
                Users
              </Button>
              <Button
                sx={{
                  color: '#d4af37',
                  fontWeight: 500,
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  minWidth: 'auto',
                  padding: '4px 12px',
                  '&:hover': { 
                    color: '#b58e2b',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)'
                  },
                }}
                component={Link}
                to="/events/create"
              >
                Create Event
              </Button>
            </>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {token ? (
            <Button
              sx={{
                color: '#d4af37',
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '0.9rem',
                minWidth: 'auto',
                padding: '4px 12px',
                '&:hover': { 
                  color: '#b58e2b',
                  backgroundColor: 'rgba(212, 175, 55, 0.1)'
                },
              }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                sx={{
                  color: '#d4af37',
                  fontWeight: 500,
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  minWidth: 'auto',
                  padding: '4px 12px',
                  '&:hover': { 
                    color: '#b58e2b',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)'
                  },
                }}
                component={Link}
                to="/login"
              >
                Login
              </Button>
              <Button
                sx={{
                  color: '#d4af37',
                  fontWeight: 500,
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  minWidth: 'auto',
                  padding: '4px 12px',
                  '&:hover': { 
                    color: '#b58e2b',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)'
                  },
                }}
                component={Link}
                to="/signup"
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
