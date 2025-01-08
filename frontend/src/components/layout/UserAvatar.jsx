import React from 'react';
import { Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UserAvatar = () => {
    const { logout } = useAuth();
    const user = useSelector(state => state.auth.user);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleClose();
        navigate('/');
    };

    if (!user) return null;

    const getInitials = () => {
        if (user.firstName && user.lastName) {
            return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
        }
        return user.email?.charAt(0).toUpperCase() || 'U';
    };

    console.log('UserAvatar - User data:', user); // Debug log

    return (
        <>
            <IconButton 
                onClick={handleClick}
                sx={{
                    padding: 0.5,
                    border: '2px solid',
                    borderColor: 'primary.main',
                }}
            >
                <Avatar 
                    src={user.avatar} 
                    alt={getInitials()}
                    sx={{ 
                        width: 40, 
                        height: 40,
                        bgcolor: !user.avatar ? 'primary.main' : undefined,
                        color: !user.avatar ? 'primary.contrastText' : undefined,
                    }}
                >
                    {!user.avatar && getInitials()}
                </Avatar>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </>
    );
};

export default UserAvatar; 