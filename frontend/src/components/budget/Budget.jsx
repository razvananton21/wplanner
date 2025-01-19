import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress, Alert } from '@mui/material';
import EntityViewLayout from '../common/EntityViewLayout';
import BudgetOverview from './BudgetOverview';
import ExpenseList from './ExpenseList';
import BudgetSetupDialog from './BudgetSetupDialog';
import { fetchBudget, fetchExpenses, createBudget, updateBudget } from '../../store/slices/budgetSlice';

const Budget = ({ weddingId, searchQuery, activeFilters, setActiveFilters, isAddModalOpen, onCloseAddModal }) => {
  const dispatch = useDispatch();
  const { budget, loading, error } = useSelector((state) => state.budget);
  const [isBudgetSetupOpen, setIsBudgetSetupOpen] = useState(false);

  useEffect(() => {
    if (weddingId) {
      dispatch(fetchBudget(weddingId));
      dispatch(fetchExpenses(weddingId));
    }
  }, [dispatch, weddingId]);

  const handleBudgetSubmit = async (amount) => {
    try {
      if (budget) {
        await dispatch(updateBudget({ weddingId, amount })).unwrap();
      } else {
        await dispatch(createBudget({ weddingId, amount })).unwrap();
      }
      setIsBudgetSetupOpen(false);
    } catch (error) {
      throw error;
    }
  };

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

  return (
    <Box sx={{ px: { xs: 1.5, sm: 2 } }}>
      <BudgetOverview
        budget={budget}
        onSetupClick={() => setIsBudgetSetupOpen(true)}
      />

      <ExpenseList
        weddingId={weddingId}
        searchQuery={searchQuery}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        isExpenseFormOpen={isAddModalOpen}
        onCloseExpenseForm={onCloseAddModal}
      />

      <BudgetSetupDialog
        open={isBudgetSetupOpen}
        onClose={() => setIsBudgetSetupOpen(false)}
        onSubmit={handleBudgetSubmit}
        initialAmount={budget?.amount}
      />
    </Box>
  );
};

export default Budget; 