import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box, Alert, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signup as apiSignup } from '../services/api';
import { sendVerificationCode, verifyCode } from '../services/api';

const roles = ['User', 'Admin'];

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [codeSuccess, setCodeSuccess] = useState('');

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

  const handleSendCode = async () => {
    setError(''); setCodeError(''); setCodeSuccess('');
    if (!email) {
      setCodeError('Please enter an email address');
      return;
    }
    
    console.log(`Attempting to send verification code to: ${email}`);
    
    try {
      const response = await sendVerificationCode(email);
      console.log('Send code response:', response);
      setCodeSent(true);
      setCodeSuccess('Verification code sent to your email. Please check your inbox and spam folder.');
    } catch (err: any) {
      console.error('Send code error:', err);
      let errorMessage = 'Failed to send code. Please try again.';
      
      if (err.response) {
        console.error('Error response:', err.response);
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.status === 500) {
          errorMessage = 'Server error. Please try again later or contact support.';
        }
      }
      
      setCodeError(errorMessage);
    }
  };

  const handleVerifyCode = async () => {
    setCodeError(''); setCodeSuccess('');
    if (!email) {
      setCodeError('Please enter an email address');
      return;
    }
    if (!verificationCode) {
      setCodeError('Please enter the verification code');
      return;
    }
    
    console.log(`Attempting to verify code for email: ${email}, code: ${verificationCode}`);
    
    try {
      const response = await verifyCode(email, verificationCode);
      console.log('Verify code response:', response);
      setIsVerified(true);
      setCodeSuccess('Email verified! You can now sign up.');
    } catch (err: any) {
      console.error('Verify code error:', err);
      let errorMessage = 'Invalid or expired code. Please try again.';
      
      if (err.response) {
        console.error('Error response:', err.response);
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.status === 400) {
          errorMessage = 'Invalid or expired verification code. Please request a new code.';
        } else if (err.response.status === 500) {
          errorMessage = 'Server error. Please try again later or contact support.';
        }
      }
      
      setCodeError(errorMessage);
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
            onChange={e => { setEmail(e.target.value); setIsVerified(false); setCodeSent(false); setVerificationCode(''); setCodeError(''); setCodeSuccess(''); }}
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
          
          {/* Email Verification Section */}
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                fullWidth
                label="Verification Code"
                value={verificationCode}
                onChange={e => setVerificationCode(e.target.value)}
                disabled={!codeSent}
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
              <Button
                variant="contained"
                onClick={handleVerifyCode}
                disabled={!codeSent || !verificationCode}
                sx={{
                  bgcolor: '#d4af37',
                  color: '#000',
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: '#b38f1d' }
                }}
              >
                Verify
              </Button>
            </Box>
            <Button
              variant="outlined"
              onClick={handleSendCode}
              disabled={!email || codeSent && !isVerified}
              sx={{
                borderColor: '#d4af37',
                color: '#d4af37',
                '&:hover': { borderColor: '#b38f1d', bgcolor: 'rgba(212, 175, 55, 0.1)' }
              }}
            >
              {codeSent ? 'Resend Code' : 'Send Verification Code'}
            </Button>
            {codeError && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {codeError}
              </Alert>
            )}
            {codeSuccess && (
              <Alert severity="success" sx={{ mt: 1 }}>
                {codeSuccess}
              </Alert>
            )}
          </Box>
          
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
            disabled={!isVerified}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
