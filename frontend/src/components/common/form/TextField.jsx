import React from 'react';
import { Box, Typography, TextField as MuiTextField } from '@mui/material';

const TextField = ({ label, value, onChange, required = false, type = 'text', ...props }) => {
    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                {label}{required && ' *'}
            </Typography>
            <MuiTextField
                fullWidth
                value={value}
                onChange={onChange}
                type={type}
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
            />
        </Box>
    );
};

export default TextField; 