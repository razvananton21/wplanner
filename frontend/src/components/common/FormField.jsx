import React from 'react';
import { TextField, Typography, Box } from '@mui/material';

const FormField = ({ 
    label, 
    value, 
    onChange, 
    select = false, 
    children,
    placeholder,
    multiline = false,
    rows = 4,
    ...props 
}) => {
    return (
        <Box sx={{ mb: 3 }}>
            {label && (
                <Typography
                    sx={{
                        color: '#5C5C5C',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        mb: 1,
                        fontFamily: 'Inter, sans-serif',
                    }}
                >
                    {label}
                </Typography>
            )}
            <TextField
                fullWidth
                select={select}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                multiline={multiline}
                rows={rows}
                variant="outlined"
                sx={{
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                        '& fieldset': {
                            borderColor: '#E8E3DD',
                        },
                        '&:hover fieldset': {
                            borderColor: '#D1BFA5',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#D1BFA5',
                            borderWidth: '1px',
                        },
                    },
                    '& .MuiOutlinedInput-input': {
                        color: '#4A413C',
                        fontSize: '0.9375rem',
                        padding: '12px 16px',
                        '&::placeholder': {
                            color: '#A69374',
                            opacity: 0.8,
                        },
                    },
                    '& .MuiSelect-select': {
                        padding: '12px 16px',
                    },
                }}
                {...props}
            >
                {children}
            </TextField>
        </Box>
    );
};

export default FormField; 