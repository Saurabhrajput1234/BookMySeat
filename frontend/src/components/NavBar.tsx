import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
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
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ display: 'flex', gap: 2 }}>
          <Button
            sx={{
              color: '#d4af37',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { color: '#b58e2b' }, 
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
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { color: '#b58e2b' },
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
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': { color: '#b58e2b' },
                }}
                component={Link}
                to="/admin"
              >
                Admin
              </Button>
              <Button
                sx={{
                  color: '#d4af37',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': { color: '#b58e2b' },
                }}
                component={Link}
                to="/admin/users"
              >
                Users
              </Button>
              <Button
                sx={{
                  color: '#d4af37',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': { color: '#b58e2b' },
                }}
                component={Link}
                to="/events/create"
              >
                Create Event
              </Button>
            </>
          )}
        </Typography>

        <div>
          {token ? (
            <Button
              sx={{
                color: '#d4af37',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { color: '#b58e2b' },
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
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': { color: '#b58e2b' },
                }}
                component={Link}
                to="/login"
              >
                Login
              </Button>
              <Button
                sx={{
                  color: '#d4af37',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': { color: '#b58e2b' },
                }}
                component={Link}
                to="/signup"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
