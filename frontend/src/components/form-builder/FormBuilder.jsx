import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Divider,
  Alert,
  Paper,
  Stack,
  styled,
  Chip,
} from '@mui/material';
import {
  DragHandle as DragHandleIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../../services/api';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(1),
  border: '1px solid',
  borderColor: theme.palette.divider,
  transition: 'all 0.2s ease',
  backgroundColor: '#fff',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: '#F5F8FF',
    transform: 'translateY(-2px)',
    '& .drag-handle': {
      color: theme.palette.primary.main,
    }
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1),
    backgroundColor: '#fff',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      }
    }
  }
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  backgroundColor: '#fff',
  '&:hover': {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    }
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  padding: '8px 24px',
  boxShadow: 'none',
  minWidth: '160px',
  whiteSpace: 'nowrap',
  '&:hover': {
    boxShadow: 'none',
    backgroundColor: theme.palette.primary.dark,
  }
}));

const OptionsSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: '#F8FAFC',
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const FIELD_TYPES = [
  { value: 'text', label: 'Text Input' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'select', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'date', label: 'Date Picker' },
];

const SECTIONS = [
  { value: 'general', label: 'General Information' },
  { value: 'dietary', label: 'Dietary Requirements' },
  { value: 'preferences', label: 'Preferences' },
];

