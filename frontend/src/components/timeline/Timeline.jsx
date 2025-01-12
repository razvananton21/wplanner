import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Alert,
  Stack,
  Divider,
  alpha,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  PhotoCamera as PhotoIcon,
  Restaurant as DiningIcon,
  Celebration as CelebrationIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import timelineService from '../../services/timelineService';
import { useTheme } from '@mui/material/styles';

const eventTypes = [
  { value: 'ceremony', label: 'Ceremony', icon: CelebrationIcon },
  { value: 'photo', label: 'Photo Session', icon: PhotoIcon },
  { value: 'dining', label: 'Dining', icon: DiningIcon },
  { value: 'activity', label: 'Activity', icon: EventIcon },
  { value: 'gathering', label: 'Gathering', icon: PeopleIcon },
];

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

const Timeline = ({ weddingId }) => {
  const theme = useTheme();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: null,
    endTime: null,
    type: 'activity',
  });

  useEffect(() => {
    fetchEvents();
  }, [weddingId]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await timelineService.getTimelineEvents(weddingId);
      setEvents(response.events);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load timeline events');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        description: event.description || '',
        startTime: new Date(event.startTime),
        endTime: event.endTime ? new Date(event.endTime) : null,
        type: event.type,
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        description: '',
        startTime: null,
        endTime: null,
        type: 'activity',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      startTime: null,
      endTime: null,
      type: 'activity',
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingEvent) {
        await timelineService.updateTimelineEvent(weddingId, editingEvent.id, formData);
      } else {
        await timelineService.createTimelineEvent(weddingId, formData);
      }
      await fetchEvents();
      handleCloseDialog();
    } catch (err) {
      setError(err.message || 'Failed to save timeline event');
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await timelineService.deleteTimelineEvent(weddingId, eventId);
      await fetchEvents();
    } catch (err) {
      setError(err.message || 'Failed to delete timeline event');
    }
  };

  const getEventIcon = (type) => {
    const eventType = eventTypes.find(t => t.value === type);
    const Icon = eventType?.icon || EventIcon;
    return <Icon />;
  };

  return (
    <Box>
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: '12px',
            border: '1px solid',
            borderColor: 'error.light',
          }} 
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      <Stack spacing={2}>
        {events.map((event, index) => (
          <Paper 
            key={event.id} 
            sx={{ 
              p: 3, 
              position: 'relative',
              borderRadius: '16px',
              bgcolor: '#FFFFFF',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)',
              border: '1px solid',
              borderColor: '#E8E3DD',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                borderColor: '#DED9D2',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: '12px', 
                bgcolor: alpha('#D1BFA5', 0.1),
                color: '#D1BFA5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: alpha('#D1BFA5', 0.15),
                },
              }}>
                {getEventIcon(event.type)}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    color: '#5C5C5C',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    fontFamily: 'Cormorant Garamond, serif',
                  }}
                >
                  {event.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  gutterBottom
                  sx={{
                    fontSize: '0.9rem',
                    color: '#8F8F8F',
                    mb: 1,
                  }}
                >
                  {format(new Date(event.startTime), 'MMM d, yyyy h:mm a')}
                  {event.endTime && ` - ${format(new Date(event.endTime), 'h:mm a')}`}
                </Typography>
                {event.description && (
                  <Typography 
                    variant="body1"
                    sx={{
                      color: '#666666',
                      fontSize: '0.95rem',
                      lineHeight: 1.5,
                    }}
                  >
                    {event.description}
                  </Typography>
                )}
              </Box>
              <Box>
                <IconButton 
                  onClick={() => handleOpenDialog(event)} 
                  size="small"
                  sx={{
                    color: '#B0A396',
                    '&:hover': {
                      bgcolor: alpha('#B0A396', 0.1),
                    },
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  onClick={() => handleDelete(event.id)} 
                  size="small" 
                  color="error"
                  sx={{
                    '&:hover': {
                      bgcolor: alpha('#d32f2f', 0.1),
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
            {index < events.length - 1 && (
              <Divider 
                sx={{ 
                  mt: 2,
                  borderColor: '#E8E3DD',
                }} 
              />
            )}
          </Paper>
        ))}

        {!loading && events.length === 0 && (
          <Paper 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              borderRadius: '16px',
              bgcolor: '#FFFFFF',
              border: '1px dashed',
              borderColor: '#E8E3DD',
            }}
          >
            <Typography 
              color="text.secondary"
              sx={{
                color: '#8F8F8F',
                fontSize: '0.95rem',
                fontStyle: 'italic',
              }}
            >
              No timeline events yet. Click "Add Event" to create one.
            </Typography>
          </Paper>
        )}
      </Stack>

      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            bgcolor: '#FFFFFF',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{
          color: '#5C5C5C',
          fontSize: '1.25rem',
          fontWeight: 600,
          fontFamily: 'Cormorant Garamond, serif',
          borderBottom: '1px solid #E8E3DD',
          pb: 2,
        }}>
          {editingEvent ? 'Edit Event' : 'Add Event'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Title"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#FAFAFA',
                  '&:hover fieldset': {
                    borderColor: '#D1BFA5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#D1BFA5',
                  },
                },
              }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#FAFAFA',
                  '&:hover fieldset': {
                    borderColor: '#D1BFA5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#D1BFA5',
                  },
                },
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Start Time"
                value={formData.startTime}
                onChange={(date) => setFormData({ ...formData, startTime: date })}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#FAFAFA',
                        '&:hover fieldset': {
                          borderColor: '#D1BFA5',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#D1BFA5',
                        },
                      },
                    }}
                  />
                )}
              />
              <DateTimePicker
                label="End Time (Optional)"
                value={formData.endTime}
                onChange={(date) => setFormData({ ...formData, endTime: date })}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#FAFAFA',
                        '&:hover fieldset': {
                          borderColor: '#D1BFA5',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#D1BFA5',
                        },
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
            <TextField
              select
              label="Event Type"
              fullWidth
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#FAFAFA',
                  '&:hover fieldset': {
                    borderColor: '#D1BFA5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#D1BFA5',
                  },
                },
              }}
            >
              {eventTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <type.icon sx={{ color: '#D1BFA5' }} />
                    {type.label}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #E8E3DD' }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{
              color: '#8F8F8F',
              '&:hover': {
                bgcolor: alpha('#8F8F8F', 0.08),
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{
              bgcolor: '#D1BFA5',
              color: '#FFFFFF',
              '&:hover': {
                bgcolor: '#C1AF95',
              },
            }}
          >
            {editingEvent ? 'Save Changes' : 'Add Event'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Timeline; 