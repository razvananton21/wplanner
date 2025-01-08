import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, IconButton, Button, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack } from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBudget, fetchExpenses, createBudget, updateBudget } from '../../store/slices/budgetSlice';
import BudgetOverview from './BudgetOverview';
import ExpenseList from './ExpenseList';
import ExpenseForm from './ExpenseForm';

const BudgetSetupDialog = ({ open, onClose, onSubmit, initialBudget = null }) => {
    const [budget, setBudget] = useState({
        totalAmount: initialBudget?.totalAmount || '',
        categoryAllocations: initialBudget?.categoryAllocations || {}
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(budget);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>
                    {initialBudget ? 'Update Budget' : 'Set Up Budget'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            label="Total Budget"
                            type="number"
                            value={budget.totalAmount}
                            onChange={(e) => setBudget(prev => ({
                                ...prev,
                                totalAmount: e.target.value
                            }))}
                            required
                            fullWidth
                            InputProps={{
                                startAdornment: '$'
                            }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        {initialBudget ? 'Update' : 'Create'} Budget
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const SectionHeader = ({ title, expanded, onToggle, action }) => (
    <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
        <Typography variant="h6">{title}</Typography>
        <Box display="flex" alignItems="center" gap={1}>
            {action}
            <IconButton onClick={onToggle} size="small">
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
        </Box>
    </Box>
);

const Budget = ({ weddingId }) => {
    const dispatch = useDispatch();
    const { budget, error, loading } = useSelector((state) => state.budget);
    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [showBudgetSetup, setShowBudgetSetup] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [budgetSectionExpanded, setBudgetSectionExpanded] = useState(true);
    const [expensesSectionExpanded, setExpensesSectionExpanded] = useState(true);

    useEffect(() => {
        if (weddingId) {
            dispatch(fetchBudget(weddingId));
            dispatch(fetchExpenses(weddingId));
        }
    }, [dispatch, weddingId]);

    const handleBudgetSubmit = async (data) => {
        try {
            if (budget) {
                await dispatch(updateBudget({ weddingId, data }));
            } else {
                await dispatch(createBudget({ weddingId, data }));
            }
            setShowBudgetSetup(false);
            dispatch(fetchBudget(weddingId));
        } catch (error) {
            console.error('Failed to save budget:', error);
        }
    };

    const handleExpenseFormClose = () => {
        setShowExpenseForm(false);
        setSelectedExpense(null);
        dispatch(fetchBudget(weddingId));
        dispatch(fetchExpenses(weddingId));
    };

    const handleEditExpense = (expense) => {
        setSelectedExpense(expense);
        setShowExpenseForm(true);
    };

    if (loading) return <Box p={3}>Loading...</Box>;
    if (error) return <Alert severity="error">{error}</Alert>;

    const hasBudget = budget && typeof budget === 'object' && 'id' in budget;

    if (!hasBudget) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="400px" p={3}>
                <Typography variant="h6" gutterBottom>No budget set up yet</Typography>
                <Button variant="contained" onClick={() => setShowBudgetSetup(true)} startIcon={<AddIcon />}>
                    Set Up Budget
                </Button>
                <BudgetSetupDialog
                    open={showBudgetSetup}
                    onClose={() => setShowBudgetSetup(false)}
                    onSubmit={handleBudgetSubmit}
                />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Budget Overview Section */}
            <Paper sx={{ mb: 3 }}>
                <SectionHeader
                    title="Budget Overview"
                    expanded={budgetSectionExpanded}
                    onToggle={() => setBudgetSectionExpanded(!budgetSectionExpanded)}
                    action={
                        <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => setShowBudgetSetup(true)}
                        >
                            Update Budget
                        </Button>
                    }
                />
                {budgetSectionExpanded && (
                    <Box p={2} pt={0}>
                        <BudgetOverview weddingId={weddingId} />
                    </Box>
                )}
            </Paper>

            {/* Expenses Section */}
            <Paper>
                <SectionHeader
                    title="Expenses"
                    expanded={expensesSectionExpanded}
                    onToggle={() => setExpensesSectionExpanded(!expensesSectionExpanded)}
                    action={
                        <Button 
                            variant="contained" 
                            size="small"
                            onClick={() => setShowExpenseForm(true)}
                            startIcon={<AddIcon />}
                        >
                            Add Expense
                        </Button>
                    }
                />
                {expensesSectionExpanded && (
                    <Box p={2} pt={0}>
                        <ExpenseList
                            weddingId={weddingId}
                            onEdit={handleEditExpense}
                        />
                    </Box>
                )}
            </Paper>

            {showExpenseForm && (
                <ExpenseForm
                    open={showExpenseForm}
                    weddingId={weddingId}
                    expense={selectedExpense}
                    onClose={handleExpenseFormClose}
                />
            )}

            <BudgetSetupDialog
                open={showBudgetSetup}
                onClose={() => setShowBudgetSetup(false)}
                onSubmit={handleBudgetSubmit}
                initialBudget={budget}
            />
        </Box>
    );
};

export default Budget; 