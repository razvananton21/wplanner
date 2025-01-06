import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  InputAdornment,
  Divider,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Fingerprint as FingerprintIcon,
} from '@mui/icons-material';
import { login, clearError } from '../../store/slices/authSlice';
import { motion } from 'framer-motion';

// Capacitor plugins
import { App } from '@capacitor/app';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showPassword, setShowPassword] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }

    // Check if biometric authentication is available
    const checkBiometric = async () => {
      try {
        // Only check for biometric if we're in a native app
        if (window?.Capacitor?.isNativePlatform()) {
          const available = await App.isNativePlatform();
          setBiometricAvailable(available);
        } else {
          console.log('Not a native platform, biometric auth not available');
          setBiometricAvailable(false);
        }
      } catch (error) {
        console.error('Biometric check failed:', error);
        setBiometricAvailable(false);
      }
    };

    checkBiometric();
  }, [isAuthenticated, navigate]);

  const handleBiometricAuth = async () => {
    try {
      // Only proceed with biometric auth if we're in a native app
      if (window?.Capacitor?.isNativePlatform()) {
        // Trigger haptic feedback
        await Haptics.impact({ style: ImpactStyle.Light });
        
        // Here you would implement the actual biometric authentication
        // using Capacitor's plugins for iOS/Android
        console.log('Biometric auth triggered');
      } else {
        console.log('Biometric auth not available in web environment');
      }
    } catch (error) {
      console.error('Biometric auth failed:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log('Form submitted with data:', data);
      // Only trigger haptics if we're in a native app
      if (isMobile && window?.Capacitor?.isNativePlatform()) {
        await Haptics.impact({ style: ImpactStyle.Medium });
      }
      console.log('Dispatching login action...');
      const result = await dispatch(login(data)).unwrap();
      console.log('Login result:', result);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="xs">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: '100%',
              borderRadius: 2,
            }}
          >
            <Typography component="h1" variant="h5" align="center" gutterBottom>
              Welcome Back
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                margin="normal"
                fullWidth
                label="Email Address"
                autoComplete="email"
                autoFocus
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                margin="normal"
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              {biometricAvailable && (
                <>
                  <Divider sx={{ my: 2 }}>or</Divider>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<FingerprintIcon />}
                    onClick={handleBiometricAuth}
                  >
                    Sign in with Biometrics
                  </Button>
                </>
              )}

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button
                  color="primary"
                  onClick={() => navigate('/register')}
                  sx={{ textTransform: 'none' }}
                >
                  Don't have an account? Sign Up
                </Button>
              </Box>
            </form>
          </Paper>
        </Box>
      </motion.div>
    </Container>
  );
};

export default Login; 