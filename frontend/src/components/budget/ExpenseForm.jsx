import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
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
  Stack,
  Typography,
  IconButton,
  Box,
  Alert,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { createExpense, updateExpense } from '../../store/slices/budgetSlice';

const CATEGORIES = [
  'Venue',
  'Catering',
  'Photography',
  'Music',
  'Decor',
  'Attire',
  'Transportation',
  'Other',
];

const STATUSES = [
  { value: 'pending', label: 'Pending', color: '#E57373' },
  { value: 'partial', label: 'Partial', color: '#FFB74D' },
  { value: 'paid', label: 'Paid', color: '#81C784' },
];

const ExpenseForm = ({ open, onClose, weddingId, expense }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: CATEGORIES[0],
    status: 'pending',
    paidAmount: '',
    dueDate: '',
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        description: expense.description || '',
        amount: expense.amount || '',
        category: expense.category || CATEGORIES[0],
        status: expense.status || 'pending',
        paidAmount: expense.paidAmount || '',
        dueDate: expense.dueDate ? new Date(expense.dueDate).toISOString().split('T')[0] : '',
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
        paidAmount: formData.paidAmount ? parseFloat(formData.paidAmount) : null,
      };

      if (expense) {
        await dispatch(updateExpense({ weddingId, expenseId: expense.id, data }));
      } else {
        await dispatch(createExpense({ weddingId, data }));
      }
      onClose();
    } catch (error) {
      setError(error.message || 'Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: '8px',
          bgcolor: '#FFFFFF',
          border: '1px solid',
          borderColor: '#E8E3DD',
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: '#E8E3DD',
        }}
      >
        <Typography
          sx={{
            fontSize: '1.25rem',
            fontFamily: 'Cormorant Garamond, serif',
            color: '#5C5C5C',
          }}
        >
          {expense ? 'Edit Expense' : 'Add Expense'}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: '#7A6B63',
            '&:hover': {
              bgcolor: alpha('#D1BFA5', 0.1),
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 2 }}>
          <Stack spacing={2}>
            {error && (
              <Alert
                severity="error"
                sx={{
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: alpha('#D32F2F', 0.1),
                  '& .MuiAlert-icon': {
                    color: '#D32F2F',
                  },
                }}
              >
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#E8E3DD',
                  },
                  '&:hover fieldset': {
                    borderColor: '#D1BFA5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#D1BFA5',
                  },
                },
              }}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <Box
                      sx={{
                        mr: 1,
                        color: '#7A6B63',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <MoneyIcon sx={{ fontSize: 20 }} />
                    </Box>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#E8E3DD',
                    },
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
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E8E3DD',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#D1BFA5',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#D1BFA5',
                    },
                  }}
                  startAdornment={
                    <Box
                      sx={{
                        mr: 1,
                        color: '#7A6B63',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <CategoryIcon sx={{ fontSize: 20 }} />
                    </Box>
                  }
                >
                  {CATEGORIES.map((category) => (
                    <MenuItem
                      key={category}
                      value={category}
                      sx={{
                        '&.Mui-selected': {
                          bgcolor: alpha('#D1BFA5', 0.1),
                          '&:hover': {
                            bgcolor: alpha('#D1BFA5', 0.2),
                          },
                        },
                      }}
                    >
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E8E3DD',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#D1BFA5',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#D1BFA5',
                    },
                  }}
                >
                  {STATUSES.map(({ value, label, color }) => (
                    <MenuItem
                      key={value}
                      value={value}
                      sx={{
                        '&.Mui-selected': {
                          bgcolor: alpha(color, 0.1),
                          '&:hover': {
                            bgcolor: alpha(color, 0.2),
                          },
                        },
                      }}
                    >
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Due Date"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <Box
                      sx={{
                        mr: 1,
                        color: '#7A6B63',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <ScheduleIcon sx={{ fontSize: 20 }} />
                    </Box>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#E8E3DD',
                    },
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

            {formData.status === 'partial' && (
              <TextField
                fullWidth
                label="Paid Amount"
                name="paidAmount"
                type="number"
                value={formData.paidAmount}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <Box
                      sx={{
                        mr: 1,
                        color: '#7A6B63',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <MoneyIcon sx={{ fontSize: 20 }} />
                    </Box>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#E8E3DD',
                    },
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
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            borderTop: '1px solid',
            borderColor: '#E8E3DD',
          }}
        >
          <Button
            onClick={onClose}
            sx={{
              color: '#7A6B63',
              '&:hover': {
                bgcolor: alpha('#D1BFA5', 0.1),
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
              '&.Mui-disabled': {
                bgcolor: alpha('#D1BFA5', 0.5),
                color: '#FFFFFF',
              },
            }}
          >
            {loading ? 'Saving...' : expense ? 'Save Changes' : 'Add Expense'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ExpenseForm; 