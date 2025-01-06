import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  People as PeopleIcon,
  TableChart as TableChartIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { weddingService } from '../../services/api';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ro', name: 'Romanian' },
];

const WeddingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchWedding = async () => {
      try {
        const response = await weddingService.getWedding(id);
        setWedding(response.wedding);
        setEditData(response.wedding);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch wedding details');
      } finally {
        setLoading(false);
      }
    };

    fetchWedding();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditData(wedding);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const response = await weddingService.updateWedding(id, editData);
      setWedding(response.wedding);
      setEditData(response.wedding);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to update wedding');
    }
  };

  const handleDelete = async () => {
    try {
      await weddingService.deleteWedding(id);
      navigate('/weddings');
    } catch (err) {
      setError(err.message || 'Failed to delete wedding');
      setDeleteDialogOpen(false);
    }
  };

  const handleInputChange = (field) => (event) => {
    setEditData({
      ...editData,
      [field]: event.target.value,
    });
  };

  const handleDateChange = (date) => {
    setEditData({
      ...editData,
      date: date.toISOString(),
    });
  };

  const handleTabChange = (event, newValue) => {
    if (newValue === 'guests') {
      navigate(`/weddings/${id}/guests`);
    } else if (newValue === 'tables') {
      navigate(`/weddings/${id}/tables`);
    } else if (newValue === 'rsvp-form') {
      navigate(`/weddings/${id}/rsvp-form`);
    } else {
      setActiveTab(newValue);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!wedding && !loading) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          Wedding not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mt: 4, mb: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Paper sx={{ p: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Typography variant="h4" component="h1">
                {isEditing ? 'Edit Wedding' : wedding.title}
              </Typography>
              <Box>
                {!isEditing ? (
                  <>
                    <Button
                      startIcon={<EditIcon />}
                      onClick={handleEdit}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      startIcon={<DeleteIcon />}
                      color="error"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      sx={{ mr: 1 }}
                    >
                      Save
                    </Button>
                    <Button
                      startIcon={<CancelIcon />}
                      onClick={handleCancelEdit}
                      color="inherit"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </Box>
            </Box>

            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab
                label="Details"
                value="details"
                icon={<EditIcon />}
                iconPosition="start"
              />
              <Tab
                label="Guests"
                value="guests"
                icon={<PeopleIcon />}
                iconPosition="start"
              />
              <Tab
                label="Tables"
                value="tables"
                icon={<TableChartIcon />}
                iconPosition="start"
              />
              <Tab
                label="RSVP Form"
                value="rsvp-form"
                icon={<EmailIcon />}
                iconPosition="start"
              />
            </Tabs>

            {activeTab === 'details' && (
              <Grid container spacing={3}>
                {isEditing ? (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Title"
                        value={editData.title}
                        onChange={handleInputChange('title')}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description"
                        value={editData.description || ''}
                        onChange={handleInputChange('description')}
                        multiline
                        rows={4}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                          label="Date and Time"
                          value={new Date(editData.date)}
                          onChange={handleDateChange}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Venue"
                        value={editData.venue}
                        onChange={handleInputChange('venue')}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        select
                        label="Language"
                        value={editData.language}
                        onChange={handleInputChange('language')}
                      >
                        {languages.map((language) => (
                          <MenuItem key={language.code} value={language.code}>
                            {language.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="body1" paragraph>
                        {wedding.description || 'No description provided'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" color="textSecondary">
                        Date and Time
                      </Typography>
                      <Typography variant="body1">
                        {new Date(wedding.date).toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" color="textSecondary">
                        Venue
                      </Typography>
                      <Typography variant="body1">{wedding.venue}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" color="textSecondary">
                        Language
                      </Typography>
                      <Typography variant="body1">
                        {languages.find(l => l.code === wedding.language)?.name || wedding.language}
                      </Typography>
                    </Grid>
                  </>
                )}

                {/* Tables Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                    Tables
                  </Typography>
                  <Grid container spacing={2}>
                    {(wedding.tables || []).map((table) => (
                      <Grid item xs={12} sm={6} md={4} key={table.id}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="subtitle1">{table.name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            Capacity: {table.capacity}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                    {(!wedding.tables || wedding.tables.length === 0) && (
                      <Grid item xs={12}>
                        <Typography color="textSecondary">
                          No tables added yet
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Grid>

                {/* Invitations Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                    Invitations
                  </Typography>
                  <Grid container spacing={2}>
                    {(wedding.invitations || []).map((invitation) => (
                      <Grid item xs={12} sm={6} md={4} key={invitation.id}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="subtitle1">{invitation.name}</Typography>
                          <Typography variant="body2">{invitation.email}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            Status: {invitation.status}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                    {(!wedding.invitations || wedding.invitations.length === 0) && (
                      <Grid item xs={12}>
                        <Typography color="textSecondary">
                          No invitations sent yet
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Box>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Wedding</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this wedding? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WeddingDetails; 