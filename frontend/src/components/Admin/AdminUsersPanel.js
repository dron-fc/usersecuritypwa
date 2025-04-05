import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  MenuItem, IconButton, Snackbar, Alert
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Add as AddIcon 
} from '@mui/icons-material';
import { client } from '../../api/client';

const AdminUsersPanel = () => {
  const { auth } = useAuth(); // Добавлен хук useAuth
  const navigate = useNavigate(); // Добавлен хук useNavigate
  const [users, setUsers] = useState([]); // Добавлен setUsers
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user'
  });

  const fetchUsers = async () => {
    try {
      const data = await client('users', {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setUsers(data);
    } catch (error) {
      if (error.status === 403) {
        navigate('/unauthorized');
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to fetch users',
          severity: 'error'
        });
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Обработчики
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenCreate = () => {
    setCurrentUser(null);
    setFormData({ email: '', password: '', role: 'user' });
    setOpenDialog(true);
  };

  const handleOpenEdit = (user) => {
    setCurrentUser(user);
    setFormData({ email: user.email, password: '', role: user.role });
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      const url = currentUser ? `users/${currentUser.id}` : 'users';
      const method = currentUser ? 'PUT' : 'POST';
      
      await client(url, {
        method,
        body: formData,
        headers: { Authorization: `Bearer ${auth.token}` }
      });

      showSnackbar(currentUser ? 'User updated!' : 'User created!');
      fetchUsers();
      setOpenDialog(false);
    } catch (error) {
      showSnackbar(error.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (userId) => {
    try {
      await client(`users/${userId}`, { 
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      showSnackbar('User deleted!');
      fetchUsers();
    } catch (error) {
      showSnackbar('Delete failed', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <div style={{ padding: '20px' }}>
      <Button 
        variant="contained" 
        startIcon={<AddIcon />} 
        onClick={handleOpenCreate}
        style={{ marginBottom: '20px' }}
      >
        Add User
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenEdit(user)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Диалог создания/редактирования */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{currentUser ? 'Edit User' : 'Create User'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            value={formData.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            value={formData.password}
            onChange={handleInputChange}
            placeholder={currentUser ? "Leave empty to keep unchanged" : ""}
          />
          <TextField
            select
            margin="dense"
            name="role"
            label="Role"
            fullWidth
            variant="standard"
            value={formData.role}
            onChange={handleInputChange}
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="moderator">Moderator</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {currentUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminUsersPanel;
