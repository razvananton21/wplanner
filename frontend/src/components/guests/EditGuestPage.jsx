import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, IconButton, Button, Stack, alpha } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import TextField from '../common/form/TextField';
import TextArea from '../common/form/TextArea';
import Select from '../common/form/Select';
import Switch from '../common/form/Switch';
import { 
    fetchGuest, 
    updateGuest, 
    createGuest,
    selectGuestById, 
    selectGuestLoading, 
    selectGuestError 
} from '../../features/guests/guestSlice';

const categoryOptions = [
    { value: 'family', label: 'Family' },
    { value: 'friend', label: 'Friend' },
    { value: 'colleague', label: 'Colleague' },
    { value: 'other', label: 'Other' }
];

const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'declined', label: 'Declined' }
];

const commonTextFieldStyles = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        bgcolor: '#FFFFFF',
        minHeight: 44,
        '& fieldset': {
            borderColor: '#E8E3DD',
            borderWidth: '1px',
            transition: 'all 0.2s ease',
        },
        '&:hover fieldset': {
            borderColor: '#D1BFA5',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#D1BFA5',
            borderWidth: '1.5px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
        },
    },
    '& .MuiInputLabel-root': {
        color: '#7A6B63',
        fontSize: '0.875rem',
        fontFamily: 'Inter, sans-serif',
        '&.Mui-focused': {
            color: '#D1BFA5',
        },
    },
    '& .MuiInputBase-input': {
        fontSize: '1rem',
        color: '#6A6A6A',
        fontFamily: 'Inter, sans-serif',
        padding: '12px',
    },
    '& .MuiInputBase-inputMultiline': {
        padding: '12px',
    },
};

const SectionTitle = ({ children }) => (
    <Box 
        sx={{ 
            position: 'relative',
            mb: 3,
            mt: { xs: 4, sm: 5 },
            pb: 2,
            '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '1px',
                bgcolor: '#E8E3DD',
            }
        }}
    >
        <Typography 
            variant="h6" 
            sx={{ 
                color: '#5C5C5C',
                fontSize: '1.125rem',
                fontWeight: 600,
                fontFamily: 'Cormorant Garamond, serif',
                bgcolor: '#F5EFEA',
                display: 'inline-block',
                px: 1.5,
                py: 1,
                borderRadius: '6px',
                letterSpacing: '0.02em',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: 'rgba(209, 191, 165, 0.2)',
                }
            }}
        >
            {children}
        </Typography>
    </Box>
);

