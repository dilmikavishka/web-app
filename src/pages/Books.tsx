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
    Paper
} from '@mui/material';
import {
    Search as SearchIcon,
    Add as AddIcon,
    CloudUpload as UploadIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import axios from 'axios';
import type { Book } from '../types';
import BookCard from '../components/BookCard';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';

// Sample Book Data
const SAMPLE_BOOKS: Book[] = [
    {
        id: "1",
        title: "Java Basics",
        author: "John Doe",
        price: 500,
        imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400&q=80"
    },
    {
        id: "2",
        title: "Spring Boot Guide",
        author: "Jane Smith",
        price: 750,
        imageUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400&q=80"
    },
    {
        id: "3",
        title: "React Handbook",
        author: "Mike Johnson",
        price: 600,
        imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400&q=80"
    },
    {
        id: "4",
        title: "Python Programming",
        author: "Sarah Wilson",
        price: 550,
        imageUrl: "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400&q=80"
    },
    {
        id: "5",
        title: "Database Design",
        author: "David Brown",
        price: 650,
        imageUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400&q=80"
    },
    {
        id: "6",
        title: "Microservices Architecture",
        author: "Emily Davis",
        price: 850,
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400&q=80"
    }
];

const Books = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('title');
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<'add' | 'edit'>('add');
    const [currentBook, setCurrentBook] = useState<Book | null>(null);
    const [formData, setFormData] = useState({ title: '', author: '', price: '' });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            // Try API first
            const response = await axios.get('http://localhost:8080/books');
            setBooks(response.data);
        } catch (error) {
            console.log('Using sample book data (API not available)');
            // Use sample data if API fails
            setBooks(SAMPLE_BOOKS);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddDialog = () => {
        setDialogType('add');
        setFormData({ title: '', author: '', price: '' });
        setSelectedImage(null);
        setCurrentBook(null);
        setOpenDialog(true);
    };

    const handleOpenEditDialog = (book: Book) => {
        setDialogType('edit');
        setCurrentBook(book);
        setFormData({
            title: book.title,
            author: book.author,
            price: book.price.toString()
        });
        setSelectedImage(null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({ title: '', author: '', price: '' });
        setSelectedImage(null);
        setCurrentBook(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        try {
            if (dialogType === 'add') {
                // Add new book
                const newBook: Book = {
                    id: (books.length + 1).toString(),
                    title: formData.title,
                    author: formData.author,
                    price: Number(formData.price),
                    imageUrl: selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400&q=80"
                };
                setBooks([...books, newBook]);
                setSnackbar({ open: true, message: 'Book added successfully!', severity: 'success' });
            } else {
                // Edit book
                const updatedBooks = books.map(book =>
                    book.id === currentBook?.id
                        ? {
                            ...book,
                            title: formData.title,
                            author: formData.author,
                            price: Number(formData.price),
                            imageUrl: selectedImage
                                ? URL.createObjectURL(selectedImage)
                                : book.imageUrl
                        }
                        : book
                );
                setBooks(updatedBooks);
                setSnackbar({ open: true, message: 'Book updated successfully!', severity: 'success' });
            }
            handleCloseDialog();
        } catch (error) {
            setSnackbar({ open: true, message: 'Operation failed!', severity: 'error' });
        }
    };

    const handleDeleteBook = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                const updatedBooks = books.filter(book => book.id !== id);
                setBooks(updatedBooks);
                setSnackbar({ open: true, message: 'Book deleted successfully!', severity: 'success' });
            } catch (error) {
                setSnackbar({ open: true, message: 'Delete failed!', severity: 'error' });
            }
        }
    };

    const filteredBooks = books
        .filter(book =>
            book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.author.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'title') return a.title.localeCompare(b.title);
            if (sortBy === 'price') return a.price - b.price;
            if (sortBy === 'author') return a.author.localeCompare(b.author);
            return 0;
        });

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
                         Book Collection
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
                        Add New Book
                    </Button>
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
                                <MenuItem value="price">Price (Low to High)</MenuItem>
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
                            Try adjusting your search or add a new book
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
                            sx={{ mb: 2, mt: 1 }}
                        />
                        <TextField
                            fullWidth
                            label="Author"
                            name="author"
                            value={formData.author}
                            onChange={handleInputChange}
                            required
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Price (LKR)"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                            sx={{ mb: 2 }}
                        />
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
                            sx={{
                                background: 'linear-gradient(135deg, #ff6b35 0%, #e54b1a 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #e54b1a 0%, #ff6b35 100%)',
                                }
                            }}
                        >
                            {dialogType === 'add' ? 'Add Book' : 'Update Book'}
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

export default Books;