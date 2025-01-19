import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Edit as EditIcon,
  Delete as DeleteIcon,
  Group as GroupIcon,
  TableRestaurant as TableIcon,
  TableBar as TableBarIcon,
  TableRows as TableRowsIcon,
} from '@mui/icons-material';
import { fetchTables, deleteTable } from '../../store/slices/tableSlice';
import TableForm from './TableForm';
import TableAssignment from './TableAssignment';

const getTableIcon = (shape) => {
  switch (shape) {
    case 'round':
      return <TableIcon />;
    case 'rectangular':
      return <TableBarIcon />;
    case 'square':
      return <TableRowsIcon />;
    default:
      return <TableIcon />;
  }
};

const TableList = ({ 
  weddingId, 
  searchQuery, 
  activeFilters, 
  setActiveFilters,
  isAddModalOpen,
  onCloseAddModal,
}) => {
  const dispatch = useDispatch();
  const { tables, loading, error } = useSelector((state) => state.tables);
  const [editingTable, setEditingTable] = useState(null);
  const [assigningTable, setAssigningTable] = useState(null);

  useEffect(() => {
    if (weddingId) {
      dispatch(fetchTables(weddingId));
    }
  }, [dispatch, weddingId, searchQuery]);

  const handleEditTable = (table) => {
    setEditingTable(table);
  };

  const handleCloseEdit = () => {
    setEditingTable(null);
  };

  const handleOpenAssignment = (table) => {
    setAssigningTable({
      ...table,
      wedding: { id: weddingId }
    });
  };

  const handleCloseAssignment = () => {
    setAssigningTable(null);
  };

  const handleDeleteTable = async (tableId) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      await dispatch(deleteTable(tableId));
      dispatch(fetchTables(weddingId));
    }
  };

  if (loading && tables.length === 0) {
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
        {tables.map((table) => (
          <Paper 
            key={table.id} 
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
              <Box sx={{ 
                p: 1.5, 
                borderRadius: '12px', 
                bgcolor: alpha('#D1BFA5', 0.1),
                color: '#D1BFA5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: alpha('#D1BFA5', 0.15),
                },
              }}>
                {getTableIcon(table.shape)}
              </Box>

              <Box sx={{ flex: 1, ml: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography
                    sx={{
                      color: table.isVIP ? '#D1BFA5' : '#7A6B63',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}
                  >
                    {table.isVIP ? 'VIP Table' : table.shape.charAt(0).toUpperCase() + table.shape.slice(1)}
                  </Typography>
                </Box>
                <Typography 
                  sx={{
                    color: '#5C5C5C',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    fontFamily: 'Cormorant Garamond, serif',
                    mb: 0.5,
                  }}
                >
                  {table.name}
                </Typography>
                <Typography 
                  sx={{
                    color: '#7A6B63',
                    fontSize: '0.875rem',
                    mb: 1,
                  }}
                >
                  {table.guestCount || 0}/{table.capacity} guests
                </Typography>

                {table.location && (
                  <Typography
                    sx={{
                      mt: 1.5,
                      color: '#666666',
                      fontSize: '0.875rem',
                    }}
                  >
                    Location: {table.location}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                <IconButton
                  onClick={() => handleOpenAssignment(table)}
                  size="small"
                  sx={{
                    color: '#B0A396',
                    '&:hover': {
                      bgcolor: alpha('#B0A396', 0.1),
                    },
                  }}
                >
                  <GroupIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() => handleEditTable(table)}
                  size="small"
                  sx={{
                    color: '#B0A396',
                    '&:hover': {
                      bgcolor: alpha('#B0A396', 0.1),
                    },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteTable(table.id)}
                  size="small"
                  sx={{
                    color: '#E57373',
                    '&:hover': {
                      bgcolor: alpha('#E57373', 0.1),
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        ))}

        {!loading && tables.length === 0 && (
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
              No tables yet. Click "Add Table" to create one.
            </Typography>
          </Paper>
        )}
      </Stack>

      <TableForm
        open={isAddModalOpen || !!editingTable}
        onClose={editingTable ? handleCloseEdit : onCloseAddModal}
        weddingId={weddingId}
        onSave={() => {
          dispatch(fetchTables(weddingId));
          editingTable ? handleCloseEdit() : onCloseAddModal();
        }}
        table={editingTable}
      />

      {assigningTable && (
        <TableAssignment
          table={assigningTable}
          onClose={handleCloseAssignment}
        />
      )}
    </Box>
  );
};

export default TableList; 