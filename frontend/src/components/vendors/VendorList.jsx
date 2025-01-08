import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    IconButton,
    Chip,
    Stack,
    Dialog,
    useTheme,
    useMediaQuery,
    Alert,
} from '@mui/material';
import {
    Add as AddIcon,
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

const VendorList = ({ weddingId }) => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        fetchVendors();
    }, [weddingId]);

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

    const handleOpenDialog = (vendor = null) => {
        setEditingVendor(vendor);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingVendor(null);
    };

    const handleSave = async () => {
        await fetchVendors();
        handleCloseDialog();
    };

    const handleDelete = async (vendorId) => {
        if (!window.confirm('Are you sure you want to delete this vendor?')) {
            return;
        }

        try {
            await vendorService.deleteVendor(weddingId, vendorId);
            await fetchVendors();
        } catch (err) {
            setError(err.message || 'Failed to delete vendor');
        }
    };

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
                return 'default';
            case 'in_talks':
                return 'info';
            case 'proposal_received':
                return 'warning';
            case 'booked':
                return 'success';
            case 'confirmed':
                return 'success';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const formatStatus = (status) => {
        return status.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" component="h2">
                    Vendors
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Add Vendor
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                {vendors.map((vendor) => (
                    <Grid item xs={12} md={6} key={vendor.id}>
                        <Paper sx={{ p: 3, height: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <Box sx={{ 
                                    p: 1, 
                                    borderRadius: 1, 
                                    bgcolor: 'primary.light',
                                    color: 'primary.contrastText',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    {getVendorIcon(vendor.type)}
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                        <Box>
                                            <Typography variant="h6" gutterBottom>
                                                {vendor.name}
                                            </Typography>
                                            {vendor.company && (
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    {vendor.company}
                                                </Typography>
                                            )}
                                        </Box>
                                        <Box>
                                            <IconButton onClick={() => handleOpenDialog(vendor)} size="small">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(vendor.id)} size="small" color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>

                                    <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                                        <Chip
                                            size="small"
                                            color={getStatusColor(vendor.status)}
                                            label={formatStatus(vendor.status)}
                                        />
                                        {vendor.price && (
                                            <Chip
                                                size="small"
                                                icon={<PriceIcon />}
                                                label={formatCurrency(vendor.price)}
                                            />
                                        )}
                                        {vendor.contractSigned && (
                                            <Chip
                                                size="small"
                                                icon={<ContractIcon />}
                                                label="Contract Signed"
                                                color="success"
                                            />
                                        )}
                                    </Stack>

                                    <Stack spacing={1}>
                                        {vendor.phone && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PhoneIcon fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    <a href={`tel:${vendor.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                                        {vendor.phone}
                                                    </a>
                                                </Typography>
                                            </Box>
                                        )}
                                        {vendor.email && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <EmailIcon fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    <a href={`mailto:${vendor.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                                        {vendor.email}
                                                    </a>
                                                </Typography>
                                            </Box>
                                        )}
                                        {vendor.website && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <WebsiteIcon fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    <a href={vendor.website} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                                                        {vendor.website}
                                                    </a>
                                                </Typography>
                                            </Box>
                                        )}
                                        {vendor.address && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LocationIcon fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    {vendor.address}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Stack>

                                    {vendor.notes && (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mt: 2,
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
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {!loading && vendors.length === 0 && (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                        No vendors yet. Click "Add Vendor" to create one.
                    </Typography>
                </Paper>
            )}

            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                fullScreen={isMobile}
            >
                <VendorForm
                    weddingId={weddingId}
                    vendor={editingVendor}
                    onSave={handleSave}
                    onCancel={handleCloseDialog}
                />
            </Dialog>
        </Box>
    );
};

export default VendorList; 