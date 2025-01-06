import React, { useEffect } from 'react';
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
import { updateGuest } from '../../features/guests/guestSlice';

const schema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    category: yup.string().required('Category is required'),
    status: yup.string().required('Status is required'),
    plusOne: yup.boolean(),
    dietaryRestrictions: yup.string()
});

const EditGuestForm = ({ weddingId, guest, onClose }) => {
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        reset
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: guest.firstName,
            lastName: guest.lastName,
            email: guest.email,
            category: guest.category,
            status: guest.status,
            plusOne: guest.plusOne,
            dietaryRestrictions: guest.dietaryRestrictions
        }
    });

    useEffect(() => {
        reset({
            firstName: guest.firstName,
            lastName: guest.lastName,
            email: guest.email,
            category: guest.category,
            status: guest.status,
            plusOne: guest.plusOne,
            dietaryRestrictions: guest.dietaryRestrictions
        });
    }, [guest, reset]);

    const onSubmit = async (data) => {
        try {
            await dispatch(updateGuest({
                weddingId,
                guestId: guest.id,
                guestData: data
            })).unwrap();
            onClose();
        } catch (error) {
            setError('root', {
                type: 'manual',
                message: error.message || 'Failed to update guest'
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle>Edit Guest</DialogTitle>
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
                        select
                        fullWidth
                        label="Status"
                        {...register('status')}
                        error={!!errors.status}
                        helperText={errors.status?.message}
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="confirmed">Confirmed</MenuItem>
                        <MenuItem value="declined">Declined</MenuItem>
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
                    Save Changes
                </Button>
            </DialogActions>
        </form>
    );
};

export default EditGuestForm; 