import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { login as apiLogin } from '../services/api';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await apiLogin(email, password);
      if (!res.token || typeof res.token !== 'string' || !res.token.includes('.')) {
        setError('Received invalid token from backend.');
        return;
      }
      login(res.token);
      navigate(res.role === 'Admin' ? '/admin' : '/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography
          component="h1"
          variant="h5"
          sx={{ color: '#d4af37', fontWeight: 'bold' }}
        >
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus
            InputLabelProps={{ style: { color: '#d4af37' } }}
            InputProps={{ style: { color: '#000' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#d4af37' },
                '&:hover fieldset': { borderColor: '#b38f1d' },
                '&.Mui-focused fieldset': { borderColor: '#d4af37' }
              }
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            InputLabelProps={{ style: { color: '#d4af37' } }}
            InputProps={{ style: { color: '#000' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#d4af37' },
                '&:hover fieldset': { borderColor: '#b38f1d' },
                '&.Mui-focused fieldset': { borderColor: '#d4af37' }
              }
            }}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: '#d4af37',
              color: '#000',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#b38f1d' }
            }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
