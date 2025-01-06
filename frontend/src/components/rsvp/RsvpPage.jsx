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
  alpha
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { rsvpService } from '../../services/rsvpService';
import { useDispatch } from 'react-redux';
import { fetchGuests } from '../../features/guests/guestSlice';

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

export default function RsvpPage() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({
    attending: true,
    hasPlusOne: false,
    plusOne: {
      attending: true,
      firstName: '',
      lastName: '',
      email: '',
      responses: {}
    }
  });
  const [guest, setGuest] = useState(null);
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);
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
        
        setGuest(guestResponse.data);
        setFields(fieldsResponse.data);
        
        // Only check for updates if there are existing responses
        const hasResponses = guestResponse.data.responses && guestResponse.data.responses.length > 0;
        setNeedsUpdate(hasResponses && guestResponse.data.needsUpdate);
        setUpdateMessage(guestResponse.data.message);
        
        // Initialize form data with existing responses or defaults
        const initialFormData = {
          // Set attending to true for 'pending' or 'confirmed' status, false for 'declined'
          attending: guestResponse.data.status === 'declined' ? false : true,
          hasPlusOne: guestResponse.data.hasPlusOne || false,
          plusOne: {
            attending: guestResponse.data.plusOneDetails?.attending ?? true,
            firstName: guestResponse.data.plusOneDetails?.firstName ?? '',
            lastName: guestResponse.data.plusOneDetails?.lastName ?? '',
            email: guestResponse.data.plusOneDetails?.email ?? '',
            responses: {}
          }
        };

        // If there are existing responses, add them to the form data
        if (guestResponse.data.responses) {
          guestResponse.data.responses
            .filter(response => response.fieldId !== null && !response.isObsolete)
            .forEach(response => {
              initialFormData[response.fieldId.toString()] = response.value;
            });
        }

        // If there are plus one responses, add them to the form data
        if (guestResponse.data.plusOneDetails?.responses) {
          guestResponse.data.plusOneDetails.responses
            .filter(response => response.fieldId !== null && !response.isObsolete)
            .forEach(response => {
              initialFormData.plusOne.responses[response.fieldId.toString()] = response.value;
            });
        }

        setFormData(initialFormData);
      } catch (err) {
        setError(err.message || 'Failed to load RSVP form');
      } finally {
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
        .map(field => {
          const fieldId = field.id.toString();
          const value = formData[fieldId] ?? '';
          return {
            fieldId: field.id,
            value: String(value)
          };
        }) : [];

      const plusOneResponses = (formData.attending && formData.hasPlusOne && formData.plusOne.attending) ? fields
        .filter(field => field && field.id)
        .map(field => {
          const fieldId = field.id.toString();
          const value = formData.plusOne.responses[fieldId] ?? '';
          return {
            fieldId: field.id,
            value: String(value)
          };
        }) : [];

      const submitData = {
        attending: formData.attending,
        responses,
        plusOne: formData.hasPlusOne ? {
          attending: formData.plusOne.attending,
          firstName: formData.plusOne.firstName,
          lastName: formData.plusOne.lastName,
          email: formData.plusOne.email,
          responses: plusOneResponses
        } : null
      };

      await rsvpService.submitRsvp(token, submitData);

      if (guest?.wedding?.id) {
        dispatch(fetchGuests(guest.wedding.id));
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to submit RSVP');
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
            [fieldId.toString()]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [fieldId.toString()]: value
      }));
    }
  };

  const renderField = (field, isPlusOne = false) => {
    const fieldValue = isPlusOne 
      ? formData.plusOne.responses[field.id] || ''
      : formData[field.id] || '';

    switch (field.type) {
      case 'text':
        return (
          <StyledTextField
            fullWidth
            label={field.label}
            value={fieldValue}
            onChange={(e) => handleFieldChange(field.id, e.target.value, isPlusOne)}
            required={field.required}
            placeholder={field.placeholder}
            helperText={field.helpText}
            sx={{ mb: 2 }}
          />
        );

      case 'textarea':
        return (
          <StyledTextField
            fullWidth
            multiline
            rows={3}
            label={field.label}
            value={fieldValue}
            onChange={(e) => handleFieldChange(field.id, e.target.value, isPlusOne)}
            required={field.required}
            placeholder={field.placeholder}
            helperText={field.helpText}
            sx={{ mb: 2 }}
          />
        );

      case 'select':
        return (
          <StyledFormControl fullWidth required={field.required} sx={{ mb: 2 }}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={fieldValue}
              label={field.label}
              onChange={(e) => handleFieldChange(field.id, e.target.value, isPlusOne)}
            >
              {field.options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {field.helpText && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                {field.helpText}
              </Typography>
            )}
          </StyledFormControl>
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
                    onChange={(e) => handleFieldChange(field.id, e.target.checked, isPlusOne)}
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
              onChange={(e) => handleFieldChange(field.id, e.target.value, isPlusOne)}
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
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <StyledDatePicker
              label={field.label}
              value={fieldValue || null}
              onChange={(value) => handleFieldChange(field.id, value, isPlusOne)}
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

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default'
        }}
      >
        <CircularProgress />
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
          p: 2,
          bgcolor: 'background.default'
        }}
      >
        <StyledCard>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h4" gutterBottom color="primary">
              Thank you!
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              {formData.attending 
                ? formData.hasPlusOne
                  ? `We look forward to celebrating with you and ${formData.plusOne.firstName}!`
                  : 'We look forward to celebrating with you!'
                : "We're sorry you won't be able to join us, but thank you for letting us know."}
            </Typography>
            <Box component="img" src="/celebration.svg" alt="Celebration" sx={{ width: 200, opacity: 0.8 }} />
          </CardContent>
        </StyledCard>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          bgcolor: 'background.default'
        }}
      >
        <StyledCard>
          <CardContent>
            <Alert 
              severity="error"
              sx={{
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  fontSize: '2rem'
                }
              }}
            >
              {error}
            </Alert>
          </CardContent>
        </StyledCard>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 4 },
        bgcolor: 'background.default',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.4) 100%)',
        backgroundSize: 'cover'
      }}
    >
      <StyledCard>
        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Typography 
            variant="h3" 
            align="center" 
            sx={{ 
              mb: 4,
              fontSize: { xs: '2rem', sm: '2.5rem' },
              fontWeight: 700,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px'
            }}
          >
            Wedding RSVP
          </Typography>

          {guest && (
            <Typography 
              variant="h5" 
              color="text.secondary" 
              align="center" 
              sx={{ 
                mb: 4,
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                fontWeight: 500,
                letterSpacing: '-0.3px'
              }}
            >
              Hello {guest.firstName} {guest.lastName}!
            </Typography>
          )}

          {needsUpdate && updateMessage && guest?.responses?.length > 0 && (
            <Alert 
              severity="info" 
              sx={{ 
                mb: 4,
                borderRadius: theme.spacing(1.5),
                backgroundColor: alpha(theme.palette.info.main, 0.08),
                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                '& .MuiAlert-icon': {
                  color: theme.palette.info.main
                }
              }}
            >
              {updateMessage}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <Box 
              sx={{ 
                mb: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1
              }}
            >
              <AttendancePill elevation={0}>
                <Typography 
                  variant="h6"
                  align="center"
                  sx={{ 
                    fontWeight: 600,
                    color: formData.attending ? 'primary.main' : 'text.secondary',
                    transition: 'color 0.3s ease',
                    fontSize: { xs: '1.1rem', sm: '1.2rem' },
                    mb: 0.5
                  }}
                >
                  Will you attend?
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Typography 
                    variant="body1"
                    sx={{ 
                      opacity: !formData.attending ? 1 : 0.5,
                      transition: 'opacity 0.3s ease',
                      fontWeight: 500
                    }}
                  >
                    No
                  </Typography>
                  <StyledSwitch
                    checked={formData.attending}
                    onChange={(e) => handleFieldChange('attending', e.target.checked)}
                    color="primary"
                  />
                  <Typography 
                    variant="body1"
                    sx={{ 
                      opacity: formData.attending ? 1 : 0.5,
                      transition: 'opacity 0.3s ease',
                      fontWeight: 500
                    }}
                  >
                    Yes
                  </Typography>
                </Box>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  align="center"
                  sx={{ 
                    mt: 0.5,
                    fontSize: '0.9rem',
                    fontStyle: 'italic'
                  }}
                >
                  {formData.attending 
                    ? "We're so happy you'll be joining us!" 
                    : "We'll miss you, but we understand"}
                </Typography>
              </AttendancePill>
            </Box>

            {formData.attending && (
              <>
                {Object.entries(
                  fields.reduce((acc, field) => {
                    if (!acc[field.section]) {
                      acc[field.section] = [];
                    }
                    acc[field.section].push(field);
                    return acc;
                  }, {})
                ).map(([section, sectionFields]) => (
                  <SectionPaper key={section} elevation={0}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 2,
                        color: 'primary.main',
                        fontWeight: 'medium'
                      }}
                    >
                      {SECTIONS.find(s => s.value === section)?.label || section}
                    </Typography>
                    <Box sx={{ '& > *': { mb: 2 } }}>
                      {sectionFields.map(field => renderField(field, false))}
                    </Box>
                  </SectionPaper>
                ))}

                {guest?.canBringPlusOne && (
                  <SectionPaper elevation={0}>
                    <Box sx={{ mb: 3 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          mb: 2,
                          color: 'primary.main',
                          fontWeight: 'medium'
                        }}
                      >
                        Additional Guest
                      </Typography>
                      <FormControlLabel
                        control={
                          <StyledSwitch
                            checked={formData.hasPlusOne}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              hasPlusOne: e.target.checked
                            }))}
                          />
                        }
                        label="I'm bringing a guest"
                      />
                    </Box>

                    {formData.hasPlusOne && (
                      <Box sx={{ mt: 2 }}>
                        <Typography 
                          variant="subtitle1" 
                          color="text.secondary"
                          sx={{ mb: 3 }}
                        >
                          Please provide your guest's details
                        </Typography>

                        <Box sx={{ mb: 3 }}>
                          <StyledTextField
                            fullWidth
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
                            sx={{ mb: 2 }}
                          />
                          <StyledTextField
                            fullWidth
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
                            sx={{ mb: 2 }}
                          />
                          <StyledTextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={formData.plusOne.email}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              plusOne: {
                                ...prev.plusOne,
                                email: e.target.value
                              }
                            }))}
                            sx={{ mb: 2 }}
                          />
                        </Box>

                        {Object.entries(
                          fields.reduce((acc, field) => {
                            if (!acc[field.section]) {
                              acc[field.section] = [];
                            }
                            acc[field.section].push(field);
                            return acc;
                          }, {})
                        ).map(([section, sectionFields]) => (
                          <Box key={`plusone-${section}`} sx={{ mb: 3 }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                mb: 2,
                                color: 'primary.main',
                                fontWeight: 'medium'
                              }}
                            >
                              {SECTIONS.find(s => s.value === section)?.label || section}
                            </Typography>
                            <Box sx={{ '& > *': { mb: 2 } }}>
                              {sectionFields.map(field => renderField(field, true))}
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </SectionPaper>
                )}
              </>
            )}

            <StyledButton
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit RSVP'}
            </StyledButton>
          </form>
        </CardContent>
      </StyledCard>
    </Box>
  );
} 