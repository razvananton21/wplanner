import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, useTheme, useMediaQuery } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ViewList as WeddingsIcon,
  CalendarMonth as CalendarIcon,
  People as GuestsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 280;

const navigationItems = [
  { path: '/weddings', label: 'Weddings', icon: WeddingsIcon },
  { path: '/calendar', label: 'Calendar', icon: CalendarIcon },
  { path: '/guests', label: 'Guests', icon: GuestsIcon },
  { path: '/settings', label: 'Settings', icon: SettingsIcon },
];

const ResponsiveLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const drawer = (
    <Box sx={{ mt: 2 }}>
      <List>
        {navigationItems.map(({ path, label, icon: Icon }) => (
          <ListItem
            button
            key={path}
            onClick={() => handleNavigation(path)}
            selected={location.pathname === path || (path === '/weddings' && location.pathname === '/')}
            sx={{
              borderRadius: '12px',
              mx: 1,
              mb: 1,
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.light',
                },
                '& .MuiListItemIcon-root': {
                  color: 'primary.main',
                },
              },
              '&:hover': {
                bgcolor: 'rgba(232, 196, 196, 0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <Icon />
            </ListItemIcon>
            <ListItemText
              primary={label}
              primaryTypographyProps={{
                fontSize: '0.9375rem',
                fontWeight: location.pathname === path ? 600 : 400,
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              border: 'none',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF9F7 100%)',
              boxShadow: '4px 0px 20px rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 0, sm: 3 },
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default ResponsiveLayout;
