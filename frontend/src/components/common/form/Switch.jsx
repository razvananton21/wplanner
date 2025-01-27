import React from 'react';
import { Box, FormControlLabel, Switch as MuiSwitch } from '@mui/material';

const Switch = ({ label, checked, onChange, ...props }) => {
    return (
        <Box sx={{ mb: 2 }}>
            <FormControlLabel
                control={
                    <MuiSwitch
                        checked={checked}
                        onChange={onChange}
                        sx={{
                            '& .MuiSwitch-track': {
                                backgroundColor: '#E0E0E0',
                            },
                            '& .MuiSwitch-thumb': {
                                backgroundColor: checked ? '#C8A97E' : '#999',
                            },
                            '& .Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#E5D5BC !important',
                            }
                        }}
                        {...props}
                    />
                }
                label={label}
                sx={{
                    '& .MuiFormControlLabel-label': {
                        color: '#666',
                    }
                }}
            />
        </Box>
    );
};

export default Switch; 