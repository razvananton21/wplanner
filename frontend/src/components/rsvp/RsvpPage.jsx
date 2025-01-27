import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  TextField,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormGroup,
  FormLabel,
  Paper,
  styled,
  useTheme,
  alpha,
  Stack,
  ButtonGroup,
  Fade,
  IconButton,
  Fab,
  Zoom
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { rsvpService } from '../../services/rsvpService';
import { useDispatch } from 'react-redux';
import { fetchGuests } from '../../features/guests/guestSlice';
import InvitationViewer from '../invitation/InvitationViewer';
import TextArea from '../common/form/TextArea';
import { 
  Download as DownloadIcon, 
  HowToReg as HowToRegIcon, 
  ArrowBack as ArrowBackIcon 
} from '@mui/icons-material';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  width: '100%',
  borderRadius: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  [theme.breakpoints.down('sm')]: {
    borderRadius: theme.spacing(2),
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1.5),
    transition: 'all 0.2s',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.95rem',
    fontWeight: 500
  }
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1.5),
    transition: 'all 0.2s',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    }
  },
  '& .MuiFormLabel-root': {
    fontSize: '0.95rem',
    fontWeight: 500,
    color: theme.palette.text.secondary,
    '&.Mui-focused': {
      color: theme.palette.primary.main
    }
  }
}));

const StyledSwitch = styled(Switch)(({ theme }) => ({
  width: 60,
  height: 34,
  padding: 0,
  margin: theme.spacing(1),
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(26px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      border: '6px solid #fff',
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 30,
    height: 30,
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  '& .MuiSwitch-track': {
    borderRadius: 34 / 2,
    backgroundColor: theme.palette.grey[400],
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  padding: '14px 28px',
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'
  },
  '&:active': {
    transform: 'translateY(1px)'
  }
}));

const SectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(8px)',
  marginBottom: theme.spacing(3),
  transition: 'all 0.2s ease',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  }
}));

const SECTIONS = [
  { value: 'general', label: 'General Information' },
  { value: 'dietary', label: 'Dietary Requirements' },
  { value: 'preferences', label: 'Preferences' },
];

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1.5),
    transition: 'all 0.2s',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }
  }
}));

const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08)
  },
  '&.Mui-checked': {
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.12)
    }
  }
}));

const StyledRadio = styled(Radio)(({ theme }) => ({
  padding: theme.spacing(1),
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08)
  },
  '&.Mui-checked': {
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.12)
    }
  }
}));

const AttendancePill = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(3),
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(8px)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  border: '1px solid',
  borderColor: alpha(theme.palette.primary.main, 0.1),
  transition: 'all 0.3s ease',
  marginBottom: theme.spacing(4),
  width: '100%',
  maxWidth: 300,
  margin: '0 auto',
  marginBottom: theme.spacing(4),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-2px)'
  }
}));

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
  <Typography 
    variant="h6" 
    sx={{ 
      color: '#7A6B63',
      fontFamily: 'Cormorant Garamond, serif',
      fontSize: { xs: '1.125rem', sm: '1.25rem' },
      mb: 2.5
    }}
  >
    {children}
  </Typography>
);

