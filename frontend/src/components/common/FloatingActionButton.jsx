import React from 'react';
import { Fab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

const FloatingActionButton = ({ onClick }) => {
    return (
        <Fab
            onClick={onClick}
            sx={{
                position: 'fixed',
                bottom: 32,
                right: 32,
                width: 56,
                height: 56,
                bgcolor: '#D1BFA5',
                boxShadow: `0px 3px 12px ${alpha('#D1BFA5', 0.35)}`,
                '&:hover': {
                    bgcolor: '#B0A089',
                    transform: 'translateY(-2px)',
                    boxShadow: `0px 4px 16px ${alpha('#D1BFA5', 0.45)}`,
                },
                '&:active': {
                    transform: 'translateY(0)',
                    boxShadow: `0px 3px 12px ${alpha('#D1BFA5', 0.35)}`,
                },
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
        >
            <AddIcon 
                sx={{ 
                    fontSize: 24,
                    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    color: '#2C362C',
                    '&:hover': {
                        transform: 'rotate(90deg)'
                    }
                }} 
            />
        </Fab>
    );
};

export default FloatingActionButton; 