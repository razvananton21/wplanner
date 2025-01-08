import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import budgetService from '../../services/budgetService';

// Async thunks
export const fetchBudget = createAsyncThunk(
    'budget/fetchBudget',
    async (weddingId) => {
        return await budgetService.getBudget(weddingId);
    }
);

export const createBudget = createAsyncThunk(
    'budget/createBudget',
    async ({ weddingId, data }, { rejectWithValue }) => {
        try {
            return await budgetService.createBudget(weddingId, data);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create budget');
        }
    }
);

export const updateBudget = createAsyncThunk(
    'budget/updateBudget',
    async ({ weddingId, data }, { rejectWithValue }) => {
        try {
            return await budgetService.updateBudget(weddingId, data);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update budget');
        }
    }
);

export const fetchExpenses = createAsyncThunk(
    'budget/fetchExpenses',
    async (weddingId) => {
        return await budgetService.getExpenses(weddingId);
    }
);

export const createExpense = createAsyncThunk(
    'budget/createExpense',
    async ({ weddingId, data }, { rejectWithValue }) => {
        try {
            return await budgetService.createExpense(weddingId, data);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create expense');
        }
    }
);

export const updateExpense = createAsyncThunk(
    'budget/updateExpense',
    async ({ weddingId, expenseId, data }, { rejectWithValue }) => {
        try {
            return await budgetService.updateExpense(weddingId, expenseId, data);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update expense');
        }
    }
);

export const deleteExpense = createAsyncThunk(
    'budget/deleteExpense',
    async ({ weddingId, expenseId }, { rejectWithValue }) => {
        try {
            const response = await budgetService.deleteExpense(weddingId, expenseId);
            // Return both the deleted expenseId and the updated budget data
            return {
                expenseId,
                budget: response.budget,
                summary: response.summary
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete expense');
        }
    }
);

const initialState = {
    budget: null,
    summary: null,
    expenses: [],
    loading: false,
    error: null
};

const budgetSlice = createSlice({
    name: 'budget',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetBudget: () => initialState
    },
    extraReducers: (builder) => {
        builder
            // Fetch Budget
            .addCase(fetchBudget.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBudget.fulfilled, (state, action) => {
                state.loading = false;
                state.budget = action.payload.budget;
                state.summary = action.payload.summary;
                state.error = null;
            })
            .addCase(fetchBudget.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Create Budget
            .addCase(createBudget.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBudget.fulfilled, (state, action) => {
                state.loading = false;
                state.budget = action.payload.budget;
                state.summary = action.payload.summary;
                state.error = null;
            })
            .addCase(createBudget.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to create budget';
            })

            // Update Budget
            .addCase(updateBudget.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBudget.fulfilled, (state, action) => {
                state.loading = false;
                state.budget = action.payload.budget;
                state.summary = action.payload.summary;
                state.error = null;
            })
            .addCase(updateBudget.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update budget';
            })

            // Fetch Expenses
            .addCase(fetchExpenses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.loading = false;
                state.expenses = action.payload.expenses || [];
                state.error = null;
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Create Expense
            .addCase(createExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createExpense.fulfilled, (state, action) => {
                state.loading = false;
                state.expenses = [...state.expenses, action.payload.expense];
                state.budget = action.payload.budget;
                state.summary = action.payload.summary;
                state.error = null;
            })
            .addCase(createExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to create expense';
            })

            // Update Expense
            .addCase(updateExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateExpense.fulfilled, (state, action) => {
                state.loading = false;
                state.expenses = state.expenses.map(expense =>
                    expense.id === action.payload.expense.id
                        ? action.payload.expense
                        : expense
                );
                state.budget = action.payload.budget;
                state.summary = action.payload.summary;
                state.error = null;
            })
            .addCase(updateExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update expense';
            })

            // Delete Expense
            .addCase(deleteExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.expenses = state.expenses.filter(expense => expense.id !== action.payload.expenseId);
                state.budget = action.payload.budget;
                state.summary = action.payload.summary;
            })
            .addCase(deleteExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete expense';
            });
    }
});

export const { clearError, resetBudget } = budgetSlice.actions;
export default budgetSlice.reducer; 