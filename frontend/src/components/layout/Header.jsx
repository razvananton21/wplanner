import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Tooltip,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  Favorite as FavoriteIcon,
  Mail as MailIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Add logout logic here
    handleMenuClose();
  };

  const menuItems = [
    { text: 'My Weddings', icon: <FavoriteIcon />, path: '/weddings' },
    { text: 'Invitations', icon: <MailIcon />, path: '/invitations' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'Help Center', icon: <HelpIcon />, path: '/help' },
    { text: 'About', icon: <InfoIcon />, path: '/about' },
  ];

  const drawer = (
    <Box sx={{ width: 280, pt: 2 }}>
      <Stack spacing={2} sx={{ px: 2, mb: 3 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontFamily: theme.typography.h1.fontFamily,
              fontSize: '1.5rem',
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 0.5,
            }}
          >
            WPlanner
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontStyle: 'italic',
            }}
          >
            Your Wedding Journey Starts Here
          </Typography>
        </Box>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              handleDrawerToggle();
            }}
            sx={{
              mx: 1,
              borderRadius: '12px',
              mb: 0.5,
              '&:hover': {
                backgroundColor: theme.palette.background.gradient.accent,
              },
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.secondary.main }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: 500,
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{
        backgroundColor: 'rgba(249, 246, 240, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(104, 127, 108, 0.08)',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.04)',
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          px: { xs: 2, sm: 4 },
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              color: theme.palette.text.primary,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: alpha(theme.palette.secondary.main, 0.08),
                transform: 'scale(1.05)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            component="a"
            href="/"
            sx={{
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'flex-start', sm: 'center' },
              transition: 'opacity 0.2s ease-in-out',
              '&:hover': {
                opacity: 0.85,
              },
            }}
          >
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontFamily: theme.typography.h1.fontFamily,
                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                fontWeight: 600,
                background: 'linear-gradient(135deg, #2C362C 0%, #4E614F 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
              }}
            >
              WPlanner
            </Typography>
            {!isMobile && (
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontStyle: 'italic',
                  mt: -0.5,
                }}
              >
                Your Wedding Journey Starts Here
              </Typography>
            )}
          </Box>
        </Stack>

        <Box>
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                p: 0,
                border: `2px solid ${theme.palette.secondary.main}`,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.secondary.main, 0.08),
                  transform: 'scale(1.05)',
                  borderColor: theme.palette.secondary.dark,
                },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: theme.palette.secondary.main,
                  color: theme.palette.secondary.contrastText,
                  transition: 'background-color 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: theme.palette.secondary.dark,
                  },
                }}
              >
                U
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: '16px',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <MenuItem onClick={() => navigate('/profile')}>
              <ListItemIcon>
                <AccountIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </MenuItem>
            <MenuItem onClick={() => navigate('/settings')}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </Box>

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          PaperProps={{
            sx: {
              backgroundColor: theme.palette.background.default,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Header;