import React from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
    Box,
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    FormControlLabel,
    Switch,
    Alert
} from '@mui/material';
import { createGuest } from '../../features/guests/guestSlice';

const schema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    category: yup.string().required('Category is required'),
    plusOne: yup.boolean(),
    dietaryRestrictions: yup.string()
});

const AddGuestForm = ({ weddingId, onClose }) => {
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            category: 'guest',
            plusOne: false
        }
    });

    const onSubmit = async (data) => {
        try {
            await dispatch(createGuest({ weddingId, guestData: data })).unwrap();
            onClose();
        } catch (error) {
            setError('root', {
                type: 'manual',
                message: error.message || 'Failed to add guest'
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle>Add New Guest</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    {errors.root && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {errors.root.message}
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        label="First Name"
                        {...register('firstName')}
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="Last Name"
                        {...register('lastName')}
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        {...register('email')}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        select
                        fullWidth
                        label="Category"
                        {...register('category')}
                        error={!!errors.category}
                        helperText={errors.category?.message}
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="family">Family</MenuItem>
                        <MenuItem value="friend">Friend</MenuItem>
                        <MenuItem value="colleague">Colleague</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                    </TextField>

                    <TextField
                        fullWidth
                        label="Dietary Restrictions"
                        multiline
                        rows={2}
                        {...register('dietaryRestrictions')}
                        error={!!errors.dietaryRestrictions}
                        helperText={errors.dietaryRestrictions?.message}
                        sx={{ mb: 2 }}
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                {...register('plusOne')}
                            />
                        }
                        label="Allow Plus One"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                >
                    Add Guest
                </Button>
            </DialogActions>
        </form>
    );
};

export default AddGuestForm; 