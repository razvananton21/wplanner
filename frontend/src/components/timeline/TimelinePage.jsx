import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  TextField,
  InputAdornment,
  Badge,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import Timeline from './Timeline';
import FloatingActionButton from '../common/FloatingActionButton';

const TimelinePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  const handleAddEvent = () => {
    setAddModalOpen(true);
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          bgcolor: 'background.default',
          borderBottom: '1px solid',
          borderColor: '#E8E3DD',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
          py: 2,
          px: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={() => navigate(`/weddings/${id}`)}
              sx={{
                color: '#7A6B63',
                '&:hover': { color: '#4A413C' }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h6"
              sx={{
                color: '#4A413C',
                fontWeight: 600,
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                fontFamily: 'Cormorant Garamond, serif',
                fontStyle: 'italic'
              }}
            >
              Timeline
            </Typography>
          </Box>
          <IconButton
            sx={{ 
              color: '#7A6B63',
              '&:hover': { color: '#4A413C' }
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Box>

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
          placeholder="Search events"
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
            badgeContent={activeFilters} 
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

      {/* Content */}
      <Box sx={{ px: { xs: 2, sm: 3 } }}>
        <Timeline weddingId={id} />
      </Box>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={handleAddEvent} />
    </Box>
  );
};

export default TimelinePage; 