const EditGuestPage = () => {
    const { id, guestId } = useParams();
    const isAddMode = !guestId || guestId === 'add';
    console.log('[EditGuestPage] Mounted with params:', { id, guestId, isAddMode });
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const guest = useSelector(state => selectGuestById(state, guestId));
    const loading = useSelector(selectGuestLoading);
    const error = useSelector(selectGuestError);
    const [localGuest, setLocalGuest] = useState({
        firstName: '',
        lastName: '',
        email: '',
        category: 'family',
        status: 'pending',
        plusOne: false,
        dietaryRestrictions: ''
    });

    useEffect(() => {
        const loadGuest = async () => {
            if (!id) {
                console.error('[EditGuestPage] Missing wedding ID:', { id });
                return;
            }

            // Only fetch guest data if we're in edit mode
            if (!isAddMode) {
                console.log('[EditGuestPage] Loading guest data...');
                try {
                    await dispatch(fetchGuest({ weddingId: id, guestId })).unwrap();
                    console.log('[EditGuestPage] Guest data fetched successfully');
                } catch (err) {
                    console.error('[EditGuestPage] Error loading guest:', err);
                }
            }
        };

        loadGuest();
    }, [dispatch, id, guestId, isAddMode]);

    useEffect(() => {
        if (!isAddMode && guest) {
            console.log('[EditGuestPage] Setting local guest state:', guest);
            setLocalGuest({
                firstName: guest.firstName || '',
                lastName: guest.lastName || '',
                email: guest.email || '',
                category: guest.category || 'family',
                status: guest.status || 'pending',
                plusOne: guest.plusOne || false,
                dietaryRestrictions: guest.dietaryRestrictions || ''
            });
        }
    }, [guest, isAddMode]);

    const handleCancel = () => {
        navigate(`/weddings/${id}/guests`);
    };

    const handleSave = async () => {
        if (!id || !localGuest) {
            console.error('[EditGuestPage] Cannot save - missing data:', { id, localGuest });
            return;
        }

        try {
            if (isAddMode) {
                console.log('[EditGuestPage] Creating new guest:', { id, guest: localGuest });
                await dispatch(createGuest({ weddingId: id, guestData: localGuest })).unwrap();
                console.log('[EditGuestPage] Guest created successfully');
            } else {
                console.log('[EditGuestPage] Updating guest:', { id, guestId, guest: localGuest });
                await dispatch(updateGuest({ weddingId: id, guestId, guestData: localGuest })).unwrap();
                console.log('[EditGuestPage] Guest updated successfully');
            }
            navigate(`/weddings/${id}/guests`);
        } catch (err) {
            console.error('[EditGuestPage] Error saving guest:', err);
        }
    };

    const handleChange = (field) => (event) => {
        const newValue = field === 'plusOne' ? event.target.checked : event.target.value;
        console.log('[EditGuestPage] Field change:', { field, newValue });
        setLocalGuest(prev => ({
            ...prev,
            [field]: newValue
        }));
    };

    if (loading) {
        return (
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                Loading...
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#FAF8F4' }}>
            {/* Header */}
            <Box
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1100,
                    bgcolor: '#FAF8F4',
                    borderBottom: '1px solid',
                    borderColor: '#E8E3DD',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ 
                        px: { xs: 2, sm: 2.5 },
                        py: { xs: 2, sm: 2.25 },
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <IconButton
                            onClick={handleCancel}
                            sx={{
                                color: '#7A6B63',
                                '&:hover': { bgcolor: alpha('#7A6B63', 0.08) },
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            sx={{
                                color: '#7A6B63',
                                fontFamily: 'Cormorant Garamond, serif',
                                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                            }}
                        >
                            {isAddMode ? 'Add Guest' : 'Edit Guest'}
                        </Typography>
                    </Stack>
                </Stack>
            </Box>

            {/* Form Content */}
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
                <SectionTitle>Guest Information</SectionTitle>
                <Stack spacing={3}>
                    <TextField
                        label="First Name"
                        value={localGuest.firstName}
                        onChange={handleChange('firstName')}
                        required
                        sx={commonTextFieldStyles}
                    />
                    <TextField
                        label="Last Name"
                        value={localGuest.lastName}
                        onChange={handleChange('lastName')}
                        required
                        sx={commonTextFieldStyles}
                    />
                    <TextField
                        label="Email"
                        value={localGuest.email}
                        onChange={handleChange('email')}
                        required
                        sx={commonTextFieldStyles}
                    />
                    <Select
                        label="Category"
                        value={localGuest.category}
                        onChange={handleChange('category')}
                        options={categoryOptions}
                        required
                        sx={commonTextFieldStyles}
                    />
                    <Select
                        label="Status"
                        value={localGuest.status}
                        onChange={handleChange('status')}
                        options={statusOptions}
                        required
                        sx={commonTextFieldStyles}
                    />
                    <TextArea
                        label="Dietary Restrictions"
                        value={localGuest.dietaryRestrictions}
                        onChange={handleChange('dietaryRestrictions')}
                        multiline
                        rows={4}
                        sx={commonTextFieldStyles}
                    />
                    <Switch
                        label="Plus One"
                        checked={localGuest.plusOne}
                        onChange={handleChange('plusOne')}
                    />
                </Stack>

                {/* Action Buttons */}
                <Box sx={{ p: { xs: 2, sm: 2.5 }, borderTop: '1px solid', borderColor: '#E8E3DD' }}>
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button
                            variant="outlined"
                            onClick={handleCancel}
                            sx={{
                                borderColor: '#D1BFA5',
                                color: '#7A6B63',
                                '&:hover': {
                                    borderColor: '#7A6B63',
                                    bgcolor: 'transparent',
                                },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            sx={{
                                bgcolor: '#D1BFA5',
                                color: '#FFFFFF',
                                '&:hover': {
                                    bgcolor: '#7A6B63',
                                },
                            }}
                        >
                            {isAddMode ? 'Save Guest' : 'Save Changes'}
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
};

export default EditGuestPage; 