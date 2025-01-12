import React from 'react';
import { Box, Typography, TextField, MenuItem } from '@mui/material';

const Select = ({ label, value, onChange, options, required = false, ...props }) => {
    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                {label}{required && ' *'}
            </Typography>
            <TextField
                select
                fullWidth
                value={value}
                onChange={onChange}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: '#FAFAFA',
                        '& fieldset': {
                            borderColor: '#E0E0E0',
                        },
                        '&:hover fieldset': {
                            borderColor: '#D0D0D0',
                        },
                    },
                    ...props.sx
                }}
                {...props}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
        </Box>
    );
};

export default Select; 