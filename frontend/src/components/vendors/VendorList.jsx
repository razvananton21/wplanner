import React, { useState, useEffect } from 'react';
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
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
  LocationOn as LocationIcon,
  AttachMoney as PriceIcon,
  Assignment as ContractIcon,
  PhotoCamera as PhotoIcon,
  Restaurant as CateringIcon,
  MusicNote as MusicIcon,
  Cake as CakeIcon,
  LocalFlorist as FloristIcon,
  DirectionsCar as TransportIcon,
  Celebration as CelebrationIcon,
} from '@mui/icons-material';
import vendorService from '../../services/vendorService';
import VendorForm from './VendorForm';
import { formatCurrency } from '../../utils/formatters';

const getVendorIcon = (type) => {
  switch (type) {
    case 'photographer':
    case 'videographer':
      return <PhotoIcon />;
    case 'caterer':
      return <CateringIcon />;
    case 'music':
      return <MusicIcon />;
    case 'cake':
      return <CakeIcon />;
    case 'florist':
      return <FloristIcon />;
    case 'transport':
      return <TransportIcon />;
    default:
      return <CelebrationIcon />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'contacted':
      return '#8F8F8F';
    case 'in_talks':
      return '#64B5F6';
    case 'proposal_received':
      return '#FFB74D';
    case 'booked':
    case 'confirmed':
      return '#81C784';
    case 'cancelled':
      return '#E57373';
    default:
      return '#8F8F8F';
  }
};

const formatStatus = (status) => {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const VendorList = ({ 
  weddingId, 
  searchQuery, 
  activeFilters, 
  setActiveFilters,
  isAddModalOpen,
  onCloseAddModal,
}) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingVendor, setEditingVendor] = useState(null);

  useEffect(() => {
    fetchVendors();
  }, [weddingId, searchQuery]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await vendorService.getVendors(weddingId);
      setVendors(response.vendors);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleEditVendor = (vendor) => {
    setEditingVendor(vendor);
  };

  const handleCloseEdit = () => {
    setEditingVendor(null);
  };

  const handleVendorUpdated = () => {
    fetchVendors();
    handleCloseEdit();
  };

  const handleDeleteVendor = async (vendorId) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) {
      return;
    }
    try {
      await vendorService.deleteVendor(weddingId, vendorId);
      fetchVendors();
    } catch (err) {
      setError('Failed to delete vendor');
    }
  };

  if (loading) {
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
        {vendors.map((vendor) => (
          <Paper 
            key={vendor.id} 
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
                {getVendorIcon(vendor.type)}
              </Box>

              <Box sx={{ flex: 1, ml: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography
                    sx={{
                      color: getStatusColor(vendor.status),
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}
                  >
                    {formatStatus(vendor.status)}
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
                  {vendor.name}
                </Typography>
                {vendor.company && (
                  <Typography 
                    sx={{
                      color: '#7A6B63',
                      fontSize: '0.875rem',
                      mb: 1,
                    }}
                  >
                    {vendor.company}
                  </Typography>
                )}

                <Stack spacing={1} sx={{ mt: 1.5 }}>
                  {vendor.price && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PriceIcon fontSize="small" sx={{ color: '#A69374' }} />
                      <Typography variant="body2" sx={{ color: '#7A6B63' }}>
                        {formatCurrency(vendor.price)}
                      </Typography>
                    </Box>
                  )}
                  {vendor.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon fontSize="small" sx={{ color: '#A69374' }} />
                      <Typography variant="body2" sx={{ color: '#7A6B63' }}>
                        <a href={`tel:${vendor.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {vendor.phone}
                        </a>
                      </Typography>
                    </Box>
                  )}
                  {vendor.email && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon fontSize="small" sx={{ color: '#A69374' }} />
                      <Typography variant="body2" sx={{ color: '#7A6B63' }}>
                        <a href={`mailto:${vendor.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {vendor.email}
                        </a>
                      </Typography>
                    </Box>
                  )}
                  {vendor.website && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WebsiteIcon fontSize="small" sx={{ color: '#A69374' }} />
                      <Typography variant="body2" sx={{ color: '#7A6B63' }}>
                        <a href={vendor.website} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                          {vendor.website}
                        </a>
                      </Typography>
                    </Box>
                  )}
                  {vendor.address && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon fontSize="small" sx={{ color: '#A69374' }} />
                      <Typography variant="body2" sx={{ color: '#7A6B63' }}>
                        {vendor.address}
                      </Typography>
                    </Box>
                  )}
                </Stack>

                {vendor.notes && (
                  <Typography
                    sx={{
                      mt: 2,
                      color: '#666666',
                      fontSize: '0.875rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {vendor.notes}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                <IconButton
                  onClick={() => handleEditVendor(vendor)}
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
                  onClick={() => handleDeleteVendor(vendor.id)}
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

        {!loading && vendors.length === 0 && (
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
              No vendors yet. Click "Add Vendor" to create one.
            </Typography>
          </Paper>
        )}
      </Stack>

      <VendorForm
        open={isAddModalOpen || !!editingVendor}
        onClose={editingVendor ? handleCloseEdit : onCloseAddModal}
        weddingId={weddingId}
        onSave={editingVendor ? handleVendorUpdated : fetchVendors}
        vendor={editingVendor}
      />
    </Box>
  );
};

export default VendorList; 