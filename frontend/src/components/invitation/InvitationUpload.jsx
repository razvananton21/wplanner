import React, { useState } from 'react';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import weddingService from '../../services/weddingService';

const InvitationUpload = ({ weddingId, onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        console.log('Selected file:', selectedFile);
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
        console.log('Starting upload for wedding ID:', weddingId);
        console.log('File to upload:', file);

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('invitation', file);
            
            // Log the FormData contents
            for (let pair of formData.entries()) {
                console.log('FormData content:', pair[0], pair[1]);
            }

            const response = await weddingService.uploadInvitation(weddingId, formData);
            console.log('Upload response:', response);
            onUploadSuccess();
            setFile(null);
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.message || 'Failed to upload invitation');
        } finally {
            setUploading(false);
        }
    };

    // Add drag and drop functionality
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const droppedFile = e.dataTransfer.files[0];
        console.log('Dropped file:', droppedFile);
        
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
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                sx={{
                    border: '2px dashed',
                    borderColor: 'primary.main',
                    borderRadius: 1,
                    p: 3,
                    textAlign: 'center',
                    mb: 2,
                    backgroundColor: 'background.paper',
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: 'action.hover',
                        borderColor: 'primary.dark'
                    }
                }}
            >
                <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="invitation-upload"
                />
                <label htmlFor="invitation-upload">
                    <Button
                        component="span"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        disabled={uploading}
                        sx={{ mb: 1 }}
                    >
                        Select PDF Invitation
                    </Button>
                </label>
                {file && (
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        Selected: {file.name}
                    </Typography>
                )}
                {!file && (
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        Drag and drop a PDF file here or click to select
                    </Typography>
                )}
            </Box>

            <Button
                onClick={handleUpload}
                variant="contained"
                disabled={!file || uploading}
                fullWidth
                sx={{ 
                    position: 'relative',
                    height: 48,
                    backgroundColor: 'primary.main',
                    '&:hover': {
                        backgroundColor: 'primary.dark'
                    }
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
                                color: 'white'
                            }}
                        />
                        <span style={{ visibility: 'hidden' }}>Uploading...</span>
                    </>
                ) : (
                    'Upload Invitation'
                )}
            </Button>
        </Box>
    );
};

export default InvitationUpload; 