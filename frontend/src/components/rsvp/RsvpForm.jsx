import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  IconButton,
  Alert,
  Stack,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import api from '../../services/api';

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'select', label: 'Select' },
  { value: 'radio', label: 'Radio' },
  { value: 'checkbox', label: 'Checkbox' },
];

const SECTIONS = [
  { value: 'general', label: 'General' },
  { value: 'dietary', label: 'Dietary Restrictions' },
  { value: 'preferences', label: 'Preferences' },
];

const RsvpForm = ({ open, onClose, onSave, weddingId, field }) => {
  const [formData, setFormData] = useState({
    label: '',
    type: 'text',
    required: false,
    section: 'general',
    options: [],
    placeholder: '',
    helpText: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newOption, setNewOption] = useState('');

  useEffect(() => {
    if (field) {
      setFormData({
        label: field.label || '',
        type: field.type || 'text',
        required: field.required || false,
        section: field.section || 'general',
        options: field.options || [],
        placeholder: field.placeholder || '',
        helpText: field.helpText || '',
      });
    } else {
      setFormData({
        label: '',
        type: 'text',
        required: false,
        section: 'general',
        options: [],
        placeholder: '',
        helpText: '',
      });
    }
  }, [field]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (field) {
        await api.put(`/weddings/${weddingId}/rsvp-form/${field.id}`, formData);
      } else {
        await api.post(`/weddings/${weddingId}/rsvp-form`, formData);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save form field');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOption = () => {
    if (newOption.trim()) {
      setFormData({
        ...formData,
        options: [...formData.options, newOption.trim()],
      });
      setNewOption('');
    }
  };

  const handleRemoveOption = (index) => {
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== index),
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: '#FFFFFF',
        },
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}>
        <Typography variant="h6" sx={{ 
          color: '#5C5C5C',
          fontWeight: 600,
          fontSize: '1.25rem',
        }}>
          {field ? 'Edit Field' : 'Add Field'}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: '#8F8F8F',
            '&:hover': {
              bgcolor: alpha('#8F8F8F', 0.08),
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3 }}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                borderRadius: 1,
              }}
            >
              {error}
            </Alert>
          )}

          <Stack spacing={2.5}>
            <TextField
              label="Label"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              required
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#D1BFA5',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#D1BFA5',
                  },
                },
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                label="Type"
                sx={{
                  borderRadius: 1,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#D1BFA5',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#D1BFA5',
                  },
                }}
              >
                {FIELD_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Section</InputLabel>
              <Select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                label="Section"
                sx={{
                  borderRadius: 1,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#D1BFA5',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#D1BFA5',
                  },
                }}
              >
                {SECTIONS.map((section) => (
                  <MenuItem key={section.value} value={section.value}>
                    {section.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Placeholder"
              value={formData.placeholder}
              onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#D1BFA5',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#D1BFA5',
                  },
                },
              }}
            />

            <TextField
              label="Help Text"
              value={formData.helpText}
              onChange={(e) => setFormData({ ...formData, helpText: e.target.value })}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#D1BFA5',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#D1BFA5',
                  },
                },
              }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.required}
                  onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#D1BFA5',
                      '&:hover': {
                        backgroundColor: alpha('#D1BFA5', 0.08),
                      },
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#D1BFA5',
                    },
                  }}
                />
              }
              label="Required"
            />

            {(formData.type === 'select' || formData.type === 'radio') && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#5C5C5C' }}>
                  Options
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <TextField
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="Add new option"
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#D1BFA5',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#D1BFA5',
                        },
                      },
                    }}
                  />
                  <Button
                    onClick={handleAddOption}
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                      bgcolor: '#D1BFA5',
                      color: '#FFFFFF',
                      '&:hover': {
                        bgcolor: '#C1AF95',
                      },
                    }}
                  >
                    Add
                  </Button>
                </Stack>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.options.map((option, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: alpha('#D1BFA5', 0.1),
                        borderRadius: 1,
                        px: 1,
                        py: 0.5,
                      }}
                    >
                      <Typography variant="body2" sx={{ color: '#5C5C5C' }}>
                        {option}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveOption(index)}
                        sx={{
                          ml: 0.5,
                          color: '#DC3545',
                          p: 0.5,
                          '&:hover': {
                            bgcolor: alpha('#DC3545', 0.08),
                          },
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button
            onClick={onClose}
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
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: '#D1BFA5',
              color: '#FFFFFF',
              '&:hover': {
                bgcolor: '#C1AF95',
              },
            }}
          >
            {loading ? 'Saving...' : field ? 'Save Changes' : 'Add Field'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RsvpForm; 