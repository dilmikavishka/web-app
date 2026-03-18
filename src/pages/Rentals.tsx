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
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Avatar,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Snackbar,
    IconButton,
    Grid,
    Card,
    CardContent,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    History as HistoryIcon,
    Person as PersonIcon,
    MenuBook as BookIcon,
    Add as AddIcon,
    Close as CloseIcon,
    Event as EventIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Rental, User, Book } from '../types';
import axios from "axios";

// Sample Data
const SAMPLE_USERS = [
    { id: 1, name: "Dilmi Perera", email: "dilmi@library.com" },
    { id: 2, name: "Kasun Silva", email: "kasun@library.com" },
    { id: 3, name: "Nimali Jayawardena", email: "nimali@library.com" },
];

const SAMPLE_BOOKS = [
    { id: "1", title: "Java Basics", author: "John Doe", price: 500 },
    { id: "2", title: "Spring Boot Guide", author: "Jane Smith", price: 750 },
    { id: "3", title: "React Handbook", author: "Mike Johnson", price: 600 },
];

const SAMPLE_RENTALS: Rental[] = [
    {
        id: 1,
        userId: 1,
        bookId: "1",
        rentDate: "2026-03-15T10:30:00Z",
        status: 'active'
    },
    {
        id: 2,
        userId: 2,
        bookId: "2",
        rentDate: "2026-03-16T14:20:00Z",
        status: 'active'
    },
    {
        id: 3,
        userId: 1,
        bookId: "3",
        rentDate: "2026-03-14T09:15:00Z",
        status: 'returned'
    },
    {
        id: 4,
        userId: 3,
        bookId: "1",
        rentDate: "2026-03-16T11:45:00Z",
        status: 'active'
    },
    {
        id: 5,
        userId: 2,
        bookId: "3",
        rentDate: "2026-03-13T16:30:00Z",
        status: 'returned'
    },
];

