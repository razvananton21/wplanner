import { useState } from 'react';
import { useNavigate, useLocation, Outlet, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Event as EventIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';
import UserAvatar from './UserAvatar';

const drawerWidth = 240;

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { id: weddingId } = useParams();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getMenuItems = () => {
    const items = [
      { text: 'Weddings', icon: <EventIcon />, path: '/weddings' },
      { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    ];

    return items;
  };

  const menuItems = getMenuItems();

  const drawer = (
    <Box sx={{ mt: 2 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setMobileOpen(false);
            }}
            selected={location.pathname.startsWith(item.path)}
            sx={{
              borderRadius: '0 24px 24px 0',
              mr: 2,
              mb: 1,
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                '& .MuiListItemIcon-root': {
                  color: 'primary.contrastText',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: location.pathname.startsWith(item.path) ? 'inherit' : 'text.secondary' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const bottomNav = (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar,
      }}
      elevation={3}
    >
      <BottomNavigation
        value={menuItems.findIndex(item => location.pathname.startsWith(item.path))}
        showLabels
      >
        {menuItems.map((item) => (
          <BottomNavigationAction
            key={item.text}
            label={item.text}
            icon={item.icon}
            onClick={() => navigate(item.path)}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Wedding Planner
          </Typography>
          <UserAvatar />
        </Toolbar>
      </AppBar>

      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <Toolbar />
          {drawer}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mb: isMobile ? 8 : 0,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>

      {isMobile && bottomNav}
    </Box>
  );
};

export default Layout; 