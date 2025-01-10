import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ViewList as WeddingsIcon,
  CalendarMonth as CalendarIcon,
  People as GuestsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const BottomNav = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState('weddings');

  useEffect(() => {
    // Update the selected value based on the current path
    const path = location.pathname.split('/')[1] || 'weddings';
    setValue(path);
  }, [location]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(`/${newValue}`);
  };

  // Hide bottom navigation on main weddings page and when not mobile
  if (!isMobile || location.pathname === '/' || location.pathname === '/weddings') return null;

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderRadius: '20px 20px 0 0',
        overflow: 'hidden',
        boxShadow: '0px -4px 20px rgba(0, 0, 0, 0.05)',
      }}
      elevation={0}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        sx={{
          height: 72,
          backgroundColor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          '& .MuiBottomNavigationAction-root': {
            maxWidth: 'none',
            padding: '8px 0',
          },
        }}
      >
        <BottomNavigationAction
          label="Weddings"
          value="weddings"
          icon={<WeddingsIcon />}
          sx={{
            '&.Mui-selected': {
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.75rem',
                transition: 'font-size 0.2s',
              },
            },
          }}
        />
        <BottomNavigationAction
          label="Calendar"
          value="calendar"
          icon={<CalendarIcon />}
          sx={{
            '&.Mui-selected': {
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.75rem',
                transition: 'font-size 0.2s',
              },
            },
          }}
        />
        <BottomNavigationAction
          label="Guests"
          value="guests"
          icon={<GuestsIcon />}
          sx={{
            '&.Mui-selected': {
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.75rem',
                transition: 'font-size 0.2s',
              },
            },
          }}
        />
        <BottomNavigationAction
          label="Settings"
          value="settings"
          icon={<SettingsIcon />}
          sx={{
            '&.Mui-selected': {
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.75rem',
                transition: 'font-size 0.2s',
              },
            },
          }}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;
