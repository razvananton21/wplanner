import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  TextField,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Dialog,
  alpha,
} from '@mui/material';
import {
  TableRestaurant as TableIcon,
  TableBar as TableBarIcon,
  TableRows as TableRowsIcon,
} from '@mui/icons-material';
import { createTable, updateTable } from '../../store/slices/tableSlice';

const tableShapes = [
  { value: 'round', label: 'Round', icon: TableIcon },
  { value: 'rectangular', label: 'Rectangular', icon: TableBarIcon },
  { value: 'square', label: 'Square', icon: TableRowsIcon },
];

const TableForm = ({ open, onClose, weddingId, onSave, table }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.tables);

  const [formData, setFormData] = useState({
    name: '',
    capacity: 8,
    minCapacity: 1,
    shape: 'round',
    dimensions: {},
    location: '',
    isVIP: false,
    metadata: {}
  });

  useEffect(() => {
    if (table) {
      setFormData({
        name: table.name,
        capacity: table.capacity,
        minCapacity: table.minCapacity,
        shape: table.shape,
        dimensions: table.dimensions,
        location: table.location || '',
        isVIP: table.isVIP,
        metadata: table.metadata
      });
    }
  }, [table]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const action = table
      ? updateTable({ tableId: table.id, tableData: formData })
      : createTable({ weddingId, tableData: formData });

    const result = await dispatch(action);
    
    if (!result.error) {
      onSave();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
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
        {table ? 'Edit Table' : 'Add Table'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'error.light',
              }} 
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          <TextField
            label="Table Name"
            name="name"
            fullWidth
            required
            value={formData.name}
            onChange={handleChange}
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

          <FormControl fullWidth>
            <InputLabel>Shape</InputLabel>
            <Select
              name="shape"
              value={formData.shape}
              onChange={handleChange}
              label="Shape"
              sx={{
                bgcolor: '#FAFAFA',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1BFA5',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1BFA5',
                },
              }}
            >
              {tableShapes.map((shape) => (
                <MenuItem key={shape.value} value={shape.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <shape.icon sx={{ color: '#D1BFA5' }} />
                    {shape.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Capacity"
              name="capacity"
              type="number"
              fullWidth
              required
              value={formData.capacity}
              onChange={handleChange}
              inputProps={{ min: 1 }}
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
              label="Minimum Capacity"
              name="minCapacity"
              type="number"
              fullWidth
              required
              value={formData.minCapacity}
              onChange={handleChange}
              inputProps={{ min: 1 }}
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
          </Box>

          <TextField
            label="Location (Optional)"
            name="location"
            fullWidth
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Near dance floor, By the window"
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

          <FormControlLabel
            control={
              <Switch
                name="isVIP"
                checked={formData.isVIP}
                onChange={handleSwitchChange}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#D1BFA5',
                    '&:hover': {
                      bgcolor: alpha('#D1BFA5', 0.08),
                    },
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    bgcolor: '#D1BFA5',
                  },
                }}
              />
            }
            label="VIP Table"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: '1px solid #E8E3DD' }}>
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
          onClick={handleSubmit} 
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{
            bgcolor: '#D1BFA5',
            color: '#FFFFFF',
            '&:hover': {
              bgcolor: '#C1AF95',
            },
          }}
        >
          {table ? 'Save Changes' : 'Add Table'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TableForm; 