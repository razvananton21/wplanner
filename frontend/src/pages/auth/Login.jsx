import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Typography,
  Button,
  IconButton,
  InputAdornment,
  Divider,
  Alert,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Fingerprint as FingerprintIcon,
} from '@mui/icons-material';
import { login, clearError } from '../../store/slices/authSlice';
import { commonTextFieldStyles } from '../../components/layout/styles';
import GoogleOAuthButton from '../../components/auth/GoogleOAuthButton';
import TextField from '../../components/common/form/TextField';

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
  const { loading, error: reduxError, isAuthenticated } = useSelector((state) => state.auth);
  const [loginError, setLoginError] = useState('');

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

  useEffect(() => {
    if (reduxError && reduxError !== 'No token found') {
      setLoginError(reduxError);
    }
  }, [reduxError]);

  const handleBiometricAuth = async () => {
    try {
      if (window?.Capacitor?.isNativePlatform()) {
        await Haptics.impact({ style: ImpactStyle.Light });
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
      if (isMobile && window?.Capacitor?.isNativePlatform()) {
        await Haptics.impact({ style: ImpactStyle.Medium });
      }
      const result = await dispatch(login(data)).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Typography 
        component="h1" 
        variant="h5" 
        align="center" 
        gutterBottom
        sx={{ 
          color: '#5C5C5C',
          fontSize: '1.5rem',
          fontWeight: 600,
          fontFamily: 'Cormorant Garamond, serif',
          mb: 3
        }}
      >
        Welcome Back
      </Typography>

      {loginError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setLoginError('')}>
          {loginError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Email Address"
          type="email"
          autoComplete="email"
          autoFocus
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={commonTextFieldStyles}
          {...register('email')}
        />

        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          error={!!errors.password}
          helperText={errors.password?.message}
          sx={commonTextFieldStyles}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          {...register('password')}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            bgcolor: '#D1BFA5',
            color: '#FFFFFF',
            height: 44,
            borderRadius: '8px',
            textTransform: 'none',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.9375rem',
            fontWeight: 500,
            '&:hover': {
              bgcolor: '#7A6B63',
            },
          }}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <Divider 
        sx={{ 
          my: 2,
          '&::before, &::after': {
            borderColor: '#E8E3DD',
          },
          '& .MuiDivider-wrapper': {
            color: '#7A6B63',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
          }
        }}
      >
        OR
      </Divider>

      <GoogleOAuthButton />

      {biometricAvailable && (
        <>
          <Divider 
            sx={{ 
              my: 2,
              '&::before, &::after': {
                borderColor: '#E8E3DD',
              },
              '& .MuiDivider-wrapper': {
                color: '#7A6B63',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
              }
            }}
          >
            or
          </Divider>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<FingerprintIcon />}
            onClick={handleBiometricAuth}
            sx={{
              borderColor: '#D1BFA5',
              color: '#7A6B63',
              height: 44,
              borderRadius: '8px',
              textTransform: 'none',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.9375rem',
              fontWeight: 500,
              '&:hover': {
                borderColor: '#7A6B63',
                bgcolor: 'transparent',
              },
            }}
          >
            Sign in with Biometrics
          </Button>
        </>
      )}

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button
          color="primary"
          onClick={() => navigate('/register')}
          sx={{
            textTransform: 'none',
            color: '#7A6B63',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            '&:hover': {
              bgcolor: 'transparent',
              color: '#D1BFA5',
            },
          }}
        >
          Don't have an account? Sign Up
        </Button>
      </Box>
    </>
  );
};

export default Login; 