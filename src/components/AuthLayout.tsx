import { Container, Paper, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    image?: string;
    altText?: string;
}

const AuthLayout = ({ children, title, subtitle, image }: AuthLayoutProps) => {
    return (
        <Container maxWidth="lg" sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            py: 4,
            backgroundColor: '#ffffff'
        }}>
            <Paper
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                elevation={4}
                sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: '#ffffff',
                    width: '100%',
                    boxShadow: '0 4px 20px rgba(255, 107, 53, 0.1)'
                }}
            >
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                    {/* Left Side - Form */}
                    <Box sx={{ p: { xs: 3, md: 6 }, background: '#ffffff' }}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Typography
                                variant="h3"
                                gutterBottom
                                sx={{
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #ff6b35 0%, #e54b1a 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 1
                                }}
                            >
                                {title}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                                {subtitle}
                            </Typography>
                            {children}
                        </motion.div>
                    </Box>

                    {/* Right Side - Original Image (No Overlay) */}
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'block' },
                            position: 'relative',
                            minHeight: '600px',
                            background: image
                                ? `url(${image})`
                                : 'linear-gradient(135deg, #ff6b35 0%, #e54b1a 100%)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            // 👇 REMOVED the overlay completely
                        }}
                    >
                        {!image && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    color: 'white',
                                    textAlign: 'center',
                                    width: '80%'
                                }}
                            >
                                <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
                                     Book Rental System
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
                                    Join Our Library Management System
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 4, opacity: 0.8 }}>
                                    Create your account to start managing your library efficiently.
                                    Get access to powerful tools for book tracking, reader management, and analytics.
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {[
                                        'Complete library management suite',
                                        'Real-time analytics and reporting',
                                        'Automated notifications and alerts',
                                        'Secure and reliable platform'
                                    ].map((feature, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + index * 0.1 }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box component="span" sx={{ fontSize: '1.5rem' }}>✓</Box>
                                                <Typography>{feature}</Typography>
                                            </Box>
                                        </motion.div>
                                    ))}
                                </Box>
                            </motion.div>
                        )}
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default AuthLayout;