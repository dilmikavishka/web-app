import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Snackbar,
    IconButton,
    Paper,
    CircularProgress
} from '@mui/material';
import {
    Search as SearchIcon,
    Add as AddIcon,
    CloudUpload as UploadIcon,
    Close as CloseIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import type { Book } from '../types';
import BookCard from '../components/BookCard';
import { motion } from 'framer-motion';
import {
    getAllBooks,
    createBook,
    updateBook,
    deleteBook
} from '../service/bookService';

const Books = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('title');
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<'add' | 'edit'>('add');
    const [currentBook, setCurrentBook] = useState<Book | null>(null);
    const [formData, setFormData] = useState({ title: '', author: '', imageUrl: '' });
    const [formErrors, setFormErrors] = useState({ title: '', author: '' });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const data = await getAllBooks();
            console.log('Books fetched:', data);
            setBooks(Array.isArray(data) ? data : []);
        } catch (error: any) {
            console.error("Failed to fetch books:", error);
            let errorMessage = 'Failed to fetch books. ';

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
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = (): boolean => {
        const errors = { title: '', author: '' };
        let isValid = true;

        if (!formData.title.trim()) {
            errors.title = 'Book title is required';
            isValid = false;
        }
        if (!formData.author.trim()) {
            errors.author = 'Author name is required';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleOpenAddDialog = () => {
        setDialogType('add');
        setFormData({ title: '', author: '', imageUrl: '' });
        setFormErrors({ title: '', author: '' });
        setSelectedImage(null);
        setImagePreview('');
        setCurrentBook(null);
        setOpenDialog(true);
    };

    const handleOpenEditDialog = (book: Book) => {
        setDialogType('edit');
        setCurrentBook(book);
        setFormData({
            title: book.title,
            author: book.author,
            imageUrl: book.imageUrl || ''
        });
        setFormErrors({ title: '', author: '' });
        setSelectedImage(null);
        setImagePreview(book.imageUrl || '');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({ title: '', author: '', imageUrl: '' });
        setFormErrors({ title: '', author: '' });
        setSelectedImage(null);
        setImagePreview('');
        setCurrentBook(null);
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        try {
            const bookData = {
                title: formData.title,
                author: formData.author,
                imageUrl: selectedImage ? URL.createObjectURL(selectedImage) : formData.imageUrl
            };

            if (dialogType === 'add') {
                const newBook = await createBook(bookData);
                setBooks([newBook, ...books]);
                setSnackbar({ open: true, message: 'Book added successfully!', severity: 'success' });
            } else if (currentBook) {
                const updatedBook = await updateBook(currentBook.id, bookData);
                setBooks(books.map(b => b.id === currentBook.id ? updatedBook : b));
                setSnackbar({ open: true, message: 'Book updated successfully!', severity: 'success' });
            }
            handleCloseDialog();
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || error?.message || 'Operation failed!';
            setSnackbar({ open: true, message: errorMsg, severity: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteBook = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await deleteBook(id);
                setBooks(books.filter(book => book.id !== id));
                setSnackbar({ open: true, message: 'Book deleted successfully!', severity: 'success' });
            } catch (error: any) {
                const errorMsg = error?.response?.data?.message || error?.message || 'Delete failed!';
                setSnackbar({ open: true, message: errorMsg, severity: 'error' });
            }
        }
    };

    const filteredBooks = books
        .filter(book =>
            book?.title?.toLowerCase().includes(search.toLowerCase()) ||
            book?.author?.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'title') return a.title.localeCompare(b.title);
            if (sortBy === 'author') return a.author.localeCompare(b.author);
            return 0;
        });

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress sx={{ color: '#ff6b35' }} />
                <Typography sx={{ ml: 2, color: '#ff6b35' }}>Loading books...</Typography>
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
                         Book Collection
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={fetchBooks}
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
                            Add New Book
                        </Button>
                    </Box>
                </Box>

                {/* Search and Sort */}
                <Paper sx={{ p: 2, mb: 4, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search books by title or author..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{
                                flex: 1,
                                minWidth: '250px',
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

                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel sx={{ color: '#ff6b35' }}>Sort By</InputLabel>
                            <Select
                                value={sortBy}
                                label="Sort By"
                                onChange={(e) => setSortBy(e.target.value)}
                                sx={{
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#ff6b35',
                                    },
                                }}
                            >
                                <MenuItem value="title">Title</MenuItem>
                                <MenuItem value="author">Author</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Paper>

                {/* Book Grid */}
                {filteredBooks.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="h6" color="text.secondary">
                            No books found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Try adjusting your search or click "Add New Book" to create one.
                        </Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {filteredBooks.map((book, index) => (
                            <Grid item xs={12} sm={6} md={4} key={book.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <BookCard
                                        book={book}
                                        onEdit={handleOpenEditDialog}
                                        onDelete={handleDeleteBook}
                                    />
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Add/Edit Book Dialog */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{
                        background: 'linear-gradient(135deg, #ff6b35 0%, #e54b1a 100%)',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        {dialogType === 'add' ? 'Add New Book' : 'Edit Book'}
                        <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Book Title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            error={!!formErrors.title}
                            helperText={formErrors.title}
                            sx={{ mb: 2, mt: 1 }}
                            placeholder="Enter book title"
                        />
                        <TextField
                            fullWidth
                            label="Author"
                            name="author"
                            value={formData.author}
                            onChange={handleInputChange}
                            required
                            error={!!formErrors.author}
                            helperText={formErrors.author}
                            sx={{ mb: 2 }}
                            placeholder="Enter author name"
                        />

                        {/* Image Preview */}
                        {imagePreview && (
                            <Box sx={{ mb: 2, textAlign: 'center' }}>
                                <img
                                    src={imagePreview}
                                    alt="Book cover preview"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '150px',
                                        objectFit: 'cover',
                                        borderRadius: '8px'
                                    }}
                                />
                            </Box>
                        )}

                        <Button
                            component="label"
                            variant="outlined"
                            startIcon={<UploadIcon />}
                            sx={{
                                width: '100%',
                                py: 1.5,
                                borderColor: '#ff6b35',
                                color: '#ff6b35',
                                '&:hover': {
                                    borderColor: '#e54b1a',
                                    backgroundColor: 'rgba(255, 107, 53, 0.05)',
                                }
                            }}
                        >
                            {dialogType === 'add' ? 'Upload Book Cover' : 'Change Book Cover'}
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Button>
                        {selectedImage && (
                            <Typography variant="body2" sx={{ mt: 1, color: '#ff6b35' }}>
                                Selected: {selectedImage.name}
                            </Typography>
                        )}
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
                            {submitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : (dialogType === 'add' ? 'Add Book' : 'Update Book')}
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

export default Books;