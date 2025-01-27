import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  TextField,
  InputAdornment,
  Badge,
  IconButton,
  Box,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import Budget from './Budget';
import EntityViewLayout from '../common/EntityViewLayout';

const BudgetPage = () => {
  const { id } = useParams();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddExpense = () => {
    setAddModalOpen(true);
  };

  return (
    <EntityViewLayout
      title="Budget"
      backUrl={`/weddings/${id}`}
      onAdd={handleAddExpense}
    >
      {/* Search and Filter Bar */}
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 1.5,
          mt: 2,
          mb: 3,
          px: { xs: 1.5, sm: 2 },
          alignItems: 'center'
        }}
      >
        <TextField
          fullWidth
          placeholder="Search expenses"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon 
                  sx={{ 
                    color: '#A69374',
                    fontSize: 20,
                    ml: 1,
                    mr: -0.5
                  }} 
                />
              </InputAdornment>
            )
          }}
          sx={{
            flex: 1,
            '& .MuiOutlinedInput-root': {
              bgcolor: '#FAF8F4',
              borderRadius: '24px',
              height: '48px',
              transition: 'all 0.2s ease-in-out',
              '& fieldset': {
                borderColor: '#E8E3DD',
                borderWidth: '1px',
              },
              '&:hover fieldset': {
                borderColor: '#D1BFA5',
              },
              '&.Mui-focused': {
                '& fieldset': {
                  borderColor: '#D1BFA5',
                  borderWidth: '1px',
                },
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(209, 191, 165, 0.15)',
              },
              '& input': {
                py: 1.5,
                pl: 1,
                fontSize: '0.9375rem',
                color: '#4A413C',
                '&::placeholder': {
                  color: '#A69374',
                  opacity: 0.8,
                  fontWeight: 400,
                }
              }
            }
          }}
        />
        <IconButton
          sx={{
            color: '#7A6B63',
            border: '1px solid #E8E3DD',
            borderRadius: '12px',
            width: 48,
            height: 48,
            flexShrink: 0,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: '#D1BFA5',
              bgcolor: 'rgba(209, 191, 165, 0.08)',
              color: '#4A413C',
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
            },
            '&:active': {
              transform: 'translateY(0)',
              boxShadow: 'none'
            }
          }}
        >
          <Badge 
            badgeContent={activeFilters.length} 
            color="primary"
            sx={{
              '& .MuiBadge-badge': {
                bgcolor: '#D1BFA5',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.75rem',
                minWidth: '18px',
                height: '18px',
              }
            }}
          >
            <FilterListIcon fontSize="small" />
          </Badge>
        </IconButton>
      </Box>

      <Budget
        weddingId={id}
        searchQuery={searchQuery}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        isAddModalOpen={isAddModalOpen}
        onCloseAddModal={() => setAddModalOpen(false)}
      />
    </EntityViewLayout>
  );
};

export default BudgetPage; 