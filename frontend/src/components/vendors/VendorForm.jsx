import React, { useState } from 'react';
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
  Dialog,
  alpha,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Upload as UploadIcon,
  PhotoCamera as PhotoIcon,
  Restaurant as CateringIcon,
  MusicNote as MusicIcon,
  Cake as CakeIcon,
  LocalFlorist as FloristIcon,
  DirectionsCar as TransportIcon,
  Celebration as CelebrationIcon,
} from '@mui/icons-material';
import vendorService from '../../services/vendorService';

const vendorTypes = [
  { value: 'photographer', label: 'Photographer', icon: PhotoIcon },
  { value: 'videographer', label: 'Videographer', icon: PhotoIcon },
  { value: 'caterer', label: 'Caterer', icon: CateringIcon },
  { value: 'florist', label: 'Florist', icon: FloristIcon },
  { value: 'music', label: 'Music', icon: MusicIcon },
  { value: 'venue', label: 'Venue', icon: CelebrationIcon },
  { value: 'decor', label: 'Decor', icon: CelebrationIcon },
  { value: 'cake', label: 'Cake', icon: CakeIcon },
  { value: 'attire', label: 'Attire', icon: CelebrationIcon },
  { value: 'transport', label: 'Transport', icon: TransportIcon },
  { value: 'other', label: 'Other', icon: CelebrationIcon },
];

const vendorStatuses = [
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_talks', label: 'In Talks' },
  { value: 'proposal_received', label: 'Proposal Received' },
  { value: 'booked', label: 'Booked' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const VendorForm = ({ open, onClose, weddingId, onSave, vendor }) => {
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
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          bgcolor: '#FFFFFF',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <DialogTitle sx={{
        color: '#5C5C5C',
        fontSize: '1.25rem',
        fontWeight: 600,
        fontFamily: 'Cormorant Garamond, serif',
        borderBottom: '1px solid #E8E3DD',
        pb: 2,
      }}>
        {vendor ? 'Edit Vendor' : 'Add Vendor'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'error.light',
              }} 
              onClose={() => setError(null)}
            >
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#FAFAFA',
                    '&:hover fieldset': {
                      borderColor: '#D1BFA5',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#D1BFA5',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Company"
                fullWidth
                value={formData.company}
                onChange={handleInputChange('company')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#FAFAFA',
                    '&:hover fieldset': {
                      borderColor: '#D1BFA5',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#D1BFA5',
                    },
                  },
                }}
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#FAFAFA',
                    '&:hover fieldset': {
                      borderColor: '#D1BFA5',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#D1BFA5',
                    },
                  },
                }}
              >
                {vendorTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <type.icon sx={{ color: '#D1BFA5' }} />
                      {type.label}
                    </Box>
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#FAFAFA',
                    '&:hover fieldset': {
                      borderColor: '#D1BFA5',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#D1BFA5',
                    },
                  },
                }}
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#FAFAFA',
                    '&:hover fieldset': {
                      borderColor: '#D1BFA5',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#D1BFA5',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleInputChange('email')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#FAFAFA',
                    '&:hover fieldset': {
                      borderColor: '#D1BFA5',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#D1BFA5',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Website"
                fullWidth
                value={formData.website}
                onChange={handleInputChange('website')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#FAFAFA',
                    '&:hover fieldset': {
                      borderColor: '#D1BFA5',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#D1BFA5',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                fullWidth
                value={formData.address}
                onChange={handleInputChange('address')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#FAFAFA',
                    '&:hover fieldset': {
                      borderColor: '#D1BFA5',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#D1BFA5',
                    },
                  },
                }}
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#FAFAFA',
                    '&:hover fieldset': {
                      borderColor: '#D1BFA5',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#D1BFA5',
                    },
                  },
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#FAFAFA',
                    '&:hover fieldset': {
                      borderColor: '#D1BFA5',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#D1BFA5',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.depositPaid}
                    onChange={handleSwitchChange('depositPaid')}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#D1BFA5',
                        '&:hover': {
                          bgcolor: alpha('#D1BFA5', 0.08),
                        },
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        bgcolor: '#D1BFA5',
                      },
                    }}
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
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#D1BFA5',
                        '&:hover': {
                          bgcolor: alpha('#D1BFA5', 0.08),
                        },
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        bgcolor: '#D1BFA5',
                      },
                    }}
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#FAFAFA',
                    '&:hover fieldset': {
                      borderColor: '#D1BFA5',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#D1BFA5',
                    },
                  },
                }}
              />
            </Grid>
          </Grid>

          {vendor && (
            <Box>
              <Typography 
                variant="subtitle1" 
                gutterBottom
                sx={{
                  color: '#5C5C5C',
                  fontSize: '1rem',
                  fontWeight: 600,
                  mb: 1.5,
                }}
              >
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
                  sx={{
                    borderColor: '#D1BFA5',
                    color: '#D1BFA5',
                    '&:hover': {
                      borderColor: '#C1AF95',
                      bgcolor: alpha('#D1BFA5', 0.08),
                    },
                  }}
                >
                  Upload File
                </Button>
              </label>

              <Box sx={{ mt: 2 }}>
                {files.map((file) => (
                  <Box 
                    key={file.id}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      p: 1.5,
                      mb: 1,
                      borderRadius: '8px',
                      bgcolor: '#FAFAFA',
                      border: '1px solid #E8E3DD',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ color: '#5C5C5C' }}>
                        {file.originalFilename}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#8F8F8F' }}>
                        Type: {file.type}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleFileDelete(file.id)}
                      sx={{
                        color: '#E57373',
                        '&:hover': {
                          bgcolor: alpha('#E57373', 0.08),
                        },
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: '1px solid #E8E3DD' }}>
        <Button 
          onClick={onClose}
          sx={{
            color: '#8F8F8F',
            '&:hover': {
              bgcolor: alpha('#8F8F8F', 0.08),
            },
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          sx={{
            bgcolor: '#D1BFA5',
            color: '#FFFFFF',
            '&:hover': {
              bgcolor: '#C1AF95',
            },
          }}
        >
          {vendor ? 'Save Changes' : 'Add Vendor'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VendorForm; 