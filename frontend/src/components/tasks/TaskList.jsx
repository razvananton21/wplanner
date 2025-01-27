import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
  Stack,
  IconButton,
  alpha,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import TaskForm from './TaskForm';
import taskService from '../../services/taskService';

const PRIORITIES = {
  1: { color: '#E57373', label: 'High' },
  2: { color: '#FFB74D', label: 'Medium' },
  3: { color: '#81C784', label: 'Low' },
};

const TaskList = ({ 
  weddingId, 
  searchQuery, 
  activeFilters, 
  setActiveFilters,
  isAddModalOpen,
  onCloseAddModal,
}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [weddingId, searchQuery]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getTasks(weddingId);
      setTasks(response.tasks);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleCloseEdit = () => {
    setEditingTask(null);
  };

  const handleTaskUpdated = () => {
    fetchTasks();
    handleCloseEdit();
  };

  const handleToggleComplete = async (task) => {
    try {
      await taskService.updateTask(weddingId, task.id, {
        ...task,
        isCompleted: !task.isCompleted
      });
      fetchTasks();
    } catch (err) {
      setError('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    try {
      await taskService.deleteTask(weddingId, taskId);
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Box sx={{ color: '#D1BFA5' }}>Loading...</Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          mb: 3,
          borderRadius: '12px',
          border: '1px solid',
          borderColor: 'error.light',
        }} 
        onClose={() => setError(null)}
      >
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Stack spacing={2}>
        {tasks.map((task) => (
          <Paper 
            key={task.id} 
            sx={{ 
              position: 'relative',
              borderRadius: '16px',
              bgcolor: '#FFFFFF',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)',
              border: '1px solid',
              borderColor: '#E8E3DD',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                borderColor: '#DED9D2',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', p: 2.5 }}>
              <Box 
                component="button"
                onClick={() => handleToggleComplete(task)}
                sx={{ 
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  bgcolor: alpha('#D1BFA5', 0.1),
                  color: task.isCompleted ? '#81C784' : '#D1BFA5',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: alpha(task.isCompleted ? '#81C784' : '#D1BFA5', 0.15),
                  },
                }}
              >
                <CheckCircleIcon fontSize="small" />
              </Box>

              <Box sx={{ flex: 1, ml: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <CategoryIcon 
                    sx={{ 
                      fontSize: 18, 
                      color: '#A69374',
                      opacity: 0.8,
                    }} 
                  />
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      color: '#A69374',
                      opacity: 0.8,
                    }}
                  >
                    {task.category}
                  </Typography>
                </Box>
                <Typography 
                  sx={{
                    color: '#5C5C5C',
                    fontSize: '1rem',
                    fontWeight: 500,
                    textDecoration: task.isCompleted ? 'line-through' : 'none',
                    opacity: task.isCompleted ? 0.7 : 1,
                  }}
                >
                  {task.title}
                </Typography>
                {task.description && (
                  <Typography 
                    sx={{
                      mt: 0.5,
                      color: '#7A6B63',
                      fontSize: '0.875rem',
                      opacity: task.isCompleted ? 0.7 : 1,
                    }}
                  >
                    {task.description}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                <IconButton
                  onClick={() => handleEditTask(task)}
                  size="small"
                  sx={{
                    color: '#A69374',
                    '&:hover': {
                      bgcolor: alpha('#A69374', 0.08),
                    },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteTask(task.id)}
                  size="small"
                  sx={{
                    color: '#E57373',
                    '&:hover': {
                      bgcolor: alpha('#E57373', 0.08),
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        ))}

        {!loading && tasks.length === 0 && (
          <Paper 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              borderRadius: '16px',
              bgcolor: '#FFFFFF',
              border: '1px dashed',
              borderColor: '#E8E3DD',
            }}
          >
            <Typography 
              color="text.secondary"
              sx={{
                color: '#8F8F8F',
                fontSize: '0.95rem',
                fontStyle: 'italic',
              }}
            >
              No tasks yet. Click "Add Task" to create one.
            </Typography>
          </Paper>
        )}
      </Stack>

      <TaskForm
        open={isAddModalOpen || !!editingTask}
        onClose={editingTask ? handleCloseEdit : onCloseAddModal}
        weddingId={weddingId}
        onTaskAdded={editingTask ? handleTaskUpdated : fetchTasks}
        task={editingTask}
      />
    </Box>
  );
};

export default TaskList; 