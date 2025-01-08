import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Grid,
    IconButton,
    TextField,
    Typography,
    MenuItem,
    Dialog,
    CircularProgress,
    Collapse,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Upload as UploadIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    PersonAdd as PersonAddIcon,
    GroupAdd as GroupAddIcon
} from '@mui/icons-material';
import {
    fetchGuests,
    selectFilteredGuests,
    selectGuestLoading,
    selectGuestError,
    setFilters,
    deleteGuest
} from '../../features/guests/guestSlice';
import AddGuestForm from './AddGuestForm';
import EditGuestForm from './EditGuestForm';
import BulkUploadForm from './BulkUploadForm';
import { useConfirm } from '../../hooks/useConfirm';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

const GuestList = () => {
    const { id: weddingId } = useParams();
    const dispatch = useDispatch();
    const guests = useSelector(selectFilteredGuests);
    const loading = useSelector(selectGuestLoading);
    const error = useSelector(selectGuestError);
    const { showConfirm, ConfirmDialog } = useConfirm();
    const theme = useTheme();

    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isBulkUploadOpen, setBulkUploadOpen] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState(null);

    useEffect(() => {
        dispatch(fetchGuests(weddingId));
    }, [dispatch, weddingId]);

    const handleSearch = (event) => {
        dispatch(setFilters({ searchQuery: event.target.value }));
    };

    const handleStatusFilter = (event) => {
        dispatch(setFilters({ status: event.target.value }));
    };

    const handleCategoryFilter = (event) => {
        dispatch(setFilters({ category: event.target.value }));
    };

    const handleDeleteGuest = async (guest) => {
        const confirmed = await showConfirm(
            'Delete Guest',
            `Are you sure you want to delete ${guest.firstName} ${guest.lastName}?`
        );

        if (confirmed) {
            dispatch(deleteGuest({ weddingId, guestId: guest.id }));
        }
    };

    const handleEditGuest = (guest) => {
        if (guest && guest.id) {
            setSelectedGuest(guest);
            setEditModalOpen(true);
        }
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setTimeout(() => setSelectedGuest(null), 300);
    };

    const handleAddGuest = () => {
        setAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setAddModalOpen(false);
    };

    const renderRsvpResponses = (guest) => {
        if (!guest.responses || guest.responses.length === 0) {
            return (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    No RSVP responses yet
                </Typography>
            );
        }

        return (
            <List dense sx={{ mt: 1 }}>
                {guest.responses.map((response, index) => (
                    <React.Fragment key={index}>
                        <ListItem>
                            <ListItemText
                                primary={response.field?.label}
                                secondary={response.value || 'No response'}
                            />
                        </ListItem>
                        {index < guest.responses.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </List>
        );
    };

    const GuestCard = ({ guest, onEdit, onDelete }) => {
        const theme = useTheme();
        const [expanded, setExpanded] = useState(false);

        const handleExpand = () => {
            setExpanded(!expanded);
        };

        return (
            <Card 
                elevation={0}
                sx={{
                    mb: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.2s',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                        borderColor: 'primary.main'
                    }
                }}
            >
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box>
                            <Typography variant="h6" component="div">
                                {guest.firstName} {guest.lastName}
                            </Typography>
                            {guest.email && (
                                <Typography color="text.secondary" variant="body2">
                                    {guest.email}
                                </Typography>
                            )}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small" onClick={handleExpand}>
                                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                            <IconButton size="small" onClick={() => onEdit(guest)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton size="small" onClick={() => onDelete(guest)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip 
                            label={guest.status} 
                            size="small"
                            color={guest.status === 'confirmed' ? 'success' : 'default'}
                        />
                        <Chip 
                            label={guest.category}
                            size="small"
                        />
                    </Box>

                    {/* Plus One Relationship Section */}
                    {guest.plusOneOf && (
                        <Box 
                            sx={{ 
                                mt: 2,
                                p: 1.5,
                                borderRadius: 1,
                                backgroundColor: alpha(theme.palette.info.main, 0.08),
                                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <PersonAddIcon color="info" sx={{ fontSize: '1.2rem' }} />
                            <Typography variant="body2" color="info.main">
                                Plus one of <strong>{guest.plusOneOf.firstName} {guest.plusOneOf.lastName}</strong>
                            </Typography>
                        </Box>
                    )}

                    {guest.plusOnes.length > 0 && (
                        <Box 
                            sx={{ 
                                mt: 2,
                                p: 1.5,
                                borderRadius: 1,
                                backgroundColor: alpha(theme.palette.success.main, 0.08),
                                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <GroupAddIcon color="success" sx={{ fontSize: '1.2rem' }} />
                            <Typography variant="body2" color="success.main">
                                Bringing <strong>{guest.plusOnes[0].firstName} {guest.plusOnes[0].lastName}</strong> as plus one
                            </Typography>
                        </Box>
                    )}

                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" color="primary" gutterBottom>
                                RSVP Responses
                            </Typography>
                            {guest.responses?.filter(response => response.value && response.value !== '')
                                .map((response, index) => (
                                    <Box key={index} sx={{ mt: 1 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {response.field?.label}: <strong>{response.value}</strong>
                                        </Typography>
                                    </Box>
                                ))
                            }
                            {(!guest.responses || guest.responses.length === 0 || 
                              !guest.responses.some(response => response.value && response.value !== '')) && (
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                    No responses yet
                                </Typography>
                            )}
                        </Box>
                    </Collapse>
                </CardContent>
            </Card>
        );
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={2}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5">Guest List</Typography>
                <Box>
                    <Button
                        startIcon={<UploadIcon />}
                        onClick={() => setBulkUploadOpen(true)}
                        sx={{ mr: 1 }}
                    >
                        Bulk Upload
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddGuest}
                    >
                        Add Guest
                    </Button>
                </Box>
            </Box>

            {/* Filters */}
            <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        label="Search Guests"
                        onChange={handleSearch}
                        size="small"
                    />
                </Grid>
                <Grid item xs={6} sm={4}>
                    <TextField
                        select
                        fullWidth
                        label="Status"
                        onChange={handleStatusFilter}
                        defaultValue="all"
                        size="small"
                    >
                        <MenuItem value="all">All Statuses</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="confirmed">Confirmed</MenuItem>
                        <MenuItem value="declined">Declined</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={6} sm={4}>
                    <TextField
                        select
                        fullWidth
                        label="Category"
                        onChange={handleCategoryFilter}
                        defaultValue="all"
                        size="small"
                    >
                        <MenuItem value="all">All Categories</MenuItem>
                        <MenuItem value="family">Family</MenuItem>
                        <MenuItem value="friend">Friend</MenuItem>
                        <MenuItem value="colleague">Colleague</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                    </TextField>
                </Grid>
            </Grid>

            {/* Guest List */}
            <Grid container spacing={2}>
                {guests.map((guest) => (
                    <Grid item xs={12} sm={6} md={4} key={guest.id}>
                        <GuestCard
                            guest={guest}
                            onEdit={handleEditGuest}
                            onDelete={handleDeleteGuest}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* Modals */}
            <Dialog
                open={isAddModalOpen}
                onClose={handleCloseAddModal}
                maxWidth="sm"
                fullWidth
            >
                <AddGuestForm
                    weddingId={weddingId}
                    onClose={handleCloseAddModal}
                />
            </Dialog>

            <Dialog
                open={isEditModalOpen}
                onClose={handleCloseEditModal}
                maxWidth="sm"
                fullWidth
            >
                <EditGuestForm
                    weddingId={weddingId}
                    guest={selectedGuest}
                    onClose={handleCloseEditModal}
                />
            </Dialog>

            <Dialog
                open={isBulkUploadOpen}
                onClose={() => setBulkUploadOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <BulkUploadForm
                    weddingId={weddingId}
                    onClose={() => setBulkUploadOpen(false)}
                />
            </Dialog>

            <ConfirmDialog />
        </Box>
    );
};

export default GuestList; 