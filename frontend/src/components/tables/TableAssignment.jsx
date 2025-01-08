import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    TextField,
    Alert,
    CircularProgress,
    Chip,
    Divider,
    Paper
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Add as AddIcon,
    Check as CheckIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
    fetchTable,
    assignGuests,
    removeGuest,
    validateAssignment,
    fetchTables
} from '@/store/slices/tableSlice';
import { fetchGuests } from '@/features/guests/guestSlice';

const TableAssignment = ({ table, onClose }) => {
    const dispatch = useDispatch();
    const { selectedTable, loading, error, validationResult } = useSelector((state) => state.tables);
    const { guests } = useSelector((state) => state.guests);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGuests, setSelectedGuests] = useState([]);

    useEffect(() => {
        if (table && table.wedding && table.wedding.id) {
            dispatch(fetchTable(table.id));
            dispatch(fetchGuests(table.wedding.id));
        }
    }, [dispatch, table]);

    useEffect(() => {
        if (selectedTable && selectedTable.guests) {
            const fullGuests = selectedTable.guests.map(tableGuest => 
                guests.find(g => g.id === tableGuest.id) || tableGuest
            );
            setSelectedGuests(fullGuests);
        }
    }, [selectedTable, guests]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredGuests = guests.filter(guest => {
        const fullName = `${guest.firstName} ${guest.lastName}`.toLowerCase();
        const isMatchingSearch = fullName.includes(searchTerm.toLowerCase());
        const isNotSelected = !selectedGuests.find(g => g.id === guest.id);
        const isNotAssignedOrAssignedToThisTable = !guest.table || (table && guest.table.id === table.id);
        
        return isMatchingSearch && isNotSelected && isNotAssignedOrAssignedToThisTable;
    });

    const handleAddGuest = async (guest) => {
        if (!table) return;

        const newSelectedGuests = [...selectedGuests, guest];
        
        const validation = await dispatch(validateAssignment({
            tableId: table.id,
            guestIds: newSelectedGuests.map(g => g.id)
        }));

        if (validation.payload && validation.payload.isValid) {
            setSelectedGuests(newSelectedGuests);
        }
    };

    const handleRemoveGuest = (guestId) => {
        setSelectedGuests(selectedGuests.filter(guest => guest.id !== guestId));
    };

    const handleSave = async () => {
        if (!table || !table.wedding) return;

        const result = await dispatch(assignGuests({
            tableId: table.id,
            guestIds: selectedGuests.map(guest => guest.id)
        }));

        if (!result.error) {
            await dispatch(fetchTables(table.wedding.id));
            await dispatch(fetchTable(table.id));
            onClose();
        }
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(selectedGuests);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setSelectedGuests(items);
    };

    if (!selectedTable) {
        return <CircularProgress />;
    }

    return (
        <>
            <DialogTitle>
                Assign Guests to {selectedTable.name}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Capacity: {selectedGuests.length}/{selectedTable.capacity} guests
                    </Typography>
                    {validationResult && !validationResult.isValid && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            {validationResult.errors.map((error, index) => (
                                <div key={index}>{error.message}</div>
                            ))}
                        </Alert>
                    )}
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                </Box>

                <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Assigned Guests
                    </Typography>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="guests">
                            {(provided) => (
                                <List {...provided.droppableProps} ref={provided.innerRef}>
                                    {selectedGuests.map((guest, index) => (
                                        <Draggable
                                            key={guest.id}
                                            draggableId={guest.id.toString()}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <ListItem
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <ListItemText
                                                        primary={`${guest.firstName} ${guest.lastName}`}
                                                        secondary={guest.email}
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <IconButton
                                                            edge="end"
                                                            onClick={() => handleRemoveGuest(guest.id)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </List>
                            )}
                        </Droppable>
                    </DragDropContext>
                </Paper>

                <Divider sx={{ my: 2 }} />

                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Available Guests
                    </Typography>
                    <TextField
                        fullWidth
                        label="Search Guests"
                        value={searchTerm}
                        onChange={handleSearch}
                        sx={{ mb: 2 }}
                    />
                    <List>
                        {filteredGuests.map((guest) => (
                            <ListItem key={guest.id}>
                                <ListItemText
                                    primary={`${guest.firstName} ${guest.lastName}`}
                                    secondary={
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            {guest.email}
                                            {guest.dietaryRestrictions && (
                                                <Chip
                                                    size="small"
                                                    icon={<WarningIcon />}
                                                    label="Dietary Restrictions"
                                                    color="warning"
                                                />
                                            )}
                                        </Box>
                                    }
                                />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        onClick={() => handleAddGuest(guest)}
                                        disabled={selectedGuests.length >= selectedTable.capacity}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <CheckIcon />}
                >
                    Save Assignments
                </Button>
            </DialogActions>
        </>
    );
};

export default TableAssignment; 