import React from 'react';
import { useDispatch } from 'react-redux';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { createExpense, updateExpense, fetchBudget, fetchExpenses } from '../../store/slices/budgetSlice';

const EXPENSE_CATEGORIES = [
    { value: 'venue', label: 'Venue' },
    { value: 'catering', label: 'Catering' },
    { value: 'photography', label: 'Photography' },
    { value: 'videography', label: 'Videography' },
    { value: 'music', label: 'Music' },
    { value: 'flowers', label: 'Flowers' },
    { value: 'decor', label: 'Decor' },
    { value: 'attire', label: 'Attire' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'stationery', label: 'Stationery' },
    { value: 'gifts', label: 'Gifts' },
    { value: 'other', label: 'Other' }
];

const EXPENSE_STATUS = [
    { value: 'pending', label: 'Pending' },
    { value: 'partial', label: 'Partially Paid' },
    { value: 'paid', label: 'Paid' }
];

const ExpenseForm = ({ open, onClose, expense, weddingId }) => {
    const dispatch = useDispatch();
    console.log('ExpenseForm rendered with props:', { open, expense, weddingId });

    const [formData, setFormData] = React.useState(() => {
        console.log('Initializing form data with expense:', expense);
        const initialData = {
            category: '',
            description: '',
            amount: '',
            status: 'pending',
            paidAmount: '',
            dueDate: null
        };

        if (expense) {
            const populatedData = {
                ...initialData,
                category: expense.category || '',
                description: expense.description || '',
                amount: expense.amount?.toString() || '',
                status: expense.status || 'pending',
                paidAmount: expense.paidAmount?.toString() || '',
                dueDate: expense.dueDate ? new Date(expense.dueDate) : null
            };
            console.log('Form data initialized with expense:', populatedData);
            return populatedData;
        }

        console.log('Form data initialized with defaults:', initialData);
        return initialData;
    });

    // Reset form data when expense changes
    React.useEffect(() => {
        console.log('Expense prop changed:', expense);
        if (expense) {
            const updatedData = {
                category: expense.category || '',
                description: expense.description || '',
                amount: expense.amount?.toString() || '',
                status: expense.status || 'pending',
                paidAmount: expense.paidAmount?.toString() || '',
                dueDate: expense.dueDate ? new Date(expense.dueDate) : null
            };
            console.log('Updating form data with:', updatedData);
            setFormData(updatedData);
        } else {
            const emptyData = {
                category: '',
                description: '',
                amount: '',
                status: 'pending',
                paidAmount: '',
                dueDate: null
            };
            console.log('Resetting form data to:', emptyData);
            setFormData(emptyData);
        }
    }, [expense]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({
            ...prev,
            dueDate: date
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            ...formData,
            amount: parseFloat(formData.amount),
            paidAmount: formData.paidAmount ? parseFloat(formData.paidAmount) : null,
            dueDate: formData.dueDate ? formData.dueDate.toISOString() : null
        };

        console.log('Submitting expense form with data:', data);

        try {
            let result;
            if (expense?.id) {
                result = await dispatch(updateExpense({
                    weddingId,
                    expenseId: expense.id,
                    data
                })).unwrap();
            } else {
                result = await dispatch(createExpense({
                    weddingId,
                    data
                })).unwrap();
            }
            console.log('Expense saved successfully:', result);

            // Immediately fetch fresh data
            const [budgetResult, expensesResult] = await Promise.all([
                dispatch(fetchBudget(weddingId)).unwrap(),
                dispatch(fetchExpenses(weddingId)).unwrap()
            ]);
            console.log('Fresh data fetched:', { budgetResult, expensesResult });

            onClose();
        } catch (error) {
            console.error('Failed to save expense:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>
                    {expense ? 'Edit Expense' : 'Add New Expense'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            name="category"
                            label="Category"
                            select
                            fullWidth
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            {EXPENSE_CATEGORIES.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            name="description"
                            label="Description"
                            fullWidth
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />

                        <TextField
                            name="amount"
                            label="Amount"
                            type="number"
                            fullWidth
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            InputProps={{
                                startAdornment: '$'
                            }}
                        />

                        <TextField
                            name="status"
                            label="Payment Status"
                            select
                            fullWidth
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            {EXPENSE_STATUS.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        {formData.status === 'partial' && (
                            <TextField
                                name="paidAmount"
                                label="Paid Amount"
                                type="number"
                                fullWidth
                                value={formData.paidAmount}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: '$'
                                }}
                            />
                        )}

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Due Date"
                                value={formData.dueDate}
                                onChange={handleDateChange}
                                slotProps={{
                                    textField: {
                                        fullWidth: true
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        {expense ? 'Update' : 'Add'} Expense
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ExpenseForm; 