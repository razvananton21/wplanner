import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    TextField,
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
    Alert,
    CircularProgress
} from '@mui/material';
import { createTable, updateTable } from '../../store/slices/tableSlice';

const TableForm = ({ weddingId, table, onClose }) => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.tables);

    const [formData, setFormData] = useState({
        name: '',
        capacity: 8,
        minCapacity: 1,
        shape: 'round',
        dimensions: {},
        location: '',
        isVIP: false,
        metadata: {}
    });

    useEffect(() => {
        if (table) {
            setFormData({
                name: table.name,
                capacity: table.capacity,
                minCapacity: table.minCapacity,
                shape: table.shape,
                dimensions: table.dimensions,
                location: table.location || '',
                isVIP: table.isVIP,
                metadata: table.metadata
            });
        }
    }, [table]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSwitchChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const action = table
            ? updateTable({ tableId: table.id, tableData: formData })
            : createTable({ weddingId, tableData: formData });

        const result = await dispatch(action);
        
        if (!result.error) {
            onClose();
        }
    };

    return (
        <>
            <DialogTitle>
                {table ? 'Edit Table' : 'Add New Table'}
            </DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        '& .MuiTextField-root': { my: 1 },
                        pt: 2
                    }}
                >
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        required
                        name="name"
                        label="Table Name"
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        required
                        type="number"
                        name="capacity"
                        label="Capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        inputProps={{ min: 1 }}
                    />

                    <TextField
                        fullWidth
                        required
                        type="number"
                        name="minCapacity"
                        label="Minimum Capacity"
                        value={formData.minCapacity}
                        onChange={handleChange}
                        inputProps={{ min: 1 }}
                    />

                    <FormControl fullWidth sx={{ my: 1 }}>
                        <InputLabel>Shape</InputLabel>
                        <Select
                            name="shape"
                            value={formData.shape}
                            onChange={handleChange}
                            label="Shape"
                        >
                            <MenuItem value="round">Round</MenuItem>
                            <MenuItem value="rectangular">Rectangular</MenuItem>
                            <MenuItem value="square">Square</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        name="location"
                        label="Location (Optional)"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g., Near dance floor, By the window"
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                name="isVIP"
                                checked={formData.isVIP}
                                onChange={handleSwitchChange}
                            />
                        }
                        label="VIP Table"
                        sx={{ mt: 1 }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                    {table ? 'Save Changes' : 'Add Table'}
                </Button>
            </DialogActions>
        </>
    );
};

export default TableForm; 