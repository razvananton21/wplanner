import { motion } from 'framer-motion';
import { Container, Card, Box, useTheme } from '@mui/material';

const AuthLayout = ({ children }) => {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAF8F4' }}>
      <Container 
        component="main" 
        maxWidth="xs" 
        sx={{ 
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          touchAction: 'none',
          WebkitOverflowScrolling: 'touch',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%' }}
        >
          <Card
            elevation={0}
            sx={{
              p: 4,
              width: '100%',
            }}
          >
            {children}
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AuthLayout; 