import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

const TextArea = ({ label, value, onChange, rows = 3, required = false, ...props }) => {
    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                {label}{required && ' *'}
            </Typography>
            <TextField
                fullWidth
                value={value}
                onChange={onChange}
                multiline
                rows={rows}
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

export default TextArea; 