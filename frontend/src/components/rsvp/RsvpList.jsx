import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Stack,
  Alert,
  alpha,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as PendingIcon,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import api from '../../services/api';
import RsvpForm from './RsvpForm';

const getStatusIcon = (status) => {
  switch (status) {
    case 'attending':
      return <CheckCircleIcon sx={{ color: '#4CAF50' }} />;
    case 'not_attending':
      return <CancelIcon sx={{ color: '#F44336' }} />;
    default:
      return <PendingIcon sx={{ color: '#FFA726' }} />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'attending':
      return '#4CAF50';
    case 'not_attending':
      return '#F44336';
    default:
      return '#FFA726';
  }
};

const RsvpList = ({ weddingId, searchQuery, activeFilters, setActiveFilters, isAddModalOpen, onCloseAddModal }) => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchFields();
  }, [weddingId, searchQuery]);

  const fetchFields = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/weddings/${weddingId}/rsvp-form`);
      setFields(response.data.data || []);
    } catch (err) {
      setError('Failed to load form fields');
    } finally {
      setLoading(false);
    }
  };

  const handleEditField = (field) => {
    setEditingField(field);
  };

  const handleCloseEdit = () => {
    setEditingField(null);
  };

  const handleFieldUpdated = () => {
    fetchFields();
    handleCloseEdit();
  };

  const handleDeleteField = async (fieldId) => {
    try {
      await api.delete(`/weddings/${weddingId}/rsvp-form/${fieldId}`);
      fetchFields();
    } catch (err) {
      setError('Failed to delete field');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Loading form fields...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {fields.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            No form fields yet. Click the add button to create your first field.
          </Typography>
        </Box>
      ) : (
        <Stack spacing={2}>
          {fields.map((field) => (
            <Paper
              key={field.id}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: '#FFFFFF',
                transition: 'all 0.3s ease',
                border: '1px solid',
                borderColor: '#E8E3DD',
                '&:hover': {
                  borderColor: '#D8C5AD',
                  transform: 'translateY(-1px)',
                  boxShadow: `0 4px 12px ${alpha('#E8E3DD', 0.25)}`,
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: '#5C5C5C',
                      mb: 0.5,
                    }}
                  >
                    {field.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#8F8F8F',
                      fontSize: '0.875rem',
                    }}
                  >
                    Type: {field.type}
                    {field.required && ' • Required'}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <IconButton
                    size="small"
                    onClick={() => handleEditField(field)}
                    sx={{
                      color: '#7A6F63',
                      '&:hover': {
                        bgcolor: alpha('#7A6F63', 0.08),
                      },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteField(field.id)}
                    sx={{
                      color: '#DC3545',
                      '&:hover': {
                        bgcolor: alpha('#DC3545', 0.08),
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      <RsvpForm
        open={isAddModalOpen || !!editingField}
        onClose={() => {
          if (editingField) {
            handleCloseEdit();
          } else {
            onCloseAddModal();
          }
        }}
        onSave={handleFieldUpdated}
        weddingId={weddingId}
        field={editingField}
      />
    </Box>
  );
};

export default RsvpList; 