const Rentals = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const [rentals, setRentals] = useState<Rental[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterUser, setFilterUser] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    // Dialog state
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({ userId: '', bookId: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Try API first
            const [rentalsRes, usersRes, booksRes] = await Promise.all([
                axios.get('http://localhost:8080/rentals').catch(() => ({ data: SAMPLE_RENTALS })),
                axios.get('http://localhost:8080/users').catch(() => ({ data: SAMPLE_USERS })),
                axios.get('http://localhost:8080/books').catch(() => ({ data: SAMPLE_BOOKS })),
            ]);

            setRentals(rentalsRes.data || SAMPLE_RENTALS);
            setUsers(usersRes.data || SAMPLE_USERS);
            setBooks(booksRes.data || SAMPLE_BOOKS);
        } catch (error) {
            console.log('Using sample rental data');
            setRentals(SAMPLE_RENTALS);
            setUsers(SAMPLE_USERS);
            setBooks(SAMPLE_BOOKS);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddDialog = () => {
        setFormData({ userId: '', bookId: '' });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({ userId: '', bookId: '' });
    };

    const handleSubmit = async () => {
        try {
            const newRental: Rental = {
                id: rentals.length + 1,
                userId: Number(formData.userId),
                bookId: formData.bookId,
                rentDate: new Date().toISOString(),
                status: 'active'
            };

            setRentals([newRental, ...rentals]);
            setSnackbar({ open: true, message: 'Book rented successfully!', severity: 'success' });
            handleCloseDialog();
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to rent book!', severity: 'error' });
        }
    };

    const handleReturnBook = async (rentalId: number) => {
        if (window.confirm('Mark this book as returned?')) {
            try {
                const updatedRentals = rentals.map(rental =>
                    rental.id === rentalId ? { ...rental, status: 'returned' as const } : rental
                );
                setRentals(updatedRentals);
                setSnackbar({ open: true, message: 'Book returned successfully!', severity: 'success' });
            } catch (error) {
                setSnackbar({ open: true, message: 'Failed to return book!', severity: 'error' });
            }
        }
    };

    const getUserName = (userId: number) => {
        const user = users.find(u => u.id === userId);
        return user ? user.name : 'Unknown';
    };

    const getBookTitle = (bookId: string) => {
        const book = books.find(b => b.id === bookId);
        return book ? book.title : 'Unknown';
    };

    const getBookAuthor = (bookId: string) => {
        const book = books.find(b => b.id === bookId);
        return book ? book.author : 'Unknown';
    };

    const filteredRentals = rentals
        .filter(rental => filterUser === 'all' || rental.userId === Number(filterUser))
        .filter(rental => filterStatus === 'all' || rental.status === filterStatus)
        .sort((a, b) => new Date(b.rentDate).getTime() - new Date(a.rentDate).getTime());

    if (loading) return <LoadingSpinner />;

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'stretch' : 'center',
                    gap: 2,
                    mb: 4
                }}>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: 'rgba(255,107,53,0.66)' }}>
                         Rental Management
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: 2
                    }}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleOpenAddDialog}
                            sx={{
                                background: 'linear-gradient(135deg, #ff6b35 0%, #e54b1a 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #e54b1a 0%, #ff6b35 100%)',
                                }
                            }}
                        >
                            New Rental
                        </Button>
                    </Box>
                </Box>

                {/* Filters */}
                <Paper sx={{ p: 2, mb: 4, borderRadius: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: '#ff6b35' }}>Filter by User</InputLabel>
                                <Select
                                    value={filterUser}
                                    label="Filter by User"
                                    onChange={(e) => setFilterUser(e.target.value)}
                                    sx={{
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#ff6b35',
                                        },
                                    }}
                                >
                                    <MenuItem value="all">All Users</MenuItem>
                                    {users.map(user => (
                                        <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: '#ff6b35' }}>Filter by Status</InputLabel>
                                <Select
                                    value={filterStatus}
                                    label="Filter by Status"
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    sx={{
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#ff6b35',
                                        },
                                    }}
                                >
                                    <MenuItem value="all">All Status</MenuItem>
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="returned">Returned</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Mobile/Tablet View - Cards */}
                {(isMobile || isTablet) ? (
                    <Grid container spacing={2}>
                        {filteredRentals.map((rental, index) => (
                            <Grid item xs={12} key={rental.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(255, 107, 53, 0.1)' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                <Chip
                                                    label={`#${rental.id}`}
                                                    size="small"
                                                    sx={{
                                                        color: '#ff6b35',
                                                        borderColor: '#ff6b35',
                                                    }}
                                                    variant="outlined"
                                                />
                                                <Chip
                                                    label={rental.status === 'active' ? 'Active' : 'Returned'}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: rental.status === 'active' ? '#e8f5e8' : '#ffebee',
                                                        color: rental.status === 'active' ? '#2e7d32' : '#c62828',
                                                        fontWeight: 500
                                                    }}
                                                />
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <PersonIcon sx={{ color: '#ff6b35', fontSize: 20 }} />
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                    {getUserName(rental.userId)}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <BookIcon sx={{ color: '#ff6b35', fontSize: 20 }} />
                                                <Box>
                                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                        {getBookTitle(rental.bookId)}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        by {getBookAuthor(rental.bookId)}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                <EventIcon sx={{ color: '#ff6b35', fontSize: 20 }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {new Date(rental.rentDate).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </Typography>
                                            </Box>

                                            {rental.status === 'active' && (
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => handleReturnBook(rental.id)}
                                                    sx={{
                                                        borderColor: '#ff6b35',
                                                        color: '#ff6b35',
                                                        '&:hover': {
                                                            borderColor: '#e54b1a',
                                                            backgroundColor: 'rgba(255, 107, 53, 0.05)',
                                                        }
                                                    }}
                                                >
                                                    Mark as Returned
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    /* Desktop View - Table */
                    <TableContainer component={Paper} sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(255, 107, 53, 0.1)'
                    }}>
                        <Table>
                            <TableHead sx={{ background: 'linear-gradient(135deg, #ff6b35 0%, #e54b1a 100%)' }}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>ID</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PersonIcon /> User
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <BookIcon /> Book
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <HistoryIcon /> Rent Date
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRentals.map((rental, index) => (
                                    <motion.tr
                                        key={rental.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <TableCell>
                                            <Chip
                                                label={`#${rental.id}`}
                                                size="small"
                                                sx={{
                                                    color: '#ff6b35',
                                                    borderColor: '#ff6b35',
                                                }}
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Avatar sx={{
                                                    bgcolor: '#ff6b35',
                                                    width: 32,
                                                    height: 32,
                                                    fontSize: '0.875rem'
                                                }}>
                                                    {getUserName(rental.userId).charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {getUserName(rental.userId)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {getBookTitle(rental.bookId)}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    by {getBookAuthor(rental.bookId)}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {new Date(rental.rentDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={rental.status === 'active' ? 'Active' : 'Returned'}
                                                size="small"
                                                sx={{
                                                    bgcolor: rental.status === 'active' ? '#e8f5e8' : '#ffebee',
                                                    color: rental.status === 'active' ? '#2e7d32' : '#c62828',
                                                    fontWeight: 500,
                                                    minWidth: 80
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {rental.status === 'active' && (
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => handleReturnBook(rental.id)}
                                                    sx={{
                                                        borderColor: '#ff6b35',
                                                        color: '#ff6b35',
                                                        '&:hover': {
                                                            borderColor: '#e54b1a',
                                                            backgroundColor: 'rgba(255, 107, 53, 0.05)',
                                                        }
                                                    }}
                                                >
                                                    Return
                                                </Button>
                                            )}
                                        </TableCell>
                                    </motion.tr>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Empty State */}
                {filteredRentals.length === 0 && (
                    <Paper sx={{ p: 4, textAlign: 'center', mt: 2 }}>
                        <HistoryIcon sx={{ fontSize: 48, color: '#ff6b35', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No rental history found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Start by renting a book to your users
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleOpenAddDialog}
                            sx={{
                                background: 'linear-gradient(135deg, #ff6b35 0%, #e54b1a 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #e54b1a 0%, #ff6b35 100%)',
                                }
                            }}
                        >
                            New Rental
                        </Button>
                    </Paper>
                )}

                {/* New Rental Dialog */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{
                        background: 'linear-gradient(135deg, #ff6b35 0%, #e54b1a 100%)',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        Rent a Book
                        <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ mt: 2 }}>
                        <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
                            <InputLabel>Select User</InputLabel>
                            <Select
                                name="userId"
                                value={formData.userId}
                                label="Select User"
                                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                required
                            >
                                {users.map(user => (
                                    <MenuItem key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Select Book</InputLabel>
                            <Select
                                name="bookId"
                                value={formData.bookId}
                                label="Select Book"
                                onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                                required
                            >
                                {books.map(book => (
                                    <MenuItem key={book.id} value={book.id}>
                                        {book.title} by {book.author} - LKR {book.price}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            disabled={!formData.userId || !formData.bookId}
                            sx={{
                                background: 'linear-gradient(135deg, #ff6b35 0%, #e54b1a 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #e54b1a 0%, #ff6b35 100%)',
                                }
                            }}
                        >
                            Rent Book
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

export default Rentals;