// src/pages/Users.tsx
import { useState, useEffect } from 'react';
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
    TextField,
    InputAdornment,
    Box,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Snackbar,
    CircularProgress
} from '@mui/material';
import {
    Search as SearchIcon,
    PersonAdd as PersonAddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Close as CloseIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
} from '../service/userService';
import type { User } from '../types';
import { motion } from 'framer-motion';

const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<'add' | 'edit'>('add');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({ name: '', address: '', phoneNumber: '' });
    const [formErrors, setFormErrors] = useState({ name: '', address: '', phoneNumber: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getAllUsers();
            console.log('Users fetched:', data);
            setUsers(Array.isArray(data) ? data : []);
        } catch (error: any) {
            console.error("Failed to fetch users:", error);
            let errorMessage = 'Failed to fetch users. ';

            if (error.code === 'ERR_NETWORK') {
                errorMessage += 'Backend server is not running on port 7000. Please start the backend service.';
            } else if (error.response?.status === 404) {
                errorMessage += 'API endpoint not found. Check if the backend is running correctly.';
            } else if (error.response?.data?.message) {
                errorMessage += error.response.data.message;
            } else {
                errorMessage += error.message || 'Unknown error occurred.';
            }

            setSnackbar({
                open: true,
                message: errorMessage,
                severity: 'error'
            });
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = (): boolean => {
        const errors = { name: '', address: '', phoneNumber: '' };
        let isValid = true;

        if (!formData.name.trim()) {
            errors.name = 'Name is required';
            isValid = false;
        }
        if (!formData.address.trim()) {
            errors.address = 'Address is required';
            isValid = false;
        }
        if (!formData.phoneNumber.trim()) {
            errors.phoneNumber = 'Phone number is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
            errors.phoneNumber = 'Phone number must be 10 digits';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleOpenAddDialog = () => {
        setDialogType('add');
        setFormData({ name: '', address: '', phoneNumber: '' });
        setFormErrors({ name: '', address: '', phoneNumber: '' });
        setOpenDialog(true);
    };

    const handleOpenEditDialog = (user: User) => {
        setDialogType('edit');
        setCurrentUser(user);
        setFormData({
            name: user.name,
            address: user.address || '',
            phoneNumber: user.phoneNumber || ''
        });
        setFormErrors({ name: '', address: '', phoneNumber: '' });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentUser(null);
        setFormData({ name: '', address: '', phoneNumber: '' });
        setFormErrors({ name: '', address: '', phoneNumber: '' });
        setSubmitting(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setFormErrors({
            ...formErrors,
            [e.target.name]: ''
        });
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        try {
            if (dialogType === 'add') {
                const newUser = await createUser({
                    name: formData.name,
                    address: formData.address,
                    phoneNumber: formData.phoneNumber
                });
                setUsers([newUser, ...users]);
                setSnackbar({ open: true, message: 'User added successfully!', severity: 'success' });
            } else if (currentUser) {
                const updatedUser = await updateUser(currentUser.id, {
                    name: formData.name,
                    address: formData.address,
                    phoneNumber: formData.phoneNumber
                });
                setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
                setSnackbar({ open: true, message: 'User updated successfully!', severity: 'success' });
            }
            handleCloseDialog();
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || error?.message || 'Operation failed!';
            setSnackbar({ open: true, message: errorMsg, severity: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(id);
                setUsers(users.filter(user => user.id !== id));
                setSnackbar({ open: true, message: 'User deleted successfully!', severity: 'success' });
            } catch (error: any) {
                const errorMsg = error?.response?.data?.message || error?.message || 'Delete failed!';
                setSnackbar({ open: true, message: errorMsg, severity: 'error' });
            }
        }
    };

    const filteredUsers = Array.isArray(users) ? users.filter(user =>
        user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        user?.address?.toLowerCase().includes(search.toLowerCase()) ||
        user?.phoneNumber?.includes(search)
    ) : [];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress sx={{ color: '#ff6b35' }} />
                <Typography sx={{ ml: 2, color: '#ff6b35' }}>Loading users...</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#ff6b35' }}>
                         User Management
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={fetchUsers}
                            sx={{
                                borderColor: '#ff6b35',
                                color: '#ff6b35',
                                '&:hover': {
                                    borderColor: '#e54b1a',
                                    backgroundColor: 'rgba(255, 107, 53, 0.05)',
                                }
                            }}
                        >
                            Refresh
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<PersonAddIcon />}
                            onClick={handleOpenAddDialog}
                            sx={{
                                background: 'linear-gradient(135deg, #ff6b35 0%, #e54b1a 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #e54b1a 0%, #ff6b35 100%)',
                                }
                            }}
                        >
                            Add New User
                        </Button>
                    </Box>
                </Box>

                {/* Search Bar */}
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search users by name, address or phone number..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{
                        mb: 4,
                        '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                                borderColor: '#ff6b35',
                            },
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#ff6b35' }} />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Users Table */}
                <TableContainer component={Paper} sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(255, 107, 53, 0.1)'
                }}>
                    <Table>
                        <TableHead sx={{ background: 'linear-gradient(135deg, #ff6b35 0%, #e54b1a 100%)' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Name</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Address</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Phone Number</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user, index) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <TableCell sx={{ fontWeight: 500, color: '#333' }}>{user.name}</TableCell>
                                        <TableCell sx={{ color: '#666' }}>{user.address || '-'}</TableCell>
                                        <TableCell sx={{ color: '#666' }}>{user.phoneNumber || '-'}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenEditDialog(user)}
                                                sx={{ color: '#ff6b35', mr: 1 }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDeleteUser(user.id)}
                                                sx={{ color: '#ff6b35' }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </motion.tr>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                        <Typography color="text.secondary">
                                            No users found. Click "Add New User" to create one.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Add/Edit User Dialog */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{
                        background: 'linear-gradient(135deg, #ff6b35 0%, #e54b1a 100%)',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        {dialogType === 'add' ? 'Add New User' : 'Edit User'}
                        <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            error={!!formErrors.name}
                            helperText={formErrors.name}
                            sx={{ mb: 2, mt: 1 }}
                            placeholder="Enter user's full name"
                        />
                        <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            error={!!formErrors.address}
                            helperText={formErrors.address}
                            sx={{ mb: 2 }}
                            placeholder="Enter user's address"
                            multiline
                            rows={2}
                        />
                        <TextField
                            fullWidth
                            label="Phone Number"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            required
                            error={!!formErrors.phoneNumber}
                            helperText={formErrors.phoneNumber || "Format: 0771234567 (10 digits)"}
                            sx={{ mb: 2 }}
                            placeholder="Enter phone number (e.g., 0771234567)"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            disabled={submitting}
                            sx={{
                                background: 'linear-gradient(135deg, #ff6b35 0%, #e54b1a 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #e54b1a 0%, #ff6b35 100%)',
                                },
                                '&.Mui-disabled': {
                                    background: '#ccc'
                                }
                            }}
                        >
                            {submitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : (dialogType === 'add' ? 'Add User' : 'Update User')}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar for notifications */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={5000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert severity={snackbar.severity} sx={{ width: '100%' }} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </motion.div>
        </Container>
    );
};

export default Users;