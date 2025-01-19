import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { fetchExpenses, deleteExpense } from '../../store/slices/budgetSlice';
import ExpenseForm from './ExpenseForm';

const StatusChip = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'cancelled':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: `${getStatusColor(status)}15`,
        color: getStatusColor(status),
        borderRadius: '16px',
        '& .MuiChip-label': {
          px: 1,
        },
      }}
    />
  );
};

const ExpenseList = ({
  weddingId,
  searchQuery,
  activeFilters,
  setActiveFilters,
  isExpenseFormOpen,
  onCloseExpenseForm,
}) => {
  const dispatch = useDispatch();
  const { expenses, loading, error } = useSelector((state) => state.budget);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  const handleMenuOpen = (event, expense) => {
    setSelectedExpense(expense);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setSelectedExpense(null);
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setEditingExpense(selectedExpense);
    handleMenuClose();
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteExpense({ weddingId, expenseId: selectedExpense.id })).unwrap();
      handleMenuClose();
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  const handleExpenseFormClose = () => {
    setEditingExpense(null);
    onCloseExpenseForm();
  };

  const filteredExpenses = expenses?.filter((expense) => {
    if (!searchQuery && (!activeFilters || activeFilters.length === 0)) {
      return true;
    }

    const matchesSearch = searchQuery
      ? expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesFilters = activeFilters?.length > 0
      ? activeFilters.includes(expense.category)
      : true;

    return matchesSearch && matchesFilters;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress sx={{ color: '#D1BFA5' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!filteredExpenses?.length) {
    return (
      <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
        No expenses found
      </Typography>
    );
  }

  return (
    <>
      <Stack spacing={2}>
        {filteredExpenses.map((expense) => (
          <Paper
            key={expense.id}
            elevation={0}
            sx={{
              p: 2,
              bgcolor: '#FFFFFF',
              border: '1px solid',
              borderColor: 'rgba(0, 0, 0, 0.12)',
              borderRadius: '16px',
              '&:hover': {
                borderColor: 'rgba(0, 0, 0, 0.24)',
              },
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: '#D1BFA515',
                      borderRadius: '8px',
                      p: 1,
                    }}
                  >
                    <CategoryIcon sx={{ fontSize: 20, color: '#D1BFA5' }} />
                  </Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 500,
                    }}
                  >
                    {expense.category}
                  </Typography>
                </Stack>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {expense.description}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(expense.amount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">•</Typography>
                  <StatusChip status={expense.status} />
                </Stack>
              </Box>
              <IconButton
                size="small"
                onClick={(e) => handleMenuOpen(e, expense)}
                sx={{
                  color: 'text.secondary',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1, fontSize: 20 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
          Delete
        </MenuItem>
      </Menu>

      <ExpenseForm
        open={isExpenseFormOpen || Boolean(editingExpense)}
        onClose={handleExpenseFormClose}
        expense={editingExpense}
        weddingId={weddingId}
      />
    </>
  );
};

export default ExpenseList; 