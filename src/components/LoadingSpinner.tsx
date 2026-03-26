
import { Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={60} thickness={4} />
            </Box>
        </motion.div>
    );
};

export default LoadingSpinner;