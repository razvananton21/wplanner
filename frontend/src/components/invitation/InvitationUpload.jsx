import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Alert, 
  CircularProgress,
  Stack,
  alpha,
} from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import weddingService from '../../services/weddingService';

const InvitationUpload = ({ weddingId, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a PDF file');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('invitation', file);
      await weddingService.uploadInvitation(weddingId, formData);
      onUploadSuccess();
      setFile(null);
    } catch (err) {
      setError(err.message || 'Failed to upload invitation');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Please drop a PDF file');
    }
  };

  return (
    <Box>
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            borderRadius: '8px',
          }}
        >
          {error}
        </Alert>
      )}

      <Box
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        sx={{
          border: '2px dashed',
          borderColor: '#E8E3DD',
          borderRadius: '8px',
          p: { xs: 3, sm: 4 },
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: '#FFFFFF',
          transition: 'all 0.2s ease-in-out',
          minHeight: { xs: 280, sm: 240 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 0px 2px 4px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          '&:hover': {
            borderColor: '#D1BFA5',
            borderStyle: 'solid',
            bgcolor: alpha('#FAF8F4', 0.6),
            transform: 'translateY(-1px)',
            boxShadow: 'inset 0px 2px 4px rgba(0, 0, 0, 0.1), 0px 4px 12px rgba(0, 0, 0, 0.05)',
          },
          '&.dragover': {
            borderColor: '#D1BFA5',
            borderStyle: 'solid',
            bgcolor: alpha('#FAF8F4', 0.8),
            boxShadow: 'inset 0px 2px 8px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="invitation-upload"
        />
        <label htmlFor="invitation-upload" style={{ width: '100%' }}>
          {file ? (
            <Stack spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: alpha('#D1BFA5', 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1,
                }}
              >
                <PdfIcon sx={{ fontSize: 40, color: '#D1BFA5' }} />
              </Box>
              <Typography
                sx={{
                  color: '#5C5C5C',
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {file.name}
              </Typography>
              <Typography
                sx={{
                  color: '#7A6B63',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Click to change file
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={3} alignItems="center">
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: alpha('#B0A396', 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1,
                  transition: 'all 0.2s ease',
                  '& svg': {
                    transition: 'transform 0.2s ease',
                  },
                  ':hover': {
                    bgcolor: alpha('#B0A396', 0.15),
                    '& svg': {
                      transform: 'scale(1.1)',
                    },
                  },
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 40, color: '#B0A396' }} />
              </Box>
              <Stack spacing={1} alignItems="center">
                <Typography 
                  sx={{
                    color: '#5C5C5C',
                    fontSize: '1.125rem',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '0.01em',
                  }}
                >
                  Upload Invitation
                </Typography>
                <Typography 
                  sx={{
                    color: '#7A6B63',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    maxWidth: '280px',
                    textAlign: 'center',
                    lineHeight: 1.5,
                  }}
                >
                  Drag and drop to upload or click to select a PDF file
                </Typography>
              </Stack>
            </Stack>
          )}
        </label>
      </Box>

      {file && (
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={uploading}
          fullWidth
          sx={{ 
            mt: 2,
            height: 48,
            bgcolor: '#D1BFA5',
            color: '#FFFFFF',
            borderRadius: '8px',
            '&:hover': {
              bgcolor: '#C1AF95',
            },
            position: 'relative',
          }}
        >
          {uploading ? (
            <>
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  left: '50%',
                  marginLeft: '-12px',
                  color: 'white',
                }}
              />
              <span style={{ visibility: 'hidden' }}>Uploading...</span>
            </>
          ) : (
            'Upload Invitation'
          )}
        </Button>
      )}
    </Box>
  );
};

export default InvitationUpload; 