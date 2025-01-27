import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  IconButton,
  Box,
  Alert,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';

const BudgetSetupDialog = ({ open, onClose, onSubmit, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalAmount, setTotalAmount] = useState('');

  useEffect(() => {
    if (initialData) {
      setTotalAmount(initialData.totalAmount?.toString() || '');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        totalAmount: parseFloat(totalAmount),
      });
      onClose();
    } catch (error) {
      setError(error.message || 'Failed to save budget');
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
          {initialData ? 'Update Budget' : 'Set Up Budget'}
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
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
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

          <Typography
            sx={{
              mb: 2,
              color: '#7A6B63',
              fontSize: '0.875rem',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Enter your total wedding budget to start tracking expenses and stay organized.
          </Typography>

          <TextField
            fullWidth
            label="Total Budget"
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
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
            {loading ? 'Saving...' : initialData ? 'Update Budget' : 'Set Budget'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BudgetSetupDialog; 