export default function FormBuilder() {
  const { id: weddingId } = useParams();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newOption, setNewOption] = useState('');

  useEffect(() => {
    fetchFields();
  }, [weddingId]);

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

  const handleAddField = () => {
    const newField = {
      id: Date.now(),
      label: 'New Field',
      type: 'text',
      required: false,
      displayOrder: fields.length,
      section: 'general',
      options: []
    };
    setFields([...fields, newField]);
    setSuccess('Field added successfully');
  };

  const handleUpdateField = (fieldId, updates) => {
    setFields(fields.map(f => f.id === fieldId ? { ...f, ...updates } : f));
    setSuccess('Field updated successfully');
  };

  const handleDeleteField = (fieldId) => {
    setFields(fields.filter(f => f.id !== fieldId));
    setSuccess('Field deleted successfully');
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedFields = Array.from(fields);
    const [removed] = reorderedFields.splice(result.source.index, 1);
    reorderedFields.splice(result.destination.index, 0, removed);

    const updatedFields = reorderedFields.map((field, index) => ({
      ...field,
      displayOrder: index
    }));

    setFields(updatedFields);
    setSuccess('Fields reordered successfully');
  };

  const handleSaveConfiguration = async () => {
    try {
      setLoading(true);
      // Delete all existing fields
      const existingFields = await api.get(`/weddings/${weddingId}/rsvp-form`);
      for (const field of existingFields.data.data || []) {
        await api.delete(`/weddings/${weddingId}/rsvp-form/${field.id}`);
      }

      // Create new fields
      for (const field of fields) {
        await api.post(`/weddings/${weddingId}/rsvp-form`, {
          label: field.label,
          type: field.type,
          required: field.required,
          displayOrder: field.displayOrder,
          section: field.section,
          options: field.options || [],
          placeholder: field.placeholder,
          helpText: field.helpText
        });
      }

      setSuccess('Form configuration saved successfully');
      await fetchFields(); // Refresh fields from server
    } catch (err) {
      setError('Failed to save form configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOption = (field) => {
    if (!newOption.trim()) return;
    
    const newOptions = [...(field.options || []), newOption.trim()];
    handleUpdateField(field.id, { ...field, options: newOptions });
    setNewOption('');
  };

  const renderFieldOptions = (field) => {
    if (field.type === 'select' || field.type === 'radio') {
      return (
        <OptionsSection>
          <Stack direction="row" spacing={2} alignItems="center">
            <StyledTextField
              size="small"
              placeholder="Add new option"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              fullWidth
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddOption(field);
                }
              }}
            />
            <StyledButton
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => handleAddOption(field)}
              sx={{ flexShrink: 0 }}
            >
              Add Option
            </StyledButton>
          </Stack>
          
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {field.options?.map((option, index) => (
              <Chip
                key={index}
                label={option}
                onDelete={() => {
                  const newOptions = field.options.filter((_, i) => i !== index);
                  handleUpdateField(field.id, { ...field, options: newOptions });
                }}
                sx={{
                  borderRadius: 1,
                  backgroundColor: '#fff',
                  border: '1px solid',
                  borderColor: 'primary.light',
                  '& .MuiChip-deleteIcon': {
                    color: 'error.main',
                    '&:hover': {
                      color: 'error.dark',
                    }
                  }
                }}
              />
            ))}
          </Box>
        </OptionsSection>
      );
    }
    return null;
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4,
          borderRadius: 2,
          backgroundColor: '#F8FAFC',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            color: 'primary.main',
            fontWeight: 600,
            mb: 1
          }}
        >
          Customize RSVP Form
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 4 }}
        >
          Drag and drop fields to reorder. Configure each field's properties below.
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 1 }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert 
            severity="success" 
            sx={{ mb: 3, borderRadius: 1 }}
          >
            {success}
          </Alert>
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="form-fields">
            {(provided) => (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                {fields.map((field, index) => (
                  <Draggable
                    key={field.id}
                    draggableId={field.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <StyledCard
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        elevation={0}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Grid container spacing={2} alignItems="center">
                            <Grid 
                              item 
                              {...provided.dragHandleProps}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                height: '100%',
                                pr: 0
                              }}
                            >
                              <DragHandleIcon 
                                className="drag-handle"
                                sx={{ 
                                  color: 'text.disabled',
                                  cursor: 'grab',
                                  transition: 'color 0.2s ease'
                                }} 
                              />
                            </Grid>
                            
                            <Grid item xs={12} sm={4}>
                              <StyledTextField
                                fullWidth
                                label="Label"
                                value={field.label}
                                onChange={(e) => handleUpdateField(field.id, {
                                  ...field,
                                  label: e.target.value
                                })}
                                size="small"
                              />
                            </Grid>

                            <Grid item xs={12} sm={2}>
                              <FormControl fullWidth size="small">
                                <InputLabel>Type</InputLabel>
                                <StyledSelect
                                  value={field.type}
                                  label="Type"
                                  onChange={(e) => handleUpdateField(field.id, {
                                    ...field,
                                    type: e.target.value
                                  })}
                                >
                                  {FIELD_TYPES.map(type => (
                                    <MenuItem key={type.value} value={type.value}>
                                      {type.label}
                                    </MenuItem>
                                  ))}
                                </StyledSelect>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={2}>
                              <FormControl fullWidth size="small">
                                <InputLabel>Section</InputLabel>
                                <StyledSelect
                                  value={field.section}
                                  label="Section"
                                  onChange={(e) => handleUpdateField(field.id, {
                                    ...field,
                                    section: e.target.value
                                  })}
                                >
                                  {SECTIONS.map(section => (
                                    <MenuItem key={section.value} value={section.value}>
                                      {section.label}
                                    </MenuItem>
                                  ))}
                                </StyledSelect>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={2}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={field.required}
                                    onChange={(e) => handleUpdateField(field.id, {
                                      ...field,
                                      required: e.target.checked
                                    })}
                                    size="small"
                                    color="primary"
                                  />
                                }
                                label="Required"
                              />
                            </Grid>

                            <Grid item xs={12} sm={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <IconButton
                                onClick={() => handleDeleteField(field.id)}
                                color="error"
                                size="small"
                                sx={{ 
                                  backgroundColor: 'error.lighter',
                                  '&:hover': {
                                    backgroundColor: 'error.light',
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Grid>
                          </Grid>

                          {field.type === 'select' || field.type === 'radio' ? (
                            <OptionsSection>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <StyledTextField
                                  size="small"
                                  placeholder="Add new option"
                                  value={newOption}
                                  onChange={(e) => setNewOption(e.target.value)}
                                  fullWidth
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      handleAddOption(field);
                                    }
                                  }}
                                />
                                <StyledButton
                                  variant="contained"
                                  size="small"
                                  startIcon={<AddIcon />}
                                  onClick={() => handleAddOption(field)}
                                  sx={{ flexShrink: 0 }}
                                >
                                  Add Option
                                </StyledButton>
                              </Stack>
                              
                              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {field.options?.map((option, index) => (
                                  <Chip
                                    key={index}
                                    label={option}
                                    onDelete={() => {
                                      const newOptions = field.options.filter((_, i) => i !== index);
                                      handleUpdateField(field.id, { ...field, options: newOptions });
                                    }}
                                    sx={{
                                      borderRadius: 1,
                                      backgroundColor: '#fff',
                                      border: '1px solid',
                                      borderColor: 'primary.light',
                                      '& .MuiChip-deleteIcon': {
                                        color: 'error.main',
                                        '&:hover': {
                                          color: 'error.dark',
                                        }
                                      }
                                    }}
                                  />
                                ))}
                              </Box>
                            </OptionsSection>
                          ) : null}
                        </CardContent>
                      </StyledCard>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <StyledButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddField}
          >
            Add Field
          </StyledButton>
          <StyledButton
            variant="outlined"
            onClick={handleSaveConfiguration}
            sx={{
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                backgroundColor: 'primary.50',
              }
            }}
          >
            Save Configuration
          </StyledButton>
        </Box>
      </Paper>
    </Box>
  );
} 