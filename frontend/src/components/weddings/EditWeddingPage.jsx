import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Alert,
  Stack,
  alpha,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { parseISO } from 'date-fns';
import weddingService from '../../services/weddingService';
import TextField from '../common/form/TextField';
import TextArea from '../common/form/TextArea';
import Select from '../common/form/Select';

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string(),
  date: yup.date().required('Date is required').min(new Date(), 'Date must be in the future'),
  venue: yup.string().required('Venue is required'),
  language: yup.string().required('Language is required'),
});

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ro', name: 'Romanian' },
].map(lang => ({ value: lang.code, label: lang.name }));

const commonTextFieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    bgcolor: '#FFFFFF',
    minHeight: 44,
    '& fieldset': {
      borderColor: '#E8E3DD',
      borderWidth: '1px',
      transition: 'all 0.2s ease',
    },
    '&:hover fieldset': {
      borderColor: '#D1BFA5',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#D1BFA5',
      borderWidth: '1.5px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#7A6B63',
    fontSize: '0.875rem',
    fontFamily: 'Inter, sans-serif',
    '&.Mui-focused': {
      color: '#D1BFA5',
    },
  },
  '& .MuiInputBase-input': {
    fontSize: '1rem',
    color: '#6A6A6A',
    fontFamily: 'Inter, sans-serif',
    padding: '12px',
  },
  '& .MuiInputBase-inputMultiline': {
    padding: '12px',
  },
};

const SectionTitle = ({ children }) => (
    <Box 
        sx={{ 
            position: 'relative',
            mb: 3,
            mt: { xs: 4, sm: 5 },
            pb: 2,
            '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '1px',
                bgcolor: '#E8E3DD',
            }
        }}
    >
        <Typography 
            variant="h6" 
            sx={{ 
                color: '#5C5C5C',
                fontSize: '1.125rem',
                fontWeight: 600,
                fontFamily: 'Cormorant Garamond, serif',
                bgcolor: '#F5EFEA',
                display: 'inline-block',
                px: 1.5,
                py: 1,
                borderRadius: '6px',
                letterSpacing: '0.02em',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: 'rgba(209, 191, 165, 0.2)',
                }
            }}
        >
            {children}
        </Typography>
    </Box>
);

const EditWeddingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [wedding, setWedding] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    control,
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      date: null,
      venue: '',
      language: 'en',
    },
  });

  useEffect(() => {
    const fetchWedding = async () => {
      try {
        console.log('[EditWeddingPage] Fetching wedding data for ID:', id);
        const response = await weddingService.getWedding(id);
        console.log('[EditWeddingPage] Wedding data received:', response.wedding);
        setWedding(response.wedding);
        
        // Reset form with wedding data
        reset({
          title: response.wedding.title || '',
          description: response.wedding.description || '',
          date: response.wedding.date ? parseISO(response.wedding.date) : null,
          venue: response.wedding.venue || '',
          language: response.wedding.language || 'en',
        });

        if (response.wedding.photoUrl) {
          setPhotoPreview(response.wedding.photoUrl);
        }
      } catch (err) {
        console.error('[EditWeddingPage] Error fetching wedding:', err);
        setError('Failed to load wedding details');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchWedding();
    }
  }, [id, reset]);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoDelete = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      // TODO: Handle photo upload
      const response = await weddingService.updateWedding(id, data);
      navigate(`/weddings/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update wedding');
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      // TODO: Show confirmation dialog
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate(`/weddings/${id}`);
      }
    } else {
      navigate(`/weddings/${id}`);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        Loading...
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAF8F4' }}>
      {/* Header */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          bgcolor: '#FAF8F4',
          borderBottom: '1px solid',
          borderColor: '#E8E3DD',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ 
            px: { xs: 2, sm: 2.5 },
            py: { xs: 2, sm: 2.25 },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton 
              onClick={handleCancel}
              aria-label="Go back"
              sx={{
                color: '#7A6B63',
                width: 40,
                height: 40,
                '&:hover': {
                  bgcolor: alpha('#7A6B63', 0.08),
                },
                '&:active': {
                  transform: 'scale(0.96)',
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: '#7A6B63',
                  fontSize: '0.875rem',
                  mb: 0.5,
                  fontStyle: 'italic',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.01em',
                }}
              >
                Edit
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#5C5C5C',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  lineHeight: 1.2,
                  fontFamily: 'Cormorant Garamond, serif',
                  letterSpacing: '0.02em',
                }}
              >
                Wedding Details
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>

      {/* Main Content */}
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          maxWidth: 800,
          mx: 'auto',
          p: { xs: 2.5, sm: 3 },
          '& > .MuiBox-root': {
            mb: { xs: 4, sm: 5 },
            p: { xs: 2, sm: 2.5 },
            borderRadius: 2,
          },
        }}
      >
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: '#FCA5A5',
            }}
          >
            {error}
          </Alert>
        )}

        {/* Wedding Details Section */}
        <Box>
          <SectionTitle>Wedding Details</SectionTitle>
          <Stack spacing={2.5}>
            <TextField
              label="Wedding Title"
              {...register('title')}
              error={!!errors.title}
              helperText={errors.title?.message}
              required
              value={watch('title')}
              onChange={(e) => setValue('title', e.target.value)}
              sx={commonTextFieldStyles}
            />

            <TextArea
              label="Description"
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description?.message}
              value={watch('description')}
              onChange={(e) => setValue('description', e.target.value)}
              rows={3}
              sx={commonTextFieldStyles}
            />

            <TextField
              label="Venue"
              {...register('venue')}
              error={!!errors.venue}
              helperText={errors.venue?.message}
              required
              value={watch('venue')}
              onChange={(e) => setValue('venue', e.target.value)}
              sx={commonTextFieldStyles}
            />
          </Stack>
        </Box>

        {/* Date and Time Section */}
        <Box>
          <SectionTitle>Date and Time</SectionTitle>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Wedding Date & Time"
              value={watch('date')}
              onChange={(newDate) => setValue('date', newDate)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={!!errors.date}
                  helperText={errors.date?.message}
                  required
                  sx={commonTextFieldStyles}
                />
              )}
              sx={{
                width: '100%',
                '& .MuiPickersDay-root': {
                  color: '#5C5C5C',
                  '&.Mui-selected': {
                    bgcolor: '#E8D9C8',
                    '&:hover': {
                      bgcolor: '#DCC7B0',
                    },
                  },
                },
                '& .MuiClock-pin, & .MuiClockPointer-root': {
                  bgcolor: '#E8D9C8',
                },
                '& .MuiClockPointer-thumb': {
                  border: '16px solid #E8D9C8',
                },
              }}
            />
          </LocalizationProvider>
        </Box>

        {/* Photo Upload Section */}
        <Box>
          <SectionTitle>Wedding Photo</SectionTitle>
          <Box
            sx={{
              border: '2px dashed',
              borderColor: '#E8E3DD',
              borderRadius: 2,
              p: { xs: 3, sm: 4 },
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: '#FFFFFF',
              transition: 'all 0.2s ease-in-out',
              minHeight: { xs: 280, sm: 240 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0px 2px 4px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              '&:hover': {
                borderColor: '#D1BFA5',
                borderStyle: 'solid',
                bgcolor: alpha('#FAF8F4', 0.6),
                transform: 'translateY(-1px)',
                boxShadow: 'inset 0px 2px 4px rgba(0, 0, 0, 0.1), 0px 4px 12px rgba(0, 0, 0, 0.05)',
              },
              '&.dragover': {
                borderColor: '#D1BFA5',
                borderStyle: 'solid',
                bgcolor: alpha('#FAF8F4', 0.8),
                boxShadow: 'inset 0px 2px 8px rgba(0, 0, 0, 0.12)',
              },
            }}
            component="label"
            role="button"
            aria-label="Upload Wedding Photo"
          >
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handlePhotoChange}
            />
            {photoPreview ? (
              <Box 
                sx={{ 
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img
                  src={photoPreview}
                  alt="Wedding preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 300,
                    objectFit: 'contain',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  }}
                />
                <IconButton
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePhotoDelete();
                  }}
                  sx={{
                    position: 'absolute',
                    top: -12,
                    right: -12,
                    bgcolor: '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    border: '1px solid',
                    borderColor: '#E8E3DD',
                    color: '#7A6B63',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: '#FEE2E2',
                      color: '#DC2626',
                      borderColor: '#FCA5A5',
                      transform: 'scale(1.05)',
                    },
                    '&:active': {
                      transform: 'scale(0.95)',
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ) : (
              <Stack alignItems="center" spacing={3}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: alpha('#B0A396', 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1,
                    transition: 'all 0.2s ease',
                    '& svg': {
                      transition: 'transform 0.2s ease',
                    },
                    ':hover': {
                      bgcolor: alpha('#B0A396', 0.15),
                      '& svg': {
                        transform: 'scale(1.1)',
                      },
                    },
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 40, color: '#B0A396' }} />
                </Box>
                <Stack spacing={1} alignItems="center">
                  <Typography 
                    sx={{
                      color: '#5C5C5C',
                      fontSize: '1.125rem',
                      fontWeight: 500,
                      fontFamily: 'Inter, sans-serif',
                      letterSpacing: '0.01em',
                    }}
                  >
                    Upload Wedding Photo
                  </Typography>
                  <Typography 
                    sx={{
                      color: '#7A6B63',
                      fontSize: '0.875rem',
                      fontFamily: 'Inter, sans-serif',
                      maxWidth: '280px',
                      textAlign: 'center',
                      lineHeight: 1.5,
                    }}
                  >
                    Drag and drop to upload or click to select an image
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#8C8279',
                      fontSize: '0.75rem',
                      fontFamily: 'Inter, sans-serif',
                      mt: 0.5,
                    }}
                  >
                    Recommended size: 1200x800 pixels
                  </Typography>
                </Stack>
              </Stack>
            )}
          </Box>
        </Box>

        {/* Settings Section */}
        <Box>
          <SectionTitle>Settings</SectionTitle>
          <Select
            label="Language"
            {...register('language')}
            error={!!errors.language}
            helperText={errors.language?.message}
            options={languages}
            required
            value={watch('language')}
            onChange={(e) => setValue('language', e.target.value)}
            sx={commonTextFieldStyles}
          />
        </Box>

        {/* Bottom Actions */}
        <Box 
          sx={{ 
            display: 'flex', 
            gap: { xs: 1.5, sm: 2 },
            justifyContent: 'flex-end',
            position: 'sticky',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: '#FAF8F4',
            py: { xs: 2, sm: 2.5 },
            px: { xs: 2, sm: 2.5 },
            borderTop: '1px solid',
            borderColor: '#E8E3DD',
            mt: 'auto',
            boxShadow: '0 -2px 4px rgba(0,0,0,0.04)',
            zIndex: 1000,
          }}
        >
          <Button 
            onClick={handleCancel}
            sx={{
              bgcolor: '#FFFFFF',
              border: '1px solid',
              borderColor: '#E8E3DD',
              color: '#5C5C5C',
              fontSize: '0.9375rem',
              px: 4,
              height: { xs: 48, sm: 44 },
              borderRadius: 2,
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              '&:hover': {
                bgcolor: '#F5EFEA',
                borderColor: '#D1BFA5',
                color: '#4A413C',
                transform: 'translateY(-1px)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
              },
              '&:active': {
                transform: 'scale(0.98) translateY(0)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                bgcolor: '#EFE9E4',
              },
              minWidth: { xs: 100, sm: 'auto' },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            sx={{
              bgcolor: '#D1BFA5',
              color: '#FFFFFF',
              px: { xs: 5, sm: 6 },
              height: { xs: 48, sm: 44 },
              fontSize: '0.9375rem',
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: '#C5AE94',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
              },
              '&:active': {
                transform: 'scale(0.98)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                bgcolor: '#B9A288',
              },
              '&.Mui-disabled': {
                bgcolor: alpha('#D1BFA5', 0.6),
                color: '#FFFFFF',
              },
              minWidth: { xs: 140, sm: 'auto' },
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EditWeddingPage; 