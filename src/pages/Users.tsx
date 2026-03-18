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
    Chip,
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
    Snackbar
} from '@mui/material';
import {
    Search as SearchIcon,
    PersonAdd as PersonAddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import type { User } from '../types';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';

// Sample Data (API නැත්නම් මේක පෙන්වයි)
const SAMPLE_USERS: User[] = [
    { id: 1, name: "Dilmi Perera", email: "dilmi@library.com" },
    { id: 2, name: "Kasun Silva", email: "kasun@library.com" },
    { id: 3, name: "Nimali Jayawardena", email: "nimali@library.com" },
    { id: 4, name: "Chamara Weerasinghe", email: "chamara@library.com" },
    { id: 5, name: "Sanduni Fernando", email: "sanduni@library.com" },
    { id: 6, name: "Thisara Perera", email: "thisara@library.com" },
    { id: 7, name: "Amali Gunawardena", email: "amali@library.com" },
    { id: 8, name: "Ruwan Dissanayake", email: "ruwan@library.com" },
];

const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<'add' | 'edit'>('add');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Try API first
            const response = await axios.get('http://localhost:8080/users');
            setUsers(response.data);
        } catch (error) {
            console.log('Using sample data (API not available)');
            // Use sample data if API fails
            setUsers(SAMPLE_USERS);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddDialog = () => {
        setDialogType('add');
        setFormData({ name: '', email: '' });
        setOpenDialog(true);
    };

    const handleOpenEditDialog = (user: User) => {
        setDialogType('edit');
        setCurrentUser(user);
        setFormData({ name: user.name, email: user.email });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentUser(null);
        setFormData({ name: '', email: '' });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        try {
            if (dialogType === 'add') {
                // Add new user
                const newUser = {
                    id: users.length + 1,
                    name: formData.name,
                    email: formData.email
                };
                setUsers([...users, newUser]);
                setSnackbar({ open: true, message: 'User added successfully!', severity: 'success' });
            } else {
                // Edit user
                const updatedUsers = users.map(user =>
                    user.id === currentUser?.id ? { ...user, name: formData.name, email: formData.email } : user
                );
                setUsers(updatedUsers);
                setSnackbar({ open: true, message: 'User updated successfully!', severity: 'success' });
            }
            handleCloseDialog();
        } catch (error) {
            setSnackbar({ open: true, message: 'Operation failed!', severity: 'error' });
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const updatedUsers = users.filter(user => user.id !== id);
                setUsers(updatedUsers);
                setSnackbar({ open: true, message: 'User deleted successfully!', severity: 'success' });
            } catch (error) {
                setSnackbar({ open: true, message: 'Delete failed!', severity: 'error' });
            }
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <LoadingSpinner />;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: 'rgba(255,107,53,0.66)' }}>
                         User Management
                    </Typography>
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

                {/* Search Bar */}
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search users by name or email..."
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

                {/* Users Table - Without ID and Avatar columns */}
                <TableContainer component={Paper} sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(255, 107, 53, 0.1)'
                }}>
                    <Table>
                        <TableHead sx={{ background: 'linear-gradient(135deg, #ff6b35 0%, #e54b1a 100%)' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Name</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Email</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.map((user, index) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <TableCell sx={{ fontWeight: 500, color: '#333' }}>{user.name}</TableCell>
                                    <TableCell sx={{ color: '#666' }}>{user.email}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label="Active"
                                            size="small"
                                            sx={{
                                                bgcolor: '#e8f5e8',
                                                color: '#2e7d32',
                                                fontWeight: 500
                                            }}
                                        />
                                    </TableCell>
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
                            ))}
                            {filteredUsers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                        <Typography color="text.secondary">
                                            No users found
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
                            label="Enter Your Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            sx={{ mb: 2, mt: 1 }}
                        />
                        <TextField
                            fullWidth
                            label="Enter Your Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            sx={{
                                background: 'linear-gradient(135deg, #ff6b35 0%, #e54b1a 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #e54b1a 0%, #ff6b35 100%)',
                                }
                            }}
                        >
                            {dialogType === 'add' ? 'Add User' : 'Update User'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar for notifications */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </motion.div>
        </Container>
    );
};

export default Users;