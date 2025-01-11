import { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Avatar,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const menuItems = [
    { icon: <PersonIcon />, text: 'Profile', action: () => navigate('/profile') },
    { icon: <SettingsIcon />, text: 'Settings', action: () => navigate('/settings') },
    { icon: <HelpIcon />, text: 'Help', action: () => navigate('/help') },
    { icon: <LogoutIcon />, text: 'Logout', action: () => {/* Handle logout */} },
  ];

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          height: { xs: 64, sm: 72 },
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMobileMenuToggle}
            sx={{
              mr: 2,
              color: 'text.primary',
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <FavoriteIcon
            sx={{
              color: theme.palette.primary.main,
              fontSize: { xs: 24, sm: 28 },
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 600,
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              color: 'text.primary',
              letterSpacing: '-0.01em',
            }}
          >
            WPlanner
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!isMobile && (
            <>
              <Tooltip title="Help">
                <IconButton
                  color="inherit"
                  sx={{ color: 'text.primary' }}
                  onClick={() => navigate('/help')}
                >
                  <HelpIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Settings">
                <IconButton
                  color="inherit"
                  sx={{ color: 'text.primary' }}
                  onClick={() => navigate('/settings')}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
          
          <Tooltip title="Account">
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                p: 0.5,
                border: '2px solid',
                borderColor: 'primary.main',
                borderRadius: '50%',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: 'primary.dark',
                },
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 32, sm: 36 },
                  height: { xs: 32, sm: 36 },
                  bgcolor: 'primary.main',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                }}
              >
                U
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 2,
            sx: {
              mt: 1.5,
              borderRadius: '12px',
              minWidth: 200,
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
              '& .MuiMenuItem-root': {
                py: 1.5,
                px: 2,
              },
            },
          }}
        >
          {menuItems.map((item, index) => (
            <MenuItem
              key={item.text}
              onClick={item.action}
              sx={{
                borderRadius: '8px',
                mx: 1,
                mb: index === menuItems.length - 1 ? 0 : 0.5,
                '&:last-child': {
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 0,
                  mt: 1,
                  mx: 0,
                },
              }}
            >
              <ListItemIcon sx={{ color: 'text.primary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                }}
              />
            </MenuItem>
          ))}
        </Menu>

        <Drawer
          anchor="left"
          open={mobileMenuOpen}
          onClose={handleMobileMenuToggle}
          PaperProps={{
            sx: {
              width: '80%',
              maxWidth: 300,
              borderRadius: '0 20px 20px 0',
              px: 2,
            },
          }}
        >
          <Box sx={{ pt: 2, pb: 1.5 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontWeight: 600,
                color: 'text.primary',
                px: 2,
              }}
            >
              Menu
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List>
            {menuItems.map((item, index) => (
              <ListItem
                key={item.text}
                onClick={() => {
                  item.action();
                  handleMobileMenuToggle();
                }}
                sx={{
                  borderRadius: '12px',
                  mb: 1,
                  '&:hover': {
                    bgcolor: 'rgba(104, 127, 108, 0.08)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'text.primary', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Header;