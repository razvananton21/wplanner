import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
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
    Divider,
    SwipeableDrawer,
    InputAdornment,
    Menu,
    ListItemIcon,
    Badge
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Upload as UploadIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    PersonAdd as PersonAddIcon,
    GroupAdd as GroupAddIcon,
    Check as CheckIcon,
    ArrowBack as ArrowBackIcon,
    MoreVert as MoreVertIcon,
    FilterList as FilterListIcon,
    Search as SearchIcon
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
import { styled } from '@mui/material/styles';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import FormField from '../common/FormField';
import FloatingActionButton from '../common/FloatingActionButton';

const SwipeableCard = styled(Card)(({ theme }) => ({
    position: 'relative',
    overflow: 'hidden',
    marginBottom: '8px',
    borderRadius: '10px',
    border: '1px solid',
    borderColor: '#E8E3DD',
    background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF8F4 100%)',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12)',
        borderColor: '#D1BFA5',
    },
    '&:not(:last-child)': {
        borderBottom: '1px solid #F5EFEA'
    }
}));

const SwipeActions = styled(Box)(({ theme }) => ({
    position: 'absolute',
    right: 0,
    top: 0,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 2),
    gap: theme.spacing(1),
}));

const SwipeableContent = styled(animated.div)({
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    zIndex: 1,
    transition: 'transform 0.3s ease',
});

const FilterDialog = ({ open, onClose, onFilterChange }) => {
    const [filters, setFilters] = useState({
        status: 'all',
        category: 'all'
    });

    const handleChange = (field) => (event) => {
        const newFilters = {
            ...filters,
            [field]: event.target.value
        };
        setFilters(newFilters);
        onFilterChange(event);
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="xs" 
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                }
            }}
        >
            <Box sx={{ p: 3 }}>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        mb: 3,
                        color: '#4A413C',
                        fontFamily: 'Cormorant Garamond, serif',
                        fontStyle: 'italic',
                        fontSize: '1.5rem',
                        fontWeight: 600
                    }}
                >
                    Filters
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormField
                        select
                        label="Status"
                        value={filters.status}
                        onChange={handleChange('status')}
                    >
                        <MenuItem value="all">All Statuses</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="confirmed">Confirmed</MenuItem>
                        <MenuItem value="declined">Declined</MenuItem>
                    </FormField>
                    <FormField
                        select
                        label="Category"
                        value={filters.category}
                        onChange={handleChange('category')}
                    >
                        <MenuItem value="all">All Categories</MenuItem>
                        <MenuItem value="family">Family</MenuItem>
                        <MenuItem value="friend">Friend</MenuItem>
                        <MenuItem value="colleague">Colleague</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                    </FormField>
                    <Button 
                        variant="contained" 
                        onClick={onClose}
                        sx={{
                            mt: 1,
                            bgcolor: '#D1BFA5',
                            color: 'white',
                            '&:hover': {
                                bgcolor: '#B0A089'
                            },
                            height: '48px',
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontSize: '0.9375rem',
                            fontWeight: 500
                        }}
                    >
                        Apply Filters
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

