import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Users from './pages/Users';
import Books from './pages/Books';
import Rentals from './pages/Rentals';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';


const theme = createTheme({
    palette: {
        primary: {
            main: '#ff6b35',
            light: '#ff8c5a',
            dark: '#e54b1a',
        },
        secondary: {
            main: '#e54b1a',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#ffffff',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                contained: {
                    background: 'linear-gradient(135deg, #ff6b35 0%, #e54b1a 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #e54b1a 0%, #ff6b35 100%)',
                    },
                },
            },
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/books" element={<Books />} />
                    <Route path="/rentals" element={<Rentals />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/signin" element={<SignIn />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;