import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    IconButton,
    Chip,
    Stack,
    Grid,
    CircularProgress,
    Alert,
    Tabs,
    Tab,
    Tooltip,
    Menu,
    MenuItem,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    FilterList as FilterIcon,
    Sort as SortIcon,
    CheckCircle as CheckCircleIcon,
    RadioButtonUnchecked as UncheckedIcon,
    Flag as FlagIcon,
    Schedule as ScheduleIcon,
    Category as CategoryIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { format } from 'date-fns';
import taskService from '../../services/taskService';
import TaskForm from './TaskForm';

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

const PRIORITIES = {
    1: { label: 'High', color: 'error' },
    2: { label: 'Medium', color: 'warning' },
    3: { label: 'Low', color: 'success' }
};

const TaskList = ({ weddingId }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('displayOrder');

    useEffect(() => {
        fetchTasks();
    }, [weddingId, activeTab, selectedCategory]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            let response;
            
            switch (activeTab) {
                case 'incomplete':
                    response = await taskService.getIncompleteTasks(weddingId);
                    break;
                case 'overdue':
                    response = await taskService.getOverdueTasks(weddingId);
                    break;
                case 'upcoming':
                    response = await taskService.getUpcomingTasks(weddingId);
                    break;
                default:
                    if (selectedCategory !== 'all') {
                        response = await taskService.getTasksByCategory(weddingId, selectedCategory);
                    } else {
                        response = await taskService.getTasks(weddingId);
                    }
            }

            setTasks(response.tasks);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(tasks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const taskOrders = items.map((task, index) => ({
            id: task.id,
            order: index
        }));

        setTasks(items);

        try {
            await taskService.reorderTasks(weddingId, taskOrders);
        } catch (err) {
            setError('Failed to reorder tasks');
            fetchTasks(); // Reload original order
        }
    };

    const handleTaskComplete = async (taskId, isCompleted) => {
        try {
            await taskService.updateTask(weddingId, taskId, { isCompleted });
            fetchTasks();
        } catch (err) {
            setError('Failed to update task status');
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await taskService.deleteTask(weddingId, taskId);
            fetchTasks();
        } catch (err) {
            setError('Failed to delete task');
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setOpenForm(true);
    };

    const handleFormClose = (shouldRefetch = false) => {
        setOpenForm(false);
        setEditingTask(null);
        if (shouldRefetch) {
            fetchTasks();
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleFilterClick = (event) => {
        setFilterAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setFilterAnchorEl(null);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        handleFilterClose();
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="h2">
                    Tasks
                </Typography>
                <Stack direction="row" spacing={1}>
                    <IconButton onClick={handleFilterClick}>
                        <FilterIcon />
                    </IconButton>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenForm(true)}
                    >
                        Add Task
                    </Button>
                </Stack>
            </Box>

            <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={handleFilterClose}
            >
                <MenuItem onClick={() => handleCategorySelect('all')}>
                    All Categories
                </MenuItem>
                {CATEGORIES.map((category) => (
                    <MenuItem
                        key={category}
                        onClick={() => handleCategorySelect(category)}
                    >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </MenuItem>
                ))}
            </Menu>

            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
            >
                <Tab label="All" value="all" />
                <Tab label="Incomplete" value="incomplete" />
                <Tab label="Overdue" value="overdue" />
                <Tab label="Upcoming" value="upcoming" />
            </Tabs>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="tasks">
                    {(provided) => (
                        <Box
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {tasks.map((task, index) => (
                                <Draggable
                                    key={task.id}
                                    draggableId={task.id.toString()}
                                    index={index}
                                >
                                    {(provided) => (
                                        <Paper
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            sx={{
                                                p: 2,
                                                mb: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                opacity: task.isCompleted ? 0.7 : 1,
                                            }}
                                        >
                                            <IconButton
                                                onClick={() => handleTaskComplete(task.id, !task.isCompleted)}
                                                sx={{ mr: 1 }}
                                            >
                                                {task.isCompleted ? (
                                                    <CheckCircleIcon color="success" />
                                                ) : (
                                                    <UncheckedIcon />
                                                )}
                                            </IconButton>

                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        textDecoration: task.isCompleted ? 'line-through' : 'none',
                                                    }}
                                                >
                                                    {task.title}
                                                </Typography>
                                                {task.description && (
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{ mt: 0.5 }}
                                                    >
                                                        {task.description}
                                                    </Typography>
                                                )}
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    sx={{ mt: 1 }}
                                                >
                                                    <Chip
                                                        size="small"
                                                        label={task.category}
                                                        icon={<CategoryIcon />}
                                                    />
                                                    <Chip
                                                        size="small"
                                                        label={PRIORITIES[task.priority].label}
                                                        color={PRIORITIES[task.priority].color}
                                                        icon={<FlagIcon />}
                                                    />
                                                    {task.dueDate && (
                                                        <Chip
                                                            size="small"
                                                            label={format(new Date(task.dueDate), 'MMM d, yyyy')}
                                                            icon={<ScheduleIcon />}
                                                        />
                                                    )}
                                                </Stack>
                                            </Box>

                                            <Stack direction="row" spacing={1}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleEditTask(task)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteTask(task.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Stack>
                                        </Paper>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>

            <TaskForm
                open={openForm}
                onClose={handleFormClose}
                weddingId={weddingId}
                task={editingTask}
            />
        </Box>
    );
};

export default TaskList; 