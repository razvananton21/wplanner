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
  Alert,
  Grid,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { register as registerUser, clearError } from '../../store/slices/authSlice';
import { commonTextFieldStyles } from '../../components/layout/styles';
import TextField from '../../components/common/form/TextField';

// Capacitor plugins
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

const Register = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
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
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
      if (isMobile) {
        await Haptics.impact({ style: ImpactStyle.Medium });
      }
      
      const { confirmPassword, ...registrationData } = data;
      const result = await dispatch(registerUser(registrationData)).unwrap();
      
      // Show success message and navigate to login
      dispatch(clearError());
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleTogglePassword = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
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
        Create Account
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              autoFocus
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              sx={commonTextFieldStyles}
              {...register('firstName')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              sx={commonTextFieldStyles}
              {...register('lastName')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email Address"
              type="email"
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={commonTextFieldStyles}
              {...register('email')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={commonTextFieldStyles}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleTogglePassword('password')}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register('password')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              sx={commonTextFieldStyles}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleTogglePassword('confirm')}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register('confirmPassword')}
            />
          </Grid>
        </Grid>

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
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Button>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            color="primary"
            onClick={() => navigate('/login')}
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
            Already have an account? Sign In
          </Button>
        </Box>
      </form>
    </>
  );
};

export default Register; 