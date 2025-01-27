import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Paper,
  Button,
} from '@mui/material';
import {
  AccountBalance,
  Receipt,
  TrendingUp,
  CheckCircle,
  Schedule,
  MonetizationOn,
  Category,
} from '@mui/icons-material';
import budgetService from '../../services/budgetService';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      bgcolor: '#FFFFFF',
      border: '1px solid',
      borderColor: '#E8E3DD',
      borderRadius: '16px',
      flex: 1,
      minWidth: { xs: '100%', sm: 0 },
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        borderColor: '#D1BFA5',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
      },
    }}
  >
    <Stack direction="row" spacing={2} alignItems="center">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: `${color}15`,
          borderRadius: '8px',
          p: 1,
        }}
      >
        <Icon sx={{ fontSize: 20, color: color }} />
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
          {label}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontSize: '1.125rem', fontWeight: 500 }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  </Paper>
);

const CategoryProgress = ({ category, amount, total }) => {
  const percentage = total > 0 ? Math.round((amount / total) * 100) : 0;
  const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <Box sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
        <Typography variant="body2">{category}</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {formattedAmount}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ({percentage}%)
          </Typography>
        </Stack>
      </Stack>
      <Box
        sx={{
          height: 8,
          bgcolor: '#F5F5F5',
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            width: `${percentage}%`,
            height: '100%',
            bgcolor: '#D1BFA5',
            transition: 'width 0.5s ease-in-out',
          }}
        />
      </Box>
    </Box>
  );
};

const BudgetOverview = ({ budget, onSetupClick }) => {
  console.log('Raw budget object:', budget);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (budget?.id) {
        try {
          console.log('Budget object:', {
            id: budget.id,
            weddingId: budget.wedding?.id,
            totalAmount: budget.totalAmount,
            categoryAllocations: budget.categoryAllocations
          });
          
          const response = await budgetService.getExpenses(budget.wedding.id);
          console.log('Raw API response:', response);
          
          if (response?.expenses && response?.summary) {
            setExpenses(response.expenses);
            // Store the summary for debugging
            console.log('Budget summary from API:', response.summary);
          } else {
            console.warn('No expenses or summary found in response');
            setExpenses([]);
          }
        } catch (error) {
          console.error('Error fetching expenses:', error);
        }
      }
      setLoading(false);
    };

    fetchExpenses();
  }, [budget]);

  if (!budget) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          No budget has been set up yet
        </Typography>
        <Button
          variant="contained"
          onClick={onSetupClick}
          sx={{
            bgcolor: '#D1BFA5',
            '&:hover': { bgcolor: '#C1AF95' },
          }}
        >
          Set Up Budget
        </Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Loading budget details...
        </Typography>
      </Box>
    );
  }
  
  const totalBudget = parseFloat(budget.totalAmount) || 0;
  const totalExpenses = expenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);
  const totalPaid = expenses.reduce((sum, expense) => {
    if (expense.status === 'paid') return sum + (parseFloat(expense.amount) || 0);
    if (expense.status === 'partial') return sum + (parseFloat(expense.paidAmount) || 0);
    return sum;
  }, 0);
  const totalPending = totalExpenses - totalPaid;
  const remainingBudget = totalBudget - totalExpenses;

  // Calculate expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category || 'Uncategorized';
    const amount = parseFloat(expense.amount) || 0;
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {});

  console.log('Final calculated values:', {
    totalBudget,
    totalExpenses,
    totalPaid,
    totalPending,
    remainingBudget,
    expensesByCategory
  });

  return (
    <Box sx={{ mb: 4 }}>
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <StatCard
            icon={AccountBalance}
            label="Total Budget"
            value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalBudget)}
            color="#4CAF50"
          />
          <StatCard
            icon={Receipt}
            label="Total Expenses"
            value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalExpenses)}
            color="#FF9800"
          />
          <StatCard
            icon={TrendingUp}
            label="Remaining"
            value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(remainingBudget)}
            color="#2196F3"
          />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <StatCard
            icon={CheckCircle}
            label="Total Paid"
            value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalPaid)}
            color="#4CAF50"
          />
          <StatCard
            icon={Schedule}
            label="Total Pending"
            value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalPending)}
            color="#FF9800"
          />
          <StatCard
            icon={MonetizationOn}
            label="Budget Progress"
            value={`${Math.round((totalExpenses / totalBudget) * 100)}%`}
            color="#2196F3"
          />
        </Stack>

        {Object.keys(expensesByCategory).length > 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: '#FFFFFF',
              border: '1px solid',
              borderColor: '#E8E3DD',
              borderRadius: '16px',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <Category sx={{ color: '#D1BFA5', fontSize: 20 }} />
              <Typography variant="subtitle1">Expenses by Category</Typography>
            </Stack>
            {Object.entries(expensesByCategory).map(([category, amount]) => (
              <CategoryProgress
                key={category}
                category={category}
                amount={amount}
                total={totalBudget}
              />
            ))}
          </Paper>
        ) : (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            No expenses added yet
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default BudgetOverview; 