import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Home as HomeIcon,
    People as PeopleIcon,
    MenuBook as BookIcon,
    History as HistoryIcon,
    Login as LoginIcon,
    PersonAdd as SignUpIcon,
    Menu as MenuIcon,
    Close as CloseIcon
} from '@mui/icons-material';

const Navbar = () => {
    const theme = useTheme();
    const location = useLocation();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = [
        { path: '/', label: 'Home', icon: <HomeIcon /> },
        { path: '/users', label: 'Users', icon: <PeopleIcon /> },
        { path: '/books', label: 'Books', icon: <BookIcon /> },
        { path: '/rentals', label: 'Rentals', icon: <HistoryIcon /> },
    ];

    const authItems = [
        { path: '/signin', label: 'Sign In', icon: <LoginIcon /> },
        { path: '/signup', label: 'Sign Up', icon: <SignUpIcon /> },
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const isActivePath = (path: string) => {
        return location.pathname === path;
    };

    // Mobile Drawer Content
    const drawerContent = (
        <Box sx={{ width: 280, height: '100%', bgcolor: '#ffffff' }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                borderBottom: '1px solid #ffebe5'
            }}>
                <Typography
                    variant="h6"
                    component={RouterLink}
                    to="/"
                    onClick={handleDrawerToggle}
                    sx={{
                        fontWeight: 700,
                        color: '#ff6b35',
                        textDecoration: 'none'
                    }}
                >
                    Book Rental
                </Typography>
                <IconButton onClick={handleDrawerToggle} sx={{ color: '#ff6b35' }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <List sx={{ pt: 2 }}>
                {/* Navigation Items */}
                {navItems.map((item) => (
                    <ListItem key={item.path} disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to={item.path}
                            onClick={handleDrawerToggle}
                            sx={{
                                py: 1.5,
                                backgroundColor: isActivePath(item.path) ? 'rgba(255, 107, 53, 0.1)' : 'transparent',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 107, 53, 0.05)',
                                },
                                borderLeft: isActivePath(item.path) ? '4px solid #ff6b35' : '4px solid transparent',
                            }}
                        >
                            <ListItemIcon sx={{
                                color: isActivePath(item.path) ? '#ff6b35' : '#4a5568',
                                minWidth: 40
                            }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                sx={{
                                    color: isActivePath(item.path) ? '#ff6b35' : '#4a5568',
                                    '& .MuiTypography-root': {
                                        fontWeight: isActivePath(item.path) ? 600 : 400,
                                    }
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}

                <Divider sx={{ my: 2, borderColor: '#ffebe5' }} />

                {/* Auth Items */}
                {authItems.map((item) => (
                    <ListItem key={item.path} disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to={item.path}
                            onClick={handleDrawerToggle}
                            sx={{
                                py: 1.5,
                                backgroundColor: isActivePath(item.path) ? 'rgba(255, 107, 53, 0.1)' : 'transparent',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 107, 53, 0.05)',
                                },
                                borderLeft: isActivePath(item.path) ? '4px solid #ff6b35' : '4px solid transparent',
                            }}
                        >
                            <ListItemIcon sx={{
                                color: isActivePath(item.path) ? '#ff6b35' : '#4a5568',
                                minWidth: 40
                            }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                sx={{
                                    color: isActivePath(item.path) ? '#ff6b35' : '#4a5568',
                                    '& .MuiTypography-root': {
                                        fontWeight: isActivePath(item.path) ? 600 : 400,
                                    }
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Box sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 2,
                borderTop: '1px solid #ffebe5',
                textAlign: 'center'
            }}>
                <Typography variant="caption" color="text.secondary">
                    © 2026 Book Rental System
                </Typography>
            </Box>
        </Box>
    );

    return (
        <>
            <AppBar
                position="sticky"
                sx={{
                    background: '#ffffff',
                    boxShadow: '0 2px 10px rgba(255, 107, 53, 0.1)',
                    borderBottom: '1px solid #ffebe5'
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 70 } }}>
                        {/* Logo - Left Side */}
                        <Typography
                            variant="h6"
                            component={RouterLink}
                            to="/"
                            sx={{
                                fontWeight: 700,
                                color: '#ff6b35',
                                textDecoration: 'none',
                                whiteSpace: 'nowrap',
                                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                '&:hover': { opacity: 0.9 },
                                // Fixed width to maintain layout
                                width: { md: '200px' }
                            }}
                        >
                            Book Rental System
                        </Typography>

                        {/* Desktop Navigation - Center */}
                        {!isMobile && (
                            <>
                                <Box sx={{
                                    display: 'flex',
                                    gap: 1,
                                    justifyContent: 'center',
                                    flex: 1 // This makes it take available space and center
                                }}>
                                    {navItems.map((item) => (
                                        <Button
                                            key={item.path}
                                            component={RouterLink}
                                            to={item.path}
                                            sx={{
                                                color: isActivePath(item.path) ? '#ff6b35' : '#4a5568',
                                                backgroundColor: isActivePath(item.path) ? 'rgba(255, 107, 53, 0.1)' : 'transparent',
                                                '&:hover': {
                                                    background: 'rgba(255, 107, 53, 0.05)',
                                                    color: '#ff6b35'
                                                },
                                                fontWeight: isActivePath(item.path) ? 600 : 400,
                                                px: 2,
                                            }}
                                            startIcon={item.icon}
                                        >
                                            {item.label}
                                        </Button>
                                    ))}
                                </Box>

                                {/* Auth Items - Right Side */}
                                <Box sx={{
                                    display: 'flex',
                                    gap: 1,
                                    justifyContent: 'flex-end',
                                    width: { md: '200px' } // Same width as logo for balance
                                }}>
                                    {authItems.map((item) => (
                                        <Button
                                            key={item.path}
                                            component={RouterLink}
                                            to={item.path}
                                            variant={item.label === 'Sign Up' ? 'contained' : 'outlined'}
                                            startIcon={item.icon}
                                            sx={{
                                                ...(item.label === 'Sign Up' && {
                                                    background: 'linear-gradient(135deg, #ff6b35 0%, #e54b1a 100%)',
                                                    color: 'white',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #e54b1a 0%, #ff6b35 100%)',
                                                    }
                                                }),
                                                ...(item.label === 'Sign In' && {
                                                    borderColor: '#ff6b35',
                                                    color: '#ff6b35',
                                                    '&:hover': {
                                                        borderColor: '#e54b1a',
                                                        background: 'rgba(255, 107, 53, 0.05)',
                                                    }
                                                }),
                                                whiteSpace: 'nowrap',
                                                minWidth: { md: '90px' }
                                            }}
                                        >
                                            {item.label}
                                        </Button>
                                    ))}
                                </Box>
                            </>
                        )}

                        {/* Mobile Menu Button */}
                        {isMobile && (
                            <IconButton
                                onClick={handleDrawerToggle}
                                sx={{
                                    color: '#ff6b35',
                                    ml: 'auto'
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: 280,
                        backgroundColor: '#ffffff'
                    },
                }}
            >
                {drawerContent}
            </Drawer>
        </>
    );
};

export default Navbar;