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

const eventTypes = [
  { value: 'ceremony', label: 'Ceremony', icon: CelebrationIcon },
  { value: 'photo', label: 'Photo Session', icon: PhotoIcon },
  { value: 'dining', label: 'Dining', icon: DiningIcon },
  { value: 'activity', label: 'Activity', icon: EventIcon },
  { value: 'gathering', label: 'Gathering', icon: PeopleIcon },
];

const Timeline = ({ weddingId }) => {
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
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h2">
          Timeline
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Event
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Stack spacing={2}>
        {events.map((event, index) => (
          <Paper key={event.id} sx={{ p: 3, position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Box sx={{ 
                p: 1, 
                borderRadius: 1, 
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {getEventIcon(event.type)}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {format(new Date(event.startTime), 'MMM d, yyyy h:mm a')}
                  {event.endTime && ` - ${format(new Date(event.endTime), 'h:mm a')}`}
                </Typography>
                {event.description && (
                  <Typography variant="body1">
                    {event.description}
                  </Typography>
                )}
              </Box>
              <Box>
                <IconButton onClick={() => handleOpenDialog(event)} size="small">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(event.id)} size="small" color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
            {index < events.length - 1 && <Divider sx={{ mt: 2 }} />}
          </Paper>
        ))}

        {!loading && events.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No timeline events yet. Click "Add Event" to create one.
            </Typography>
          </Paper>
        )}
      </Stack>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingEvent ? 'Edit Event' : 'Add Event'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Title"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Start Time"
                value={formData.startTime}
                onChange={(date) => setFormData({ ...formData, startTime: date })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              <DateTimePicker
                label="End Time (Optional)"
                value={formData.endTime}
                onChange={(date) => setFormData({ ...formData, endTime: date })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
            <TextField
              select
              label="Event Type"
              fullWidth
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              {eventTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <type.icon />
                    {type.label}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingEvent ? 'Save Changes' : 'Add Event'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Timeline; 