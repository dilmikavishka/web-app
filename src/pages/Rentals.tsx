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
    useMediaQuery,
    CircularProgress
} from '@mui/material';
import {
    History as HistoryIcon,
    Person as PersonIcon,
    MenuBook as BookIcon,
    Add as AddIcon,
    Close as CloseIcon,
    Event as EventIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { Rental, User, Book } from '../types';
import {
    getAllRentals,
    createRental,
    updateRental
} from '../service/rentalService';
import { getAllUsers } from '../service/userService';
import { getAllBooks } from '../service/bookService';

// Sample Data (Backend API නැත්නම් මේක පෙන්වයි)
const SAMPLE_USERS: User[] = [
    { id: "69c246eee716b4a3d190639f", name: "Dilmi Perera", address: "Colombo", phoneNumber: "0771234567" },
    { id: "69c246eee716b4a3d190640a", name: "Kasun Silva", address: "Kandy", phoneNumber: "0712345678" },
    { id: "69c246eee716b4a3d190641b", name: "Nimali Jayawardena", address: "Galle", phoneNumber: "0763456789" },
];

const SAMPLE_BOOKS: Book[] = [
    { id: 1, title: "Microservices Architectures", author: "Martin Fowler", imageUrl: "" },
    { id: 2, title: "Java Programming", author: "Joshua Bloch", imageUrl: "" },
    { id: 3, title: "Spring Boot in Action", author: "Craig Walls", imageUrl: "" },
];

const SAMPLE_RENTALS: Rental[] = [
    {
        rentalId: 1,
        userId: "69c246eee716b4a3d190639f",
        bookId: 1,
        date: "2026-03-25",
        status: "RENTED",
        user: SAMPLE_USERS[0],
        book: SAMPLE_BOOKS[0]
    },
    {
        rentalId: 2,
        userId: "69c246eee716b4a3d190640a",
        bookId: 2,
        date: "2026-03-24",
        status: "RENTED",
        user: SAMPLE_USERS[1],
        book: SAMPLE_BOOKS[1]
    },
    {
        rentalId: 3,
        userId: "69c246eee716b4a3d190639f",
        bookId: 3,
        date: "2026-03-23",
        status: "RETURNED",
        user: SAMPLE_USERS[0],
        book: SAMPLE_BOOKS[2]
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
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedBookId, setSelectedBookId] = useState<number | ''>('');
    const [submitting, setSubmitting] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Try API first
            const [rentalsData, usersData, booksData] = await Promise.all([
                getAllRentals().catch(() => SAMPLE_RENTALS),
                getAllUsers().catch(() => SAMPLE_USERS),
                getAllBooks().catch(() => SAMPLE_BOOKS),
            ]);

            setRentals(rentalsData);
            setUsers(usersData);
            setBooks(booksData);
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
        setSelectedUserId('');
        setSelectedBookId('');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUserId('');
        setSelectedBookId('');
        setSubmitting(false);
    };

    const handleSubmit = async () => {
        if (!selectedUserId || !selectedBookId) {
            setSnackbar({ open: true, message: 'Please select both user and book', severity: 'error' });
            return;
        }

        setSubmitting(true);
        try {
            const today = new Date().toISOString().split('T')[0];

            const rentalData = {
                userId: selectedUserId,
                bookId: selectedBookId as number,
                date: today,
                status: "RENTED"
            };

            console.log('Creating rental with data:', rentalData);

            const newRental = await createRental(rentalData);

            setRentals([newRental, ...rentals]);
            setSnackbar({ open: true, message: 'Book rented successfully!', severity: 'success' });
            handleCloseDialog();
        } catch (error: any) {
            console.error('Rental error:', error);
            let errorMsg = 'Failed to rent book!';

            if (error.response?.data) {
                const errorData = error.response.data;
                if (errorData.detail) {
                    errorMsg = errorData.detail;
                } else if (errorData.message) {
                    errorMsg = errorData.message;
                }
            } else if (error.message) {
                errorMsg = error.message;
            }

            setSnackbar({ open: true, message: errorMsg, severity: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleReturnBook = async (rental: Rental) => {
        const bookTitle = rental.book?.title || getBookTitle(rental.bookId);
        if (window.confirm(`Return "${bookTitle}" to library?`)) {
            try {
                // Send full rental data with status changed to RETURNED
                const updatedData = {
                    userId: rental.userId,
                    bookId: rental.bookId,
                    date: rental.date,
                    status: "RETURNED"
                };

                console.log('Returning book with data:', updatedData);

                const updatedRental = await updateRental(rental.rentalId, updatedData);

                setRentals(rentals.map(r =>
                    r.rentalId === rental.rentalId ? updatedRental : r
                ));

                setSnackbar({
                    open: true,
                    message: `"${bookTitle}" returned successfully!`,
                    severity: 'success'
                });
            } catch (error: any) {
                console.error('Return error:', error);
                let errorMsg = 'Failed to return book!';

                if (error.response?.data) {
                    const errorData = error.response.data;
                    if (errorData.detail) {
                        errorMsg = errorData.detail;
                    } else if (errorData.message) {
                        errorMsg = errorData.message;
                    }
                } else if (error.message) {
                    errorMsg = error.message;
                }

                setSnackbar({ open: true, message: errorMsg, severity: 'error' });
            }
        }
    };

    const getUserName = (userId: string) => {
        const user = users.find(u => u.id === userId);
        return user ? user.name : 'Unknown';
    };

    const getBookTitle = (bookId: number) => {
        const book = books.find(b => b.id === bookId);
        return book ? book.title : 'Unknown';
    };

    const getBookAuthor = (bookId: number) => {
        const book = books.find(b => b.id === bookId);
        return book ? book.author : 'Unknown';
    };

    const filteredRentals = rentals
        .filter(rental => filterUser === 'all' || rental.userId === filterUser)
        .filter(rental => filterStatus === 'all' || rental.status === filterStatus)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress sx={{ color: '#ff6b35' }} />
                <Typography sx={{ ml: 2, color: '#ff6b35' }}>Loading rentals...</Typography>
            </Box>
        );
    }

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
                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#ff6b35' }}>
                         Rental Management
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: 2
                    }}>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={fetchData}
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
                                        <MenuItem key={user.id} value={user.id}>
                                            {user.name}
                                        </MenuItem>
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
                                    <MenuItem value="RENTED">Rented</MenuItem>
                                    <MenuItem value="RETURNED">Returned</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Mobile/Tablet View - Cards */}
                {(isMobile || isTablet) ? (
                    <Grid container spacing={2}>
                        {filteredRentals.map((rental, index) => (
                            <Grid item xs={12} key={rental.rentalId}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(255, 107, 53, 0.1)' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                                <Chip
                                                    label={rental.status === 'RENTED' ? 'Rented' : 'Returned'}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: rental.status === 'RENTED' ? '#e8f5e8' : '#ffebee',
                                                        color: rental.status === 'RENTED' ? '#2e7d32' : '#c62828',
                                                        fontWeight: 500
                                                    }}
                                                />
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <PersonIcon sx={{ color: '#ff6b35', fontSize: 20 }} />
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                    {rental.user?.name || getUserName(rental.userId)}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <BookIcon sx={{ color: '#ff6b35', fontSize: 20 }} />
                                                <Box>
                                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                        {rental.book?.title || getBookTitle(rental.bookId)}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        by {rental.book?.author || getBookAuthor(rental.bookId)}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                <EventIcon sx={{ color: '#ff6b35', fontSize: 20 }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {new Date(rental.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </Typography>
                                            </Box>

                                            {rental.status === 'RENTED' && (
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => handleReturnBook(rental)}
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
                                            <EventIcon /> Rent Date
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRentals.map((rental, index) => (
                                    <motion.tr
                                        key={rental.rentalId}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Avatar sx={{
                                                    bgcolor: '#ff6b35',
                                                    width: 32,
                                                    height: 32,
                                                    fontSize: '0.875rem'
                                                }}>
                                                    {(rental.user?.name || getUserName(rental.userId)).charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {rental.user?.name || getUserName(rental.userId)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {rental.book?.title || getBookTitle(rental.bookId)}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    by {rental.book?.author || getBookAuthor(rental.bookId)}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {new Date(rental.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={rental.status === 'RENTED' ? 'Rented' : 'Returned'}
                                                size="small"
                                                sx={{
                                                    bgcolor: rental.status === 'RENTED' ? '#e8f5e8' : '#ffebee',
                                                    color: rental.status === 'RENTED' ? '#2e7d32' : '#c62828',
                                                    fontWeight: 500,
                                                    minWidth: 80
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {rental.status === 'RENTED' && (
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => handleReturnBook(rental)}
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
                                value={selectedUserId}
                                label="Select User"
                                onChange={(e) => setSelectedUserId(e.target.value)}
                                required
                            >
                                {users.map(user => (
                                    <MenuItem key={user.id} value={user.id}>
                                        {user.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Select Book</InputLabel>
                            <Select
                                value={selectedBookId}
                                label="Select Book"
                                onChange={(e) => setSelectedBookId(e.target.value as number)}
                                required
                            >
                                {books.map(book => (
                                    <MenuItem key={book.id} value={book.id}>
                                        {book.title} by {book.author}
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
                            disabled={!selectedUserId || !selectedBookId || submitting}
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
                            {submitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Rent Book'}
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

export default Rentals;