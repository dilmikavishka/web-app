import { Card, CardContent, CardMedia, Typography, Chip, Box, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { Book } from '../types';
import { motion } from 'framer-motion';

interface BookCardProps {
    book: Book;
    onEdit?: (book: Book) => void;
    onDelete?: (id: string) => void;
}

const BookCard = ({ book, onEdit, onDelete }: BookCardProps) => {
    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(255, 107, 53, 0.1)',
                transition: '0.3s',
                position: 'relative',
                '&:hover': {
                    boxShadow: '0 8px 30px rgba(255, 107, 53, 0.2)',
                }
            }}>
                <CardMedia
                    component="img"
                    height="250"
                    image={book.imageUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400&q=80'}
                    alt={book.title}
                    sx={{
                        objectFit: 'cover',
                        transition: 'transform 0.3s',
                        '&:hover': {
                            transform: 'scale(1.05)'
                        }
                    }}
                />
                <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
                    <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        sx={{
                            fontWeight: 600,
                            color: '#333',
                            mb: 1
                        }}
                    >
                        {book.title}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#666',
                            mb: 2
                        }}
                    >
                        by {book.author}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip
                            label={`LKR ${book.price}`}
                            sx={{
                                background: 'linear-gradient(135deg, #ff6b35 0%, #e54b1a 100%)',
                                color: 'white',
                                fontWeight: 600
                            }}
                        />
                        <Box>
                            {onEdit && (
                                <IconButton
                                    size="small"
                                    onClick={() => onEdit(book)}
                                    sx={{ color: '#ff6b35', mr: 0.5 }}
                                >
                                    <EditIcon />
                                </IconButton>
                            )}
                            {onDelete && (
                                <IconButton
                                    size="small"
                                    onClick={() => onDelete(book.id)}
                                    sx={{ color: '#ff6b35' }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            )}
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default BookCard;