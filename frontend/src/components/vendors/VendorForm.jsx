import { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    FormControlLabel,
    Switch,
    Grid,
    Typography,
    Alert,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Upload as UploadIcon,
} from '@mui/icons-material';
import vendorService from '../../services/vendorService';

const vendorTypes = [
    { value: 'photographer', label: 'Photographer' },
    { value: 'videographer', label: 'Videographer' },
    { value: 'caterer', label: 'Caterer' },
    { value: 'florist', label: 'Florist' },
    { value: 'music', label: 'Music' },
    { value: 'venue', label: 'Venue' },
    { value: 'decor', label: 'Decor' },
    { value: 'cake', label: 'Cake' },
    { value: 'attire', label: 'Attire' },
    { value: 'transport', label: 'Transport' },
    { value: 'other', label: 'Other' },
];

const vendorStatuses = [
    { value: 'contacted', label: 'Contacted' },
    { value: 'in_talks', label: 'In Talks' },
    { value: 'proposal_received', label: 'Proposal Received' },
    { value: 'booked', label: 'Booked' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'cancelled', label: 'Cancelled' },
];

const VendorForm = ({ weddingId, vendor, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: vendor?.name || '',
        company: vendor?.company || '',
        type: vendor?.type || 'other',
        status: vendor?.status || 'contacted',
        phone: vendor?.phone || '',
        email: vendor?.email || '',
        website: vendor?.website || '',
        address: vendor?.address || '',
        notes: vendor?.notes || '',
        price: vendor?.price || '',
        depositAmount: vendor?.depositAmount || '',
        depositPaid: vendor?.depositPaid || false,
        contractSigned: vendor?.contractSigned || false,
    });
    const [error, setError] = useState(null);
    const [files, setFiles] = useState(vendor?.files || []);
    const [uploading, setUploading] = useState(false);

    const handleInputChange = (field) => (event) => {
        setFormData({
            ...formData,
            [field]: event.target.value,
        });
    };

    const handleSwitchChange = (field) => (event) => {
        setFormData({
            ...formData,
            [field]: event.target.checked,
        });
    };

    const handleSubmit = async () => {
        try {
            if (vendor) {
                await vendorService.updateVendor(weddingId, vendor.id, formData);
            } else {
                await vendorService.createVendor(weddingId, formData);
            }
            onSave();
        } catch (err) {
            setError(err.message || 'Failed to save vendor');
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const response = await vendorService.uploadFile(weddingId, vendor.id, file);
            setFiles([...files, response.file]);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    const handleFileDelete = async (fileId) => {
        try {
            await vendorService.deleteFile(weddingId, vendor.id, fileId);
            setFiles(files.filter(f => f.id !== fileId));
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to delete file');
        }
    };

    return (
        <>
            <DialogTitle>
                {vendor ? 'Edit Vendor' : 'Add Vendor'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {error && (
                        <Alert severity="error" onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Name"
                                fullWidth
                                required
                                value={formData.name}
                                onChange={handleInputChange('name')}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Company"
                                fullWidth
                                value={formData.company}
                                onChange={handleInputChange('company')}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                label="Type"
                                fullWidth
                                required
                                value={formData.type}
                                onChange={handleInputChange('type')}
                            >
                                {vendorTypes.map((type) => (
                                    <MenuItem key={type.value} value={type.value}>
                                        {type.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                label="Status"
                                fullWidth
                                required
                                value={formData.status}
                                onChange={handleInputChange('status')}
                            >
                                {vendorStatuses.map((status) => (
                                    <MenuItem key={status.value} value={status.value}>
                                        {status.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Phone"
                                fullWidth
                                value={formData.phone}
                                onChange={handleInputChange('phone')}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Email"
                                type="email"
                                fullWidth
                                value={formData.email}
                                onChange={handleInputChange('email')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Website"
                                fullWidth
                                value={formData.website}
                                onChange={handleInputChange('website')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Address"
                                fullWidth
                                value={formData.address}
                                onChange={handleInputChange('address')}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Price"
                                type="number"
                                fullWidth
                                value={formData.price}
                                onChange={handleInputChange('price')}
                                InputProps={{
                                    startAdornment: '$',
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Deposit Amount"
                                type="number"
                                fullWidth
                                value={formData.depositAmount}
                                onChange={handleInputChange('depositAmount')}
                                InputProps={{
                                    startAdornment: '$',
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.depositPaid}
                                        onChange={handleSwitchChange('depositPaid')}
                                    />
                                }
                                label="Deposit Paid"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.contractSigned}
                                        onChange={handleSwitchChange('contractSigned')}
                                    />
                                }
                                label="Contract Signed"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Notes"
                                multiline
                                rows={4}
                                fullWidth
                                value={formData.notes}
                                onChange={handleInputChange('notes')}
                            />
                        </Grid>
                    </Grid>

                    {vendor && (
                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Files
                            </Typography>
                            <input
                                type="file"
                                id="file-upload"
                                style={{ display: 'none' }}
                                onChange={handleFileUpload}
                            />
                            <label htmlFor="file-upload">
                                <Button
                                    component="span"
                                    variant="outlined"
                                    startIcon={<UploadIcon />}
                                    disabled={uploading}
                                >
                                    Upload File
                                </Button>
                            </label>

                            <List>
                                {files.map((file) => (
                                    <ListItem key={file.id}>
                                        <ListItemText
                                            primary={file.originalFilename}
                                            secondary={`Type: ${file.type}`}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                edge="end"
                                                onClick={() => handleFileDelete(file.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">
                    {vendor ? 'Save Changes' : 'Add Vendor'}
                </Button>
            </DialogActions>
        </>
    );
};

export default VendorForm; 