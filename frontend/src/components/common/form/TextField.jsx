import React, { forwardRef } from 'react';
import { Box, Typography, TextField as MuiTextField } from '@mui/material';

const TextField = forwardRef(({ label, value, onChange, required = false, type = 'text', error, helperText, InputProps, ...props }, ref) => {
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
                error={error}
                helperText={helperText}
                InputProps={InputProps}
                inputRef={ref}
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
});

TextField.displayName = 'TextField';

export default TextField; 