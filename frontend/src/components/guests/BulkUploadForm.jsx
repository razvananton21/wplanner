import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Box,
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Alert,
    LinearProgress
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { bulkCreateGuests } from '../../features/guests/guestSlice';
import Papa from 'papaparse';

const BulkUploadForm = ({ weddingId, onClose }) => {
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile);
            setError(null);
        } else {
            setError('Please select a valid CSV file');
            setFile(null);
        }
    };

    const handleUpload = () => {
        if (!file) {
            setError('Please select a file first');
            return;
        }

        setUploading(true);
        Papa.parse(file, {
            header: true,
            complete: async (results) => {
                if (results.errors.length > 0) {
                    setError('Error parsing CSV file');
                    setUploading(false);
                    return;
                }

                try {
                    const guests = results.data.map(row => ({
                        firstName: row.firstName?.trim(),
                        lastName: row.lastName?.trim(),
                        email: row.email?.trim(),
                        category: row.category?.trim() || 'guest',
                        plusOne: row.plusOne === 'true',
                        dietaryRestrictions: row.dietaryRestrictions?.trim()
                    }));

                    await dispatch(bulkCreateGuests({
                        weddingId,
                        guestsData: guests
                    })).unwrap();

                    onClose();
                } catch (error) {
                    setError(error.message || 'Failed to upload guests');
                } finally {
                    setUploading(false);
                }
            },
            error: () => {
                setError('Error reading CSV file');
                setUploading(false);
            }
        });
    };

    const downloadTemplate = () => {
        const template = 'firstName,lastName,email,category,plusOne,dietaryRestrictions\nJohn,Doe,john@example.com,family,false,none\n';
        const blob = new Blob([template], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'guest-template.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    return (
        <>
            <DialogTitle>Bulk Upload Guests</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box
                        sx={{
                            border: '2px dashed',
                            borderColor: 'primary.main',
                            borderRadius: 1,
                            p: 3,
                            textAlign: 'center',
                            mb: 2
                        }}
                    >
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            id="csv-upload"
                        />
                        <label htmlFor="csv-upload">
                            <Button
                                component="span"
                                variant="contained"
                                startIcon={<CloudUploadIcon />}
                                disabled={uploading}
                            >
                                Select CSV File
                            </Button>
                        </label>
                        {file && (
                            <Typography sx={{ mt: 1 }}>
                                Selected: {file.name}
                            </Typography>
                        )}
                    </Box>

                    <Button
                        onClick={downloadTemplate}
                        disabled={uploading}
                        sx={{ mb: 2 }}
                    >
                        Download Template
                    </Button>

                    <Typography variant="body2" color="text.secondary">
                        The CSV file should contain the following columns:
                        firstName, lastName, email, category (optional),
                        plusOne (optional), dietaryRestrictions (optional)
                    </Typography>

                    {uploading && (
                        <Box sx={{ mt: 2 }}>
                            <LinearProgress />
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={uploading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleUpload}
                    variant="contained"
                    disabled={!file || uploading}
                >
                    Upload
                </Button>
            </DialogActions>
        </>
    );
};

export default BulkUploadForm; 