export default function RsvpPage() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({
    attending: true,
    hasPlusOne: false,
    plusOneAttending: false,
    plusOne: {
      firstName: '',
      lastName: '',
      email: '',
      dietaryRestrictions: '',
      responses: {}
    },
    responses: {},
    dietaryRestrictions: ''
  });
  const [guest, setGuest] = useState(null);
  const [showRsvpForm, setShowRsvpForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfUrl, setPdfUrl] = useState(null);
  const dispatch = useDispatch();

  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [guestResponse, fieldsResponse] = await Promise.all([
          rsvpService.getGuest(token),
          rsvpService.getFields(token)
        ]);

        setFields(fieldsResponse.data || []);
        const guestData = guestResponse.data;
        setGuest(guestData);

        setFormData(prev => ({
          ...prev,
          attending: guestData.status !== 'declined',
          hasPlusOne: guestData.canBringPlusOne || false,
          plusOneAttending: guestData.plusOneDetails?.attending || false,
          plusOne: {
            firstName: guestData.plusOneDetails?.firstName || '',
            lastName: guestData.plusOneDetails?.lastName || '',
            email: guestData.plusOneDetails?.email || '',
            dietaryRestrictions: guestData.plusOneDetails?.dietaryRestrictions || '',
            responses: guestData.plusOneDetails?.responses || {}
          },
          responses: guestData.responses || {},
          dietaryRestrictions: guestData.dietaryRestrictions || ''
        }));

        if (guestData.wedding?.invitationPdfUrl) {
          console.log('Setting PDF URL:', guestData.wedding.invitationPdfUrl);
          setPdfUrl(guestData.wedding.invitationPdfUrl);
        } else {
          setShowRsvpForm(true);
          console.warn('No invitation PDF URL found in guest data');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching RSVP form:', err);
        setError('Failed to load RSVP form. Please try again later.');
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const responses = formData.attending ? fields
        .filter(field => field && field.id)
        .map(field => ({
          fieldId: field.id,
          value: formData.responses[field.id.toString()] || ''
        })) : [];

      const plusOneResponses = (formData.attending && formData.hasPlusOne && formData.plusOneAttending) ? fields
        .filter(field => field && field.id && !field.excludeFromPlusOne)
        .map(field => ({
          fieldId: field.id,
          value: formData.plusOne.responses[field.id.toString()] || ''
        })) : [];

      const submitData = {
        attending: formData.attending === 'true' || formData.attending === true,
        responses,
        plusOne: formData.plusOneAttending ? {
          attending: true,
          firstName: formData.plusOne.firstName,
          lastName: formData.plusOne.lastName,
          email: formData.plusOne.email || null,
          dietaryRestrictions: formData.plusOne.dietaryRestrictions || '',
          responses: plusOneResponses
        } : null,
        dietaryRestrictions: formData.dietaryRestrictions || ''
      };

      console.log('Submitting RSVP data:', submitData);
      await rsvpService.submitRsvp(token, submitData);

      if (guest?.wedding?.id) {
        dispatch(fetchGuests(guest.wedding.id));
      }

      setSuccess(true);
    } catch (err) {
      console.error('Error submitting RSVP:', err);
      setError(err.response?.data?.detail || 'Failed to submit RSVP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (fieldId, value, isPlusOne = false) => {
    if (isPlusOne) {
      setFormData(prev => ({
        ...prev,
        plusOne: {
          ...prev.plusOne,
          responses: {
            ...prev.plusOne.responses,
            [fieldId]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        responses: {
          ...prev.responses,
          [fieldId]: value
        }
      }));
    }
  };

  const renderField = (field, isPlusOne = false) => {
    if (!field || !field.id) return null;

    const fieldId = field.id.toString();
    const fieldValue = isPlusOne 
      ? formData.plusOne.responses[fieldId] 
      : formData.responses[fieldId];

    switch (field.type?.toLowerCase()) {
      case 'text':
        return (
          <StyledTextField
            key={fieldId}
            label={field.label}
            value={fieldValue || ''}
            onChange={(e) => handleFieldChange(fieldId, e.target.value, isPlusOne)}
            required={field.required}
            helperText={field.helpText}
            fullWidth
          />
        );

      case 'textarea':
        return (
          <TextArea
            key={fieldId}
            label={field.label}
            value={fieldValue || ''}
            onChange={(e) => handleFieldChange(fieldId, e.target.value, isPlusOne)}
            required={field.required}
            helperText={field.helpText}
            fullWidth
            multiline
            rows={4}
            sx={commonTextFieldStyles}
          />
        );

      case 'select':
        return (
          <StyledFormControl key={fieldId} fullWidth>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={fieldValue || ''}
              onChange={(e) => handleFieldChange(fieldId, e.target.value, isPlusOne)}
              label={field.label}
              required={field.required}
            >
              {(field.options || []).map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>
        );

      case 'switch':
        return (
          <Switch
            key={`${fieldId}${isPlusOne ? '-plusone' : ''}`}
            label={field.label}
            checked={fieldValue || false}
            onChange={(e) => handleFieldChange(fieldId, e.target.checked, isPlusOne)}
          />
        );

      case 'checkbox':
        return (
          <FormControl 
            component="fieldset" 
            required={field.required}
            sx={{ 
              mb: 2,
              width: '100%'
            }}
          >
            <FormLabel 
              component="legend" 
              sx={{ 
                mb: 2,
                color: 'primary.main',
                fontSize: '0.95rem',
                fontWeight: 500
              }}
            >
              {field.label}
            </FormLabel>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }
              }}
            >
              <FormControlLabel
                control={
                  <StyledCheckbox
                    checked={fieldValue || false}
                    onChange={(e) => handleFieldChange(fieldId, e.target.checked, isPlusOne)}
                    sx={{
                      color: theme.palette.text.secondary,
                      '&.Mui-checked': {
                        color: theme.palette.primary.main
                      }
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontWeight: 500 }}>
                    Yes
                  </Typography>
                }
              />
            </Paper>
            {field.helpText && (
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  mt: 1,
                  display: 'block',
                  fontStyle: 'italic'
                }}
              >
                {field.helpText}
              </Typography>
            )}
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl 
            component="fieldset"
            required={field.required}
            sx={{ 
              mb: 2,
              width: '100%'
            }}
          >
            <FormLabel 
              component="legend" 
              sx={{ 
                mb: 2,
                color: 'primary.main',
                fontSize: '0.95rem',
                fontWeight: 500
              }}
            >
              {field.label}
            </FormLabel>
            <RadioGroup
              value={fieldValue}
              onChange={(e) => handleFieldChange(fieldId, e.target.value, isPlusOne)}
              sx={{
                gap: 1.5
              }}
            >
              {field.options?.map((option) => (
                <Paper
                  key={option}
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: fieldValue === option ? 'primary.main' : 'divider',
                    backgroundColor: fieldValue === option 
                      ? alpha(theme.palette.primary.main, 0.04)
                      : 'rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: fieldValue === option 
                        ? alpha(theme.palette.primary.main, 0.08)
                        : 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                    }
                  }}
                >
                  <FormControlLabel
                    value={option}
                    control={
                      <StyledRadio 
                        sx={{
                          color: theme.palette.text.secondary,
                          '&.Mui-checked': {
                            color: theme.palette.primary.main
                          }
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontWeight: 500 }}>
                        {option}
                      </Typography>
                    }
                    sx={{ 
                      m: 0,
                      width: '100%',
                      py: 1.5,
                      px: 2
                    }}
                  />
                </Paper>
              ))}
            </RadioGroup>
            {field.helpText && (
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  mt: 1,
                  display: 'block',
                  fontStyle: 'italic'
                }}
              >
                {field.helpText}
              </Typography>
            )}
          </FormControl>
        );

      case 'date':
        return (
          <LocalizationProvider key={fieldId} dateAdapter={AdapterDateFns}>
            <StyledDatePicker
              label={field.label}
              value={fieldValue || null}
              onChange={(value) => handleFieldChange(fieldId, value, isPlusOne)}
              slotProps={{
                textField: {
                  required: field.required,
                  helperText: field.helpText,
                  sx: { mb: 2 },
                  fullWidth: true
                }
              }}
            />
          </LocalizationProvider>
        );

      default:
        return null;
    }
  };

  const handlePageClick = () => {
    setCurrentPage(prev => (prev + 1) % totalPages);
  };

  const handlePdfLoad = ({ numPages }) => {
    setTotalPages(numPages);
  };

  const handleDownloadPdf = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (success) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#FAF8F4',
          p: 3
        }}
      >
        <Box 
          sx={{ 
            maxWidth: 600,
            width: '100%',
            textAlign: 'center',
            p: { xs: 3, sm: 4 },
            bgcolor: '#FFFFFF',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#7A6B63',
              fontFamily: 'Cormorant Garamond, serif',
              mb: 2
            }}
          >
            Thank You!
          </Typography>
          <Typography sx={{ color: '#6A6A6A', mb: 3 }}>
            Your RSVP has been successfully submitted.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: { xs: 2, sm: 3 },
      position: 'relative',
      bgcolor: '#FAF8F4'
    }}>
      {showRsvpForm && pdfUrl && (
        <Fab
          color="primary"
          aria-label="back"
          onClick={() => setShowRsvpForm(false)}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            bgcolor: '#D1BFA5',
            '&:hover': {
              bgcolor: alpha('#D1BFA5', 0.9)
            }
          }}
        >
          <ArrowBackIcon />
        </Fab>
      )}

      {!showRsvpForm && pdfUrl ? (
        <>
          <Box sx={{ 
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <InvitationViewer pdfUrl={pdfUrl} />
          </Box>

          {/* Floating Action Buttons */}
          <Box
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Zoom in={true} style={{ transitionDelay: '200ms' }}>
              <Fab
                color="primary"
                aria-label="download"
                onClick={handleDownloadPdf}
                sx={{
                  bgcolor: '#D1BFA5',
                  '&:hover': {
                    bgcolor: alpha('#D1BFA5', 0.9)
                  }
                }}
              >
                <DownloadIcon />
              </Fab>
            </Zoom>
            <Zoom in={true} style={{ transitionDelay: '300ms' }}>
              <Fab
                color="primary"
                aria-label="rsvp"
                onClick={() => setShowRsvpForm(true)}
                sx={{
                  bgcolor: '#D1BFA5',
                  '&:hover': {
                    bgcolor: alpha('#D1BFA5', 0.9)
                  }
                }}
              >
                <HowToRegIcon />
              </Fab>
            </Zoom>
          </Box>
        </>
      ) : (
        <StyledCard>
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom align="center" 
              sx={{ 
                fontFamily: 'Cormorant Garamond, serif',
                color: '#7A6B63',
                mb: 4
              }}>
              Wedding RSVP
            </Typography>
            
            <Fade in={showRsvpForm || !pdfUrl}>
              <Box 
                component="form" 
                onSubmit={handleSubmit}
                sx={{ 
                  maxWidth: 800,
                  mx: 'auto',
                  bgcolor: '#FFFFFF',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    bgcolor: '#FAF8F4',
                    borderBottom: '1px solid',
                    borderColor: '#E8E3DD',
                    p: { xs: 2.5, sm: 3 },
                    textAlign: 'center'
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      color: '#7A6B63',
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: { xs: '1.75rem', sm: '2.25rem' },
                      mb: 1
                    }}
                  >
                    Wedding RSVP
                  </Typography>
                  <Typography
                    sx={{
                      color: '#6A6A6A',
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    Please fill out this form to confirm your attendance
                  </Typography>
                </Box>

                <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
                  <Stack spacing={4}>
                    <Box>
                      <SectionTitle>Will you be attending?</SectionTitle>
                      <FormControl required>
                        <RadioGroup
                          value={formData.attending}
                          onChange={(e) => {
                            const attending = e.target.value === 'true';
                            setFormData(prev => ({
                              ...prev,
                              attending: e.target.value,
                              plusOneAttending: attending ? prev.plusOneAttending : false
                            }));
                          }}
                        >
                          <FormControlLabel 
                            value="true"
                            control={
                              <Radio 
                                sx={{
                                  color: '#D1BFA5',
                                  '&.Mui-checked': {
                                    color: '#D1BFA5',
                                  },
                                }}
                              />
                            }
                            label="Yes, I'll be there!"
                          />
                          <FormControlLabel
                            value="false"
                            control={
                              <Radio 
                                sx={{
                                  color: '#D1BFA5',
                                  '&.Mui-checked': {
                                    color: '#D1BFA5',
                                  },
                                }}
                              />
                            }
                            label="No, I can't make it"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Box>

                    {(formData.attending === 'true' || formData.attending === true) && (
                      <>
                        <Box>
                          <SectionTitle>Your Information</SectionTitle>
                          <Stack spacing={2.5}>
                            {fields.map(field => renderField(field))}
                          </Stack>
                        </Box>

                        {formData.hasPlusOne && (
                          <Box>
                            <SectionTitle>Plus One</SectionTitle>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                mb: 3,
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: formData.plusOneAttending ? 'primary.main' : 'divider',
                                backgroundColor: formData.plusOneAttending 
                                  ? alpha('#D1BFA5', 0.04)
                                  : 'rgba(255, 255, 255, 0.8)',
                                transition: 'all 0.2s',
                                '&:hover': {
                                  backgroundColor: formData.plusOneAttending 
                                    ? alpha('#D1BFA5', 0.08)
                                    : 'rgba(255, 255, 255, 0.9)',
                                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                                }
                              }}
                            >
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={formData.plusOneAttending}
                                    onChange={(e) => setFormData(prev => ({
                                      ...prev,
                                      plusOneAttending: e.target.checked
                                    }))}
                                    sx={{
                                      color: '#D1BFA5',
                                      '&.Mui-checked': {
                                        color: '#D1BFA5',
                                      },
                                    }}
                                  />
                                }
                                label="I'm bringing a plus one"
                              />
                            </Paper>

                            {formData.plusOneAttending && (
                              <Stack spacing={2.5}>
                                <StyledTextField
                                  label="First Name"
                                  value={formData.plusOne.firstName}
                                  onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    plusOne: {
                                      ...prev.plusOne,
                                      firstName: e.target.value
                                    }
                                  }))}
                                  required
                                  fullWidth
                                />
                                <StyledTextField
                                  label="Last Name"
                                  value={formData.plusOne.lastName}
                                  onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    plusOne: {
                                      ...prev.plusOne,
                                      lastName: e.target.value
                                    }
                                  }))}
                                  required
                                  fullWidth
                                />
                                <StyledTextField
                                  label="Email"
                                  value={formData.plusOne.email}
                                  onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    plusOne: {
                                      ...prev.plusOne,
                                      email: e.target.value
                                    }
                                  }))}
                                  fullWidth
                                />
                                <TextArea
                                  label="Dietary Restrictions"
                                  value={formData.plusOne.dietaryRestrictions}
                                  onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    plusOne: {
                                      ...prev.plusOne,
                                      dietaryRestrictions: e.target.value
                                    }
                                  }))}
                                  fullWidth
                                  multiline
                                  rows={4}
                                  sx={commonTextFieldStyles}
                                />
                                {fields
                                  .filter(field => !field.excludeFromPlusOne)
                                  .map(field => renderField(field, true))
                                }
                              </Stack>
                            )}
                          </Box>
                        )}
                      </>
                    )}
                  </Stack>

                  <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading || (formData.plusOneAttending && (!formData.plusOne.firstName || !formData.plusOne.lastName))}
                      sx={{
                        bgcolor: '#D1BFA5',
                        color: '#FFFFFF',
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        '&:hover': {
                          bgcolor: '#7A6B63',
                        },
                        '&.Mui-disabled': {
                          bgcolor: alpha('#D1BFA5', 0.5),
                          color: 'white'
                        }
                      }}
                    >
                      {loading ? 'Submitting...' : 'Submit RSVP'}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Fade>
          </CardContent>
        </StyledCard>
      )}
    </Box>
  );
} 