import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Snackbar from '@mui/material/Snackbar';
import { getUsers, updateUserRole, toggleUserActive } from '../services/api';
import Box from '@mui/material/Box';

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
    setError('');
    setSuccess('');
    const newRole = selectedUser.role === 'Admin' ? 'User' : 'Admin';
    try {
      await updateUserRole(selectedUser.id, JSON.stringify(newRole));
      setSuccess('User role updated.');
      setSnackbarMsg('User role updated.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      fetchUsers();
    } catch {
      setError('Failed to update user role.');
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
    setError('');
    setSuccess('');
    try {
      await toggleUserActive(selectedUser.id, !selectedUser.isActive);
      setSuccess(selectedUser.isActive ? 'User deactivated.' : 'User activated.');
      setSnackbarMsg(selectedUser.isActive ? 'User deactivated.' : 'User activated.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      fetchUsers();
    } catch {
      setError('Failed to update user status.');
      setSnackbarMsg('Failed to update user status.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    setActionLoading(false);
    handleDialogClose();
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4 }}>User Management</Typography>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.isActive ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color={user.role === 'Admin' ? 'secondary' : 'primary'}
                      size="small"
                      onClick={() => handleDialogOpen(user, 'role')}
                      sx={{ mr: 1 }}
                      disabled={actionLoading}
                    >
                      {user.role === 'Admin' ? 'Demote to User' : 'Promote to Admin'}
                    </Button>
                    <Button
                      variant="contained"
                      color={user.isActive ? 'error' : 'success'}
                      size="small"
                      onClick={() => handleDialogOpen(user, 'active')}
                      disabled={actionLoading}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
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