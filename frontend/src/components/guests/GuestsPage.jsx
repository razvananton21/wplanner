import React, { useState } from 'react';
import { Box, Typography, IconButton, useTheme, useMediaQuery, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { ArrowBack as ArrowBackIcon, MoreVert as MoreVertIcon, Upload as UploadIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import GuestList from './GuestList';

const GuestsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [isBulkUploadOpen, setBulkUploadOpen] = useState(false);

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
              Guest List
            </Typography>
          </Box>
          <Box>
            <IconButton
              onClick={(event) => setAnchorEl(event.currentTarget)}
              sx={{ 
                color: '#7A6B63',
                '&:hover': { color: '#4A413C' }
              }}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => {
                setBulkUploadOpen(true);
                setAnchorEl(null);
              }}>
                <ListItemIcon>
                  <UploadIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Bulk Upload</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ px: { xs: 2, sm: 3 }, mt: 3 }}>
        <GuestList weddingId={id} isBulkUploadOpen={isBulkUploadOpen} setBulkUploadOpen={setBulkUploadOpen} />
      </Box>
    </Box>
  );
};

export default GuestsPage; 