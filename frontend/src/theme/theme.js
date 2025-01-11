import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#687F6C',
      light: '#8A9E8E',
      dark: '#4E614F',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#D4B98C',
      light: '#E8D5B5',
      dark: '#B69B6B',
      contrastText: '#2C362C',
    },
    accent: {
      blush: '#E8C4C4',
      blushLight: '#F2D6D6',
      blushDark: '#D4A6A6',
      gold: '#D4AF37',
      goldLight: '#E8C76C',
      goldDark: '#B38F1D',
      ivory: '#FFFFF0',
      champagne: '#F7E7CE',
    },
    background: {
      default: '#F9F6F0',
      paper: '#FFFFFF',
      pattern: 'rgba(104, 127, 108, 0.03)',
      gradient: {
        primary: 'linear-gradient(135deg, #FFFFFF 0%, #F9F6F0 100%)',
        accent: 'linear-gradient(135deg, #F7E7CE 0%, #FFFFFF 100%)',
        blush: 'linear-gradient(135deg, #F2D6D6 0%, #FFFFFF 100%)',
      },
    },
    text: {
      primary: '#2C362C',
      secondary: '#767D76',
      accent: '#B69B6B',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: '2.75rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: '#2C362C',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: '2.25rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
      color: '#2C362C',
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h3: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.2,
      color: '#2C362C',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.01em',
      color: '#767D76',
      '@media (max-width:600px)': {
        fontSize: '0.9375rem',
      },
    },
  },
  shape: {
    borderRadius: {
      xs: 12,
      sm: 16,
      md: 20,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '28px',
          boxShadow: '0px 8px 24px rgba(104, 127, 108, 0.08)',
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: '0px 16px 40px rgba(104, 127, 108, 0.16)',
          },
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F7E7CE 8%, #FFFFFF 100%)',
          border: '1px solid rgba(212, 185, 140, 0.12)',
          position: 'relative',
          overflow: 'hidden',
          '@media (max-width:600px)': {
            borderRadius: '24px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          minHeight: '56px',
          padding: '12px 32px',
          fontSize: '1rem',
          fontWeight: 600,
          letterSpacing: '0.02em',
          textTransform: 'none',
          boxShadow: '0px 4px 16px rgba(104, 127, 108, 0.16)',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          '&:hover': {
            transform: 'translateY(-2px) scale(1.02)',
            boxShadow: '0px 8px 24px rgba(104, 127, 108, 0.24)',
          },
          '@media (max-width:600px)': {
            width: '100%',
            borderRadius: '14px',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #D4B98C 0%, #B69B6B 100%)',
          color: '#2C362C',
          '&:hover': {
            background: 'linear-gradient(135deg, #E8D5B5 0%, #D4B98C 100%)',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#D4B98C', 0.08),
          borderRadius: '32px',
          padding: '4px',
          minHeight: '56px',
          width: '100%',
          maxWidth: '320px',
          margin: '0 auto',
          position: 'relative',
          '@media (max-width:600px)': {
            maxWidth: '100%',
          },
          '& .MuiTabs-indicator': {
            display: 'none',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: '48px',
          padding: '12px 24px',
          borderRadius: '24px',
          color: '#767D76',
          fontWeight: 600,
          fontSize: '0.9375rem',
          letterSpacing: '0.02em',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: alpha('#D4B98C', 0.08),
            color: '#2C362C',
          },
          '&.Mui-selected': {
            color: '#2C362C',
            backgroundColor: '#FFFFFF',
            boxShadow: '0px 2px 8px rgba(212, 185, 140, 0.24)',
          },
          '& .MuiSvgIcon-root': {
            marginRight: '8px',
            fontSize: '1.25rem',
            color: '#B69B6B',
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          width: '56px',
          height: '56px',
          background: 'linear-gradient(135deg, #D4B98C 0%, #B69B6B 100%)',
          boxShadow: '0px 4px 16px rgba(212, 185, 140, 0.24)',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          '&:hover': {
            background: 'linear-gradient(135deg, #E8D5B5 0%, #D4B98C 100%)',
            boxShadow: '0px 8px 24px rgba(212, 185, 140, 0.32)',
            transform: 'scale(1.05)',
          },
          '@media (max-width:600px)': {
            width: '48px',
            height: '48px',
          },
          '@keyframes pulse': {
            '0%': {
              boxShadow: '0px 4px 16px rgba(212, 185, 140, 0.24)',
              transform: 'scale(1)',
            },
            '50%': {
              boxShadow: '0px 8px 24px rgba(212, 185, 140, 0.32)',
              transform: 'scale(1.05)',
            },
            '100%': {
              boxShadow: '0px 4px 16px rgba(212, 185, 140, 0.24)',
              transform: 'scale(1)',
            },
          },
          '&.pulse': {
            animation: 'pulse 2s infinite cubic-bezier(0.34, 1.56, 0.64, 1)',
          },
        },
        primary: {
          '& .MuiSvgIcon-root': {
            fontSize: '24px',
            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            color: '#2C362C',
          },
          '&:hover .MuiSvgIcon-root': {
            transform: 'rotate(90deg)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: '12px',
          '&:hover': {
            backgroundColor: 'rgba(104, 127, 108, 0.08)',
          },
        },
        sizeMedium: {
          width: '48px',
          height: '48px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(249, 246, 240, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(104, 127, 108, 0.08)',
          '& .MuiToolbar-root': {
            minHeight: { xs: 64, sm: 72 },
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0px 4px 20px rgba(104, 127, 108, 0.12)',
          '& .MuiMenuItem-root': {
            minHeight: 48,
            padding: '12px 16px',
            '&:hover': {
              backgroundColor: 'rgba(104, 127, 108, 0.04)',
            },
            '&.Mui-selected': {
              backgroundColor: 'rgba(104, 127, 108, 0.08)',
              '&:hover': {
                backgroundColor: 'rgba(104, 127, 108, 0.12)',
              },
            },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRadius: '0 20px 20px 0',
          boxShadow: '0px 4px 20px rgba(104, 127, 108, 0.12)',
          '& .MuiListItem-root': {
            borderRadius: '12px',
            marginBottom: '4px',
            '&:hover': {
              backgroundColor: 'rgba(104, 127, 108, 0.04)',
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 40,
          color: 'inherit',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          letterSpacing: '0.02em',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          height: '8px',
          backgroundColor: alpha('#FFFFFF', 0.24),
        },
        bar: {
          borderRadius: '8px',
          backgroundImage: 'linear-gradient(135deg, #E8D5B5 0%, #D4B98C 100%)',
        },
      },
    },
  },
});

export default theme;