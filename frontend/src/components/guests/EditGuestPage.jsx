import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, IconButton, Button, Stack, alpha } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import TextField from '../common/form/TextField';
import TextArea from '../common/form/TextArea';
import Select from '../common/form/Select';
import Switch from '../common/form/Switch';
import { fetchGuests, fetchGuest, updateGuest, selectGuestById, selectGuestLoading, selectGuestError } from '../../features/guests/guestSlice';

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
    console.log('[EditGuestPage] Mounted with params:', { id, guestId });
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const guest = useSelector(state => selectGuestById(state, guestId));
    console.log('[EditGuestPage] Guest from Redux:', guest);
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
            if (!id || !guestId) {
                console.error('[EditGuestPage] Missing required params:', { id, guestId });
                return;
            }

            console.log('[EditGuestPage] Loading guest data...');
            try {
                await dispatch(fetchGuests(id)).unwrap();
                console.log('[EditGuestPage] Guest list loaded');
                
                const result = await dispatch(fetchGuest({ weddingId: id, guestId })).unwrap();
                console.log('[EditGuestPage] Guest data fetched successfully:', result);
            } catch (err) {
                console.error('[EditGuestPage] Error loading guest:', err);
            }
        };

        loadGuest();
    }, [dispatch, id, guestId]);

    useEffect(() => {
        if (guest) {
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
    }, [guest]);

    const handleCancel = () => {
        navigate(`/weddings/${id}/guests`);
    };

    const handleSave = async () => {
        if (!id || !guestId || !localGuest) {
            console.error('[EditGuestPage] Cannot save - missing data:', { id, guestId, localGuest });
            return;
        }

        console.log('[EditGuestPage] Saving guest:', { id, guestId, guest: localGuest });
        try {
            await dispatch(updateGuest({ weddingId: id, guestId, guestData: localGuest })).unwrap();
            console.log('[EditGuestPage] Guest updated successfully');
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
                            aria-label="Go back"
                            sx={{
                                color: '#7A6B63',
                                width: 40,
                                height: 40,
                                '&:hover': {
                                    bgcolor: alpha('#7A6B63', 0.08),
                                },
                                '&:active': {
                                    transform: 'scale(0.96)',
                                },
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#7A6B63',
                                    fontSize: '0.875rem',
                                    mb: 0.5,
                                    fontStyle: 'italic',
                                    fontFamily: 'Inter, sans-serif',
                                    letterSpacing: '0.01em',
                                }}
                            >
                                Edit
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: '#5C5C5C',
                                    fontSize: '1.125rem',
                                    fontWeight: 600,
                                    lineHeight: 1.2,
                                    fontFamily: 'Cormorant Garamond, serif',
                                    letterSpacing: '0.02em',
                                }}
                            >
                                Guest Details
                            </Typography>
                        </Box>
                    </Stack>
                </Stack>
            </Box>

            {/* Main Content */}
            <Box
                sx={{
                    maxWidth: 800,
                    mx: 'auto',
                    p: { xs: 2.5, sm: 3 },
                    '& > .MuiBox-root': {
                        mb: { xs: 4, sm: 5 },
                        p: { xs: 2, sm: 2.5 },
                        borderRadius: 2,
                    },
                }}
            >
                <Box>
                    <SectionTitle>Guest Information</SectionTitle>
                    <Stack spacing={2.5}>
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
                            rows={3}
                            sx={commonTextFieldStyles}
                        />

                        <Switch
                            label="Plus One"
                            checked={localGuest.plusOne}
                            onChange={handleChange('plusOne')}
                        />
                    </Stack>
                </Box>

                {/* Bottom Actions */}
                <Box 
                    sx={{ 
                        display: 'flex', 
                        gap: { xs: 1.5, sm: 2 },
                        justifyContent: 'flex-end',
                        position: 'sticky',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        bgcolor: '#FAF8F4',
                        py: { xs: 2, sm: 2.5 },
                        px: { xs: 2, sm: 2.5 },
                        borderTop: '1px solid',
                        borderColor: '#E8E3DD',
                        mt: 'auto',
                        boxShadow: '0 -2px 4px rgba(0,0,0,0.04)',
                        zIndex: 1000,
                    }}
                >
                    <Button 
                        onClick={handleCancel}
                        sx={{
                            bgcolor: '#FFFFFF',
                            border: '1px solid',
                            borderColor: '#E8E3DD',
                            color: '#5C5C5C',
                            fontSize: '0.9375rem',
                            px: 4,
                            height: { xs: 48, sm: 44 },
                            borderRadius: 2,
                            transition: 'all 0.2s ease',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                            '&:hover': {
                                bgcolor: '#F5EFEA',
                                borderColor: '#D1BFA5',
                                color: '#4A413C',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                            },
                            '&:active': {
                                transform: 'scale(0.98) translateY(0)',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                                bgcolor: '#EFE9E4',
                            },
                            minWidth: { xs: 100, sm: 'auto' },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        sx={{
                            bgcolor: '#D1BFA5',
                            color: '#FFFFFF',
                            px: { xs: 5, sm: 6 },
                            height: { xs: 48, sm: 44 },
                            fontSize: '0.9375rem',
                            fontWeight: 600,
                            borderRadius: 2,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                bgcolor: '#C5AE94',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
                            },
                            '&:active': {
                                transform: 'scale(0.98)',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                                bgcolor: '#B9A288',
                            },
                            '&.Mui-disabled': {
                                bgcolor: alpha('#D1BFA5', 0.6),
                                color: '#FFFFFF',
                            },
                            minWidth: { xs: 140, sm: 'auto' },
                        }}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default EditGuestPage; 