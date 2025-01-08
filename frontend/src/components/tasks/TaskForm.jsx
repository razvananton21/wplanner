import { useState, useEffect } from 'react';
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
    Alert,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import taskService from '../../services/taskService';

const CATEGORIES = [
    'pre-wedding',
    'ceremony',
    'reception',
    'attire',
    'beauty',
    'vendors',
    'guests',
    'documentation',
    'honeymoon',
    'post-wedding'
];

const PRIORITIES = [
    { value: 1, label: 'High' },
    { value: 2, label: 'Medium' },
    { value: 3, label: 'Low' }
];

const TaskForm = ({ open, onClose, weddingId, task = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'pre-wedding',
        priority: 2,
        dueDate: null,
        notes: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description || '',
                category: task.category,
                priority: task.priority,
                dueDate: task.dueDate ? new Date(task.dueDate) : null,
                notes: task.notes || '',
            });
        } else {
            setFormData({
                title: '',
                description: '',
                category: 'pre-wedding',
                priority: 2,
                dueDate: null,
                notes: '',
            });
        }
    }, [task]);

    const handleInputChange = (field) => (event) => {
        setFormData({
            ...formData,
            [field]: event.target.value,
        });
    };

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            dueDate: date,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (task) {
                await taskService.updateTask(weddingId, task.id, formData);
            } else {
                await taskService.createTask(weddingId, formData);
            }
            onClose(true);
        } catch (err) {
            setError(err.message || 'Failed to save task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>
                    {task ? 'Edit Task' : 'New Task'}
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        {error && (
                            <Alert severity="error">
                                {error}
                            </Alert>
                        )}

                        <TextField
                            label="Title"
                            value={formData.title}
                            onChange={handleInputChange('title')}
                            required
                            fullWidth
                        />

                        <TextField
                            label="Description"
                            value={formData.description}
                            onChange={handleInputChange('description')}
                            multiline
                            rows={3}
                            fullWidth
                        />

                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={formData.category}
                                onChange={handleInputChange('category')}
                                label="Category"
                            >
                                {CATEGORIES.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Priority</InputLabel>
                            <Select
                                value={formData.priority}
                                onChange={handleInputChange('priority')}
                                label="Priority"
                            >
                                {PRIORITIES.map((priority) => (
                                    <MenuItem key={priority.value} value={priority.value}>
                                        {priority.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                label="Due Date"
                                value={formData.dueDate}
                                onChange={handleDateChange}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider>

                        <TextField
                            label="Notes"
                            value={formData.notes}
                            onChange={handleInputChange('notes')}
                            multiline
                            rows={2}
                            fullWidth
                        />
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => onClose(false)}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default TaskForm; 