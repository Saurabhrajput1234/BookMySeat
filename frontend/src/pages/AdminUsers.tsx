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
  Box
} from '@mui/material';
import { getUsers, updateUserRole, toggleUserActive } from '../services/api';

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
  const [success, setSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<'role' | 'active' | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const fetchUsers = () => {
    setLoading(true);
    getUsers()
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load users.');
        setLoading(false);
      });
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
      setSnackbarMsg('User role updated.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      fetchUsers();
    } catch {
      setSnackbarMsg('Failed to update user role.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
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
      setSnackbarOpen(true);
      fetchUsers();
    } catch {
      setSnackbarMsg('Failed to update user status.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    setActionLoading(false);
    handleDialogClose();
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, color: '#d4af37', fontWeight: 'bold' }}>
        User Management
      </Typography>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 4, borderRadius: 2, boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#d4af37' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell sx={{ color: user.isActive ? '#4caf50' : '#f44336' }}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: '#d4af37',
                          color: '#d4af37',
                          width: '140px',
                          fontSize: '0.8rem',
                          '&:hover': { backgroundColor: '#d4af37', color: '#fff' }
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
                          width: '140px',
                          fontSize: '0.8rem',
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

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirm Action</DialogTitle>
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
