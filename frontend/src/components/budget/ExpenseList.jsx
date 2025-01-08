import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    TablePagination,
    Tooltip,
    Menu,
    MenuItem,
    TextField,
    InputAdornment,
    Alert
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';
import { deleteExpense, fetchExpenses, fetchBudget } from '../../store/slices/budgetSlice';
import ExpenseForm from './ExpenseForm';

const StatusChip = ({ status }) => {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'paid':
                return { label: 'Paid', color: 'success', icon: <CheckCircleIcon /> };
            case 'partial':
                return { label: 'Partial', color: 'warning', icon: <WarningIcon /> };
            case 'pending':
                return { label: 'Pending', color: 'default', icon: <ScheduleIcon /> };
            default:
                return { label: status, color: 'default', icon: null };
        }
    };

    const config = getStatusConfig(status);

    return (
        <Chip
            label={config.label}
            color={config.color}
            size="small"
            icon={config.icon}
        />
    );
};

const ExpenseList = ({ weddingId, onEdit }) => {
    const dispatch = useDispatch();
    const { expenses, loading, error } = useSelector((state) => state.budget);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedExpense, setSelectedExpense] = useState(null);

    const handleMenuOpen = (event, expense) => {
        console.log('Opening menu for expense:', expense);
        setSelectedExpense(expense);
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        console.log('Editing expense:', selectedExpense);
        onEdit(selectedExpense);
        handleMenuClose();
    };

    const handleDelete = async (expenseId) => {
        try {
            await dispatch(deleteExpense({ weddingId, expenseId }));
            await Promise.all([
                dispatch(fetchBudget(weddingId)),
                dispatch(fetchExpenses(weddingId))
            ]);
            handleMenuClose();
        } catch (error) {
            console.error('Failed to delete expense:', error);
        }
    };

    const filteredExpenses = expenses.filter(expense =>
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Box>Loading...</Box>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                sx={{ mb: 2 }}
            />

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell align="right">Paid Amount</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredExpenses
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((expense) => (
                                <TableRow key={expense.id}>
                                    <TableCell>{expense.description}</TableCell>
                                    <TableCell>{expense.category}</TableCell>
                                    <TableCell align="right">${expense.amount.toLocaleString()}</TableCell>
                                    <TableCell align="right">${(expense.paidAmount || 0).toLocaleString()}</TableCell>
                                    <TableCell><StatusChip status={expense.status} /></TableCell>
                                    <TableCell>
                                        {expense.dueDate ? new Date(expense.dueDate).toLocaleDateString() : '-'}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleMenuOpen(e, expense)}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={filteredExpenses.length}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
            />

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEdit}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Edit
                </MenuItem>
                <MenuItem 
                    onClick={() => handleDelete(selectedExpense?.id)}
                    sx={{ color: 'error.main' }}
                >
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Delete
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default ExpenseList; 