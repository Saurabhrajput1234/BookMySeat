import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box, Alert, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signup as apiSignup } from '../services/api';

const roles = ['User', 'Admin'];

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await apiSignup(name, email, password, role);
      login(res.token);
      if (user?.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
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
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
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
            label="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
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
            autoComplete="new-password"
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
            select
            fullWidth
            label="Role"
            value={role}
            onChange={e => setRole(e.target.value)}
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#d4af37' },
                '&:hover fieldset': { borderColor: '#b38f1d' },
                '&.Mui-focused fieldset': { borderColor: '#d4af37' }
              }
            }}
            InputLabelProps={{ style: { color: '#d4af37' } }}
            InputProps={{ style: { color: '#000' } }}
          >
            {roles.map(r => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </TextField>
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
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
