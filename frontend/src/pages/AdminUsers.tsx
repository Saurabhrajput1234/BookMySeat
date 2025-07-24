import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Box,
  useMediaQuery
} from '@mui/material';
import { getUsers, updateUserRole, toggleUserActive } from '../services/api';
import { useTheme } from '@mui/material/styles';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<'role' | 'active' | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch {
      setError('Failed to load users.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDialogOpen = (user: User, action: 'role' | 'active') => {
    setSelectedUser(user);
    setDialogAction(action);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedUser(null);
    setDialogAction(null);
  };

  const handleRoleChange = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    const newRole = selectedUser.role === 'Admin' ? 'User' : 'Admin';
    try {
      await updateUserRole(selectedUser.id, JSON.stringify(newRole));
      setSnackbarMsg('User role updated successfully.');
      setSnackbarSeverity('success');
      fetchUsers();
    } catch {
      setSnackbarMsg('Failed to update user role.');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
    setActionLoading(false);
    handleDialogClose();
  };

  const handleActiveToggle = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await toggleUserActive(selectedUser.id, !selectedUser.isActive);
      setSnackbarMsg(selectedUser.isActive ? 'User deactivated.' : 'User activated.');
      setSnackbarSeverity('success');
      fetchUsers();
    } catch {
      setSnackbarMsg('Failed to update user status.');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
    setActionLoading(false);
    handleDialogClose();
  };

  return (
    <Container
      sx={{  
        minHeight: '100vh',
        py: 4,
        color: '#fff',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          color: '#d4af37',
          fontWeight: 'bold',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}
      >
        User Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress sx={{ color: '#d4af37' }} />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            mt: 4,
            borderRadius: 3,
            overflowX: 'auto',
            bgcolor: '#1e1e1e',
            color: '#fff',
            boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
          }}
        >
          <Table size={isMobile ? 'small' : 'medium'}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#d4af37' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#000' }}>Name</TableCell>
                {!isMobile && <TableCell sx={{ fontWeight: 'bold', color: '#000' }}>Email</TableCell>}
                <TableCell sx={{ fontWeight: 'bold', color: '#000' }}>Role</TableCell>
                {!isMobile && <TableCell sx={{ fontWeight: 'bold', color: '#000' }}>Status</TableCell>}
                <TableCell sx={{ fontWeight: 'bold', color: '#000', textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow
                  key={user.id}
                  hover
                  sx={{
                    '&:hover': { bgcolor: '#2a2a2a' },
                    transition: '0.3s ease'
                  }}
                >
                  <TableCell sx={{ color: '#fff' }}>{user.name}</TableCell>
                  {!isMobile && <TableCell sx={{ color: '#ccc' }}>{user.email}</TableCell>}
                  <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>{user.role}</TableCell>
                  {!isMobile && (
                    <TableCell sx={{ color: user.isActive ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </TableCell>
                  )}
                  <TableCell>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: isMobile ? 'row' : 'column',
                        gap: 1,
                        justifyContent: 'center'
                      }}
                    >
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: '#d4af37',
                          color: '#d4af37',
                          width: isMobile ? 'auto' : '140px',
                          fontWeight: 'bold',
                          '&:hover': { backgroundColor: '#d4af37', color: '#121212' }
                        }}
                        size="small"
                        onClick={() => handleDialogOpen(user, 'role')}
                        disabled={actionLoading}
                      >
                        {user.role === 'Admin' ? 'Demote' : 'Promote'}
                      </Button>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: user.isActive ? '#f44336' : '#4caf50',
                          color: '#fff',
                          width: isMobile ? 'auto' : '140px',
                          fontWeight: 'bold',
                          '&:hover': { opacity: 0.9 }
                        }}
                        size="small"
                        onClick={() => handleDialogOpen(user, 'active')}
                        disabled={actionLoading}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogAction === 'role' && selectedUser && (
              <>Are you sure you want to {selectedUser.role === 'Admin' ? 'demote' : 'promote'} <b>{selectedUser.name}</b>?</>
            )}
            {dialogAction === 'active' && selectedUser && (
              <>Are you sure you want to {selectedUser.isActive ? 'deactivate' : 'activate'} <b>{selectedUser.name}</b>?</>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} disabled={actionLoading}>Cancel</Button>
          {dialogAction === 'role' && <Button onClick={handleRoleChange} color="primary" disabled={actionLoading}>Confirm</Button>}
          {dialogAction === 'active' && <Button onClick={handleActiveToggle} color="primary" disabled={actionLoading}>Confirm</Button>}
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminUsers;
