import React from 'react';
import {
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import FloatingActionButton from './FloatingActionButton';

const EntityViewLayout = ({
  title,
  backUrl,
  onAdd,
  children,
  showBackButton = true,
  showMoreOptions = true,
  showAddButton = true,
  headerContent,
}) => {
  const navigate = useNavigate();

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
            {showBackButton && (
              <IconButton
                onClick={() => navigate(backUrl)}
                sx={{
                  color: '#7A6B63',
                  '&:hover': { color: '#4A413C' }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
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
              {title}
            </Typography>
          </Box>
          {showMoreOptions && (
            <IconButton
              sx={{ 
                color: '#7A6B63',
                '&:hover': { color: '#4A413C' }
              }}
            >
              <MoreVertIcon />
            </IconButton>
          )}
        </Box>
        {headerContent && (
          <Box sx={{ mt: 2 }}>
            {headerContent}
          </Box>
        )}
      </Box>

      {/* Content */}
      <Box sx={{ px: { xs: 2, sm: 3 } }}>
        {children}
      </Box>

      {/* Floating Action Button */}
      {showAddButton && onAdd && (
        <FloatingActionButton onClick={onAdd} />
      )}
    </Box>
  );
};

export default EntityViewLayout; 