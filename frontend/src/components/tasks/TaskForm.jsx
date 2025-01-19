import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  alpha,
} from '@mui/material';
import {
  Flag as FlagIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import taskService from '../../services/taskService';

const CATEGORIES = [
  'Pre-Wedding',
  'Ceremony',
  'Reception',
  'Attire',
  'Beauty',
  'Vendors',
  'Guests',
  'Documentation',
  'Honeymoon',
  'Post-Wedding',
];

const PRIORITIES = [
  { value: 1, label: 'High', color: '#E57373' },
  { value: 2, label: 'Medium', color: '#FFB74D' },
  { value: 3, label: 'Low', color: '#81C784' },
];

const TaskForm = ({ open, onClose, weddingId, onTaskAdded, task }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: CATEGORIES[0],
    priority: 2,
    dueDate: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        category: task.category,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: CATEGORIES[0],
        priority: 2,
        dueDate: null,
      });
    }
  }, [task]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (task) {
        await taskService.updateTask(weddingId, task.id, formData);
      } else {
        await taskService.createTask(weddingId, formData);
      }
      onTaskAdded();
      handleClose();
    } catch (err) {
      console.error('Failed to save task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      category: CATEGORIES[0],
      priority: 2,
      dueDate: null,
    });
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
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
        {task ? 'Edit Task' : 'Add Task'}
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
          <TextField
            select
            label="Category"
            fullWidth
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
            {CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CategoryIcon sx={{ color: '#D1BFA5' }} />
                  {category}
                </Box>
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Priority"
            fullWidth
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
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
            {PRIORITIES.map((priority) => (
              <MenuItem key={priority.value} value={priority.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FlagIcon sx={{ color: priority.color }} />
                  {priority.label}
                </Box>
              </MenuItem>
            ))}
          </TextField>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Due Date"
              value={formData.dueDate}
              onChange={(date) => setFormData({ ...formData, dueDate: date })}
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
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: '1px solid #E8E3DD' }}>
        <Button 
          onClick={handleClose}
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
          sx={{
            bgcolor: '#D1BFA5',
            color: '#FFFFFF',
            '&:hover': {
              bgcolor: '#C1AF95',
            },
          }}
        >
          {loading ? (task ? 'Saving...' : 'Adding...') : (task ? 'Save Changes' : 'Add Task')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskForm; 