import { Container, Typography, Box, Paper, Grid, Card, CardMedia, CardContent } from '@mui/material';
import { motion } from 'framer-motion';

import homeBackground from '../assets/home.jpg';
import bookImage1 from '../assets/61+E1mduSuL._UF1000,1000_QL80_.jpg';
import bookImage2 from '../assets/81wyBYIkZaL.jpg';
import bookImage3 from '../assets/711gFGlF2iL._UF1000,1000_QL80_.jpg';

const Home = () => {
    const featuredBooks = [
        {
            id: 1,
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            image: bookImage1
        },
        {
            id: 2,
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            image: bookImage2
        },
        {
            id: 3,
            title: "1984",
            author: "George Orwell",
            image: bookImage3
        }
    ];

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 64px)',
                background: `url(${homeBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                }
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    minHeight: 'inherit',
                    py: 8
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Header Box */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 3, md: 5 },
                            background: 'rgba(126,121,121,0.32)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 4,
                            maxWidth: '900px',
                            margin: '0 auto 40px auto',
                            textAlign: 'center',
                            boxShadow: '0 20px 40px rgba(255, 107, 53, 0.2)',
                            border: '1px solid rgba(255, 107, 53, 0.1)'
                        }}
                    >
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                mb: 2,
                                background: 'linear-gradient(135deg, #ff6b35 0%, #e54b1a 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                             Book Rental Library
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: '#ffffff',
                                mb: 2
                            }}
                        >
                            Your Gateway to Unlimited Reading
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#e5e0e0',
                                maxWidth: '700px',
                                margin: '0 auto'
                            }}
                        >
                            Discover thousands of books, from classics to bestsellers.
                            Rent your favorite books and enjoy reading anytime, anywhere.
                        </Typography>
                    </Paper>

                    {/* Featured Books Section */}
                    <Box sx={{ mb: 5 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                color: '#ff6b35',
                                mb: 3,
                                fontWeight: 600,
                                textAlign: 'center',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                            }}
                        >
                            Featured Books
                        </Typography>

                        <Grid container spacing={3} justifyContent="center">
                            {featuredBooks.map((book, index) => (
                                <Grid item xs={12} sm={6} md={4} key={book.id}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + index * 0.1 }}
                                    >
                                        <Card
                                            sx={{
                                                borderRadius: 3,
                                                overflow: 'hidden',
                                                transition: 'transform 0.3s, box-shadow 0.3s',
                                                '&:hover': {
                                                    transform: 'translateY(-10px)',
                                                    boxShadow: '0 20px 40px rgba(255, 107, 53, 0.3)',
                                                }
                                            }}
                                        >
                                            <CardMedia
                                                component="img"
                                                height="250"
                                                image={book.image}
                                                alt={book.title}
                                                sx={{
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.3s',
                                                    '&:hover': {
                                                        transform: 'scale(1.05)'
                                                    }
                                                }}
                                            />
                                            <CardContent sx={{ bgcolor: '#fff', p: 2 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                                                    {book.title}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                                                    by {book.author}
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        display: 'inline-block',
                                                        px: 2,
                                                        py: 0.5,
                                                        borderRadius: 2,
                                                        fontSize: '0.875rem',
                                                        fontWeight: 500
                                                    }}
                                                >

                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>


                </motion.div>
            </Container>
        </Box>
    );
};

export default Home;