const GuestList = ({ weddingId, isBulkUploadOpen, setBulkUploadOpen }) => {
    const dispatch = useDispatch();
    const guests = useSelector(selectFilteredGuests);
    const loading = useSelector(selectGuestLoading);
    const error = useSelector(selectGuestError);
    const { showConfirm, ConfirmDialog } = useConfirm();
    const theme = useTheme();
    const navigate = useNavigate();
    const { id } = useParams();

    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState(null);
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState(0);

    useEffect(() => {
        if (id) {
            dispatch(fetchGuests(id));
        }
    }, [dispatch, id]);

    const handleSearch = (event) => {
        dispatch(setFilters({ searchQuery: event.target.value }));
    };

    const handleStatusFilter = (event) => {
        const value = event.target.value;
        dispatch(setFilters({ status: value }));
        setActiveFilters(prev => {
            let count = prev;
            if (value === 'all') {
                count = Math.max(0, count - 1);
            } else if (prev === 0 || prev === undefined) {
                count = 1;
            }
            return count;
        });
    };

    const handleCategoryFilter = (event) => {
        const value = event.target.value;
        dispatch(setFilters({ category: value }));
        setActiveFilters(prev => {
            let count = prev;
            if (value === 'all') {
                count = Math.max(0, count - 1);
            } else if (prev === 0 || prev === undefined) {
                count = 1;
            }
            return count;
        });
    };

    const handleDeleteGuest = async (guest) => {
        const confirmed = await showConfirm(
            'Delete Guest',
            `Are you sure you want to delete ${guest.firstName} ${guest.lastName}?`
        );

        if (confirmed) {
            dispatch(deleteGuest({ weddingId: id, guestId: guest.id }));
        }
    };

    const handleEditGuest = (guest) => {
        if (guest && guest.id) {
            navigate(`/weddings/${id}/guests/${guest.id}/edit`);
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
        const [expanded, setExpanded] = useState(false);
        const [isDragging, setIsDragging] = useState(false);
        
        const [{ x }, api] = useSpring(() => ({ x: 0 }));

        const bind = useDrag(({ active, down, movement: [mx], velocity }) => {
            const trigger = velocity > 0.2 || Math.abs(mx) > 100;
            
            if (!down) {
                if (trigger) {
                    // Swipe right (delete)
                    if (mx > 0) {
                        onDelete(guest);
                    } 
                    // Swipe left (edit)
                    else if (mx < 0) {
                        onEdit(guest);
                    }
                }
                // Reset position when released
                api.start({ 
                    x: 0,
                    immediate: false,
                    config: { tension: 500, friction: 25 }
                });
            } else {
                // While dragging
                api.start({ 
                    x: mx, 
                    immediate: true 
                });
            }
            
            setIsDragging(down && Math.abs(mx) > 5);
        }, {
            axis: 'x',
            bounds: { left: -110, right: 110 },
            rubberband: true,
            from: () => [0, 0],
            preventScroll: true,
            filterTaps: true
        });

        const expandAnimation = useSpring({
            from: { height: 0, opacity: 0 },
            to: {
                height: expanded ? 'auto' : 0,
                opacity: expanded ? 1 : 0
            },
            config: { 
                tension: 280, 
                friction: 24,
                duration: 300
            }
        });

        const chevronAnimation = useSpring({
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            config: { 
                tension: 300, 
                friction: 20 
            }
        });

        const handleExpand = (e) => {
            // Only toggle if not dragging and not clicking action buttons
            if (!isDragging && !e.target.closest('button')) {
                setExpanded(!expanded);
            }
        };

        return (
            <SwipeableCard>
                <SwipeableContent {...bind()} style={{ x }}>
                    <CardContent sx={{ 
                        py: '12px !important',
                        px: '16px !important',
                        '&:last-child': {
                            paddingBottom: '12px !important'
                        }
                    }}>
                        {/* Guest Header */}
                        <Box 
                            onClick={handleExpand}
                            sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                cursor: 'pointer',
                                py: 1.5,
                                px: 2,
                                bgcolor: 'transparent',
                                height: '100%'
                            }}
                        >
                            <Box sx={{ 
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2
                            }}>
                                <Box>
                                <Typography 
                                    variant="h6" 
                                    sx={{
                                        color: '#4A413C',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        fontFamily: 'Inter, sans-serif',
                                        letterSpacing: '0.01em',
                                            mb: 0.75
                                    }}
                                >
                                    {guest.firstName} {guest.lastName}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <Chip 
                                        label={guest.status} 
                                        size="small"
                                        sx={{
                                            bgcolor: guest.status === 'confirmed' 
                                                ? 'rgba(168, 198, 134, 0.15)' 
                                                : guest.status === 'declined'
                                                ? 'rgba(216, 124, 124, 0.15)'
                                                : 'rgba(209, 191, 165, 0.15)',
                                            color: guest.status === 'confirmed'
                                                ? '#5B8A3C'
                                                : guest.status === 'declined'
                                                ? '#B35454'
                                                : '#A69374',
                                            borderRadius: '12px',
                                            fontFamily: 'Inter, sans-serif',
                                            fontWeight: 500,
                                            fontSize: '0.75rem',
                                            textTransform: 'capitalize',
                                                height: '22px',
                                            border: '1px solid',
                                            borderColor: guest.status === 'confirmed' 
                                                ? '#A8C686' 
                                                : guest.status === 'declined'
                                                ? '#D87C7C'
                                                : '#D1BFA5',
                                        }}
                                    />
                                    <Chip 
                                        label={guest.category} 
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(232, 227, 221, 0.5)',
                                            color: '#7A6B63',
                                            borderRadius: '12px',
                                            fontFamily: 'Inter, sans-serif',
                                            fontWeight: 500,
                                            fontSize: '0.75rem',
                                            textTransform: 'capitalize',
                                                height: '22px',
                                            border: '1px solid #E8E3DD',
                                        }}
                                    />
                                    </Box>
                                </Box>
                            </Box>
                            <animated.div style={chevronAnimation}>
                                <IconButton 
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleExpand(e);
                                    }}
                                    sx={{
                                        color: '#7A6B63',
                                        width: 40,
                                        height: 40,
                                        ml: 1,
                                        transition: 'all 0.3s ease',
                                        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                        '&:hover': {
                                            color: '#4A413C',
                                            bgcolor: 'rgba(122, 107, 99, 0.08)',
                                        }
                                    }}
                                >
                                    <ExpandMoreIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                            </animated.div>
                        </Box>

                        {/* Expandable Content */}
                        <animated.div style={{
                            ...expandAnimation,
                            display: expanded ? 'block' : 'none',
                            position: 'relative'
                        }}>
                            <Box 
                                sx={{ 
                                    mt: 1, 
                                    pt: 2, 
                                    px: 2,
                                    pb: 2,
                                    borderTop: '1px solid #F5EFEA',
                                    bgcolor: 'rgba(250, 248, 244, 0.5)',
                                    opacity: expanded ? 1 : 0,
                                    transition: 'opacity 0.3s ease-in-out'
                                }}
                            >
                                {/* Email Address */}
                                <Typography 
                                    sx={{
                                        color: '#7A6B63',
                                        fontSize: '0.875rem',
                                        fontFamily: 'Inter, sans-serif',
                                        mb: 2.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        opacity: 0.85,
                                        letterSpacing: '0.01em'
                                    }}
                                >
                                    {guest.email}
                                </Typography>

                                {/* RSVP Responses Section */}
                                <Box>
                                    <Typography 
                                        variant="subtitle2" 
                                        sx={{
                                            color: '#5C5C5C',
                                            fontWeight: 600,
                                            mb: 1.5,
                                            fontSize: '0.875rem',
                                            letterSpacing: '0.01em'
                                        }}
                                    >
                                        RSVP Responses
                                    </Typography>
                                    <Box sx={{ 
                                        bgcolor: 'white', 
                                        borderRadius: '8px',
                                        border: '1px solid #E8E3DD',
                                        overflow: 'hidden',
                                        '& .MuiListItem-root': {
                                            py: 1.5,
                                            px: 2
                                        },
                                        '& .MuiListItemText-primary': {
                                            color: '#4A413C',
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            mb: 0.5
                                        },
                                        '& .MuiListItemText-secondary': {
                                            color: '#7A6B63',
                                            fontSize: '0.875rem',
                                            fontStyle: 'italic'
                                        },
                                        '& .MuiDivider-root': {
                                            borderColor: '#E8E3DD'
                                        }
                                    }}>
                                        {renderRsvpResponses(guest)}
                                    </Box>
                                </Box>

                                {/* Action Buttons */}
                                <Box sx={{ 
                                    display: 'flex', 
                                    gap: 1, 
                                    mt: 2.5,
                                    justifyContent: 'flex-end'
                                }}>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(guest);
                                        }}
                                        sx={{
                                            color: '#D1BFA5',
                                            width: 44,
                                            height: 44,
                                            border: '1px solid #E8E3DD',
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': {
                                                bgcolor: 'rgba(209, 191, 165, 0.12)',
                                                color: '#B0A089',
                                                borderColor: '#D1BFA5',
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                            },
                                            '&:active': {
                                                transform: 'translateY(0px)',
                                                boxShadow: 'none'
                                            }
                                        }}
                                    >
                                        <EditIcon sx={{ fontSize: 24 }} />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(guest);
                                        }}
                                        sx={{
                                            color: '#D87C7C',
                                            width: 44,
                                            height: 44,
                                            border: '1px solid #E8E3DD',
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': {
                                                bgcolor: 'rgba(216, 124, 124, 0.12)',
                                                color: '#C56666',
                                                borderColor: '#D87C7C',
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                            },
                                            '&:active': {
                                                transform: 'translateY(0px)',
                                                boxShadow: 'none'
                                            }
                                        }}
                                    >
                                        <DeleteIcon sx={{ fontSize: 24 }} />
                                    </IconButton>
                                </Box>
                            </Box>
                        </animated.div>
                    </CardContent>
                </SwipeableContent>
                {/* Delete action (left swipe) */}
                <Box
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(guest);
                    }}
                    sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 110,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#D87C7C',
                        color: 'white',
                        zIndex: 0,
                        transition: 'background-color 0.2s ease',
                        cursor: 'pointer',
                        '&:hover': {
                            bgcolor: '#C56666'
                        },
                        '&:active': {
                            bgcolor: '#B35454',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                        }
                    }}
                >
                    <DeleteIcon sx={{ fontSize: 24 }} />
                </Box>
                {/* Edit action (right swipe) */}
                <Box
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(guest);
                    }}
                    sx={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: 110,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#D1BFA5',
                        color: 'white',
                        zIndex: 0,
                        transition: 'background-color 0.2s ease',
                        cursor: 'pointer',
                        '&:hover': {
                            bgcolor: '#B0A089'
                        },
                        '&:active': {
                            bgcolor: '#A69374',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                        }
                    }}
                >
                    <EditIcon sx={{ fontSize: 24 }} />
                </Box>
            </SwipeableCard>
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
            {/* Search and Filter Bar */}
            <Box 
                sx={{ 
                    display: 'flex', 
                    gap: 1.5, 
                    mt: 2,
                    mb: 3,
                    px: { xs: 1.5, sm: 2 },
                    alignItems: 'center'
                }}
            >
                <TextField
                    fullWidth
                    placeholder="Search by name or email"
                    onChange={handleSearch}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon 
                                    sx={{ 
                                        color: '#A69374',
                                        fontSize: 20,
                                        ml: 1,
                                        mr: -0.5
                                    }} 
                                />
                            </InputAdornment>
                        )
                    }}
                    sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                            bgcolor: '#FAF8F4',
                            borderRadius: '24px',
                            height: '48px',
                            transition: 'all 0.2s ease-in-out',
                            '& fieldset': {
                                borderColor: '#E8E3DD',
                                borderWidth: '1px',
                            },
                            '&:hover fieldset': {
                                borderColor: '#D1BFA5',
                            },
                            '&.Mui-focused': {
                                '& fieldset': {
                                    borderColor: '#D1BFA5',
                                    borderWidth: '1px',
                                },
                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(209, 191, 165, 0.15)',
                            },
                            '& input': {
                                py: 1.5,
                                pl: 1,
                                fontSize: '0.9375rem',
                                color: '#4A413C',
                                '&::placeholder': {
                                    color: '#A69374',
                                    opacity: 0.8,
                                    fontWeight: 400,
                                }
                            }
                        }
                    }}
                />
                <IconButton
                    onClick={() => setFilterDialogOpen(true)}
                    sx={{
                        color: '#7A6B63',
                        border: '1px solid #E8E3DD',
                        borderRadius: '12px',
                        width: 48,
                        height: 48,
                        flexShrink: 0,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            borderColor: '#D1BFA5',
                            bgcolor: 'rgba(209, 191, 165, 0.08)',
                            color: '#4A413C',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                        },
                        '&:active': {
                            transform: 'translateY(0)',
                            boxShadow: 'none'
                        }
                    }}
                >
                    <Badge 
                        badgeContent={activeFilters} 
                        color="primary"
                        sx={{
                            '& .MuiBadge-badge': {
                                bgcolor: '#D1BFA5',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                minWidth: '18px',
                                height: '18px',
                            }
                        }}
                    >
                        <FilterListIcon fontSize="small" />
                    </Badge>
                </IconButton>
            </Box>

            {/* Filter Dialog */}
            <FilterDialog 
                open={filterDialogOpen}
                onClose={() => setFilterDialogOpen(false)}
                onFilterChange={(e) => {
                    handleStatusFilter(e);
                    handleCategoryFilter(e);
                }}
            />

            {/* Guest List */}
            <Grid container spacing={2}>
                {guests.map((guest) => (
                    <Grid item xs={12} key={guest.id}>
                        <GuestCard
                            guest={guest}
                            onEdit={handleEditGuest}
                            onDelete={handleDeleteGuest}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* Floating Action Button */}
            <FloatingActionButton onClick={handleAddGuest} />

            {/* Modals */}
            <Dialog
                open={isAddModalOpen}
                onClose={handleCloseAddModal}
                maxWidth="sm"
                fullWidth
            >
                <AddGuestForm
                    weddingId={id}
                    onClose={handleCloseAddModal}
                />
            </Dialog>

            <Dialog
                open={isBulkUploadOpen}
                onClose={() => setBulkUploadOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <BulkUploadForm
                    weddingId={id}
                    onClose={() => setBulkUploadOpen(false)}
                />
            </Dialog>

            <ConfirmDialog />
        </Box>
    );
};

export default GuestList; 