import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
    Box,
    Grid,
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    IconButton,
    Dialog,
    useTheme,
    useMediaQuery,
    LinearProgress,
    Alert
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Group as GroupIcon
} from '@mui/icons-material';
import { fetchTables, deleteTable } from '../../store/slices/tableSlice';
import TableForm from './TableForm';
import TableAssignment from './TableAssignment';

const TableList = () => {
    const { id: weddingId } = useParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const dispatch = useDispatch();
    const { tables, loading, error } = useSelector((state) => state.tables);

    const [openForm, setOpenForm] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [openAssignment, setOpenAssignment] = useState(false);

    useEffect(() => {
        if (weddingId) {
            dispatch(fetchTables(weddingId));
        }
    }, [dispatch, weddingId]);

    const handleOpenForm = (table = null) => {
        setSelectedTable(table);
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setSelectedTable(null);
        setOpenForm(false);
    };

    const handleOpenAssignment = (table) => {
        const tableWithWedding = {
            ...table,
            wedding: { id: weddingId }
        };
        setSelectedTable(tableWithWedding);
        setOpenAssignment(true);
    };

    const handleCloseAssignment = () => {
        setSelectedTable(null);
        setOpenAssignment(false);
    };

    const handleDelete = async (tableId) => {
        if (window.confirm('Are you sure you want to delete this table?')) {
            await dispatch(deleteTable(tableId));
            dispatch(fetchTables(weddingId));
        }
    };

    if (loading && tables.length === 0) {
        return <LinearProgress />;
    }

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h2">
                    Tables
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenForm()}
                >
                    Add Table
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={2}>
                {tables.map((table) => (
                    <Grid item xs={12} sm={6} md={4} key={table.id}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative'
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" component="h3" gutterBottom>
                                    {table.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Shape: {table.shape}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Capacity: {table.guestCount}/{table.capacity}
                                </Typography>
                                {table.location && (
                                    <Typography variant="body2" color="text.secondary">
                                        Location: {table.location}
                                    </Typography>
                                )}
                                {table.isVIP && (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'primary.main',
                                            fontWeight: 'bold',
                                            mt: 1
                                        }}
                                    >
                                        VIP Table
                                    </Typography>
                                )}
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'flex-end' }}>
                                <IconButton
                                    size="small"
                                    onClick={() => handleOpenAssignment(table)}
                                    title="Assign Guests"
                                >
                                    <GroupIcon />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={() => handleOpenForm(table)}
                                    title="Edit Table"
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={() => handleDelete(table.id)}
                                    title="Delete Table"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog
                open={openForm}
                onClose={handleCloseForm}
                maxWidth="sm"
                fullWidth
                fullScreen={isMobile}
            >
                <TableForm
                    weddingId={weddingId}
                    table={selectedTable}
                    onClose={handleCloseForm}
                />
            </Dialog>

            <Dialog
                open={openAssignment}
                onClose={handleCloseAssignment}
                maxWidth="md"
                fullWidth
                fullScreen={isMobile}
            >
                <TableAssignment
                    table={selectedTable}
                    onClose={handleCloseAssignment}
                />
            </Dialog>
        </Box>
    );
};

export default TableList; 