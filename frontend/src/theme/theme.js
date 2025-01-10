import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#687F6C', // Softer sage green
      light: '#8A9E8E', // Lighter muted sage
      dark: '#4E614F', // Deeper muted green
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#8E8B82', // Warm gray
      light: '#A6A39B',
      dark: '#76736B',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F0E6', // Warm beige
      paper: '#FFFFFF',
    },
    text: {
      primary: '#3F483F', // Softer dark green
      secondary: '#767D76', // Muted gray-green
    },
    success: {
      main: '#7B9A6D', // Softer natural green
      light: '#96B189',
      dark: '#5F7854',
    },
    error: {
      main: '#B45B5B', // Keeping the muted red
      light: '#C67D7D',
      dark: '#8F4848',
    },
    divider: 'rgba(104, 127, 108, 0.08)', // Softer green with lower opacity
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: '3rem',
      fontWeight: 500,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: '#3F483F',
      '@media (max-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h2: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: '2.5rem',
      fontWeight: 500,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      color: '#3F483F',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h3: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: '2rem',
      fontWeight: 500,
      lineHeight: 1.3,
      color: '#3F483F',
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h4: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.4,
      color: '#3F483F',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.01em',
      '@media (max-width:600px)': {
        fontSize: '1.1rem',
      },
    },
    h6: {
      fontSize: '1.1rem',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.01em',
      '@media (max-width:600px)': {
        fontSize: '1rem',
      },
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '10px 24px',
          fontSize: '0.9375rem',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 4px 12px rgba(104, 127, 108, 0.12)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #687F6C 0%, #4E614F 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #7A907E 0%, #5C705D 100%)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          borderColor: '#687F6C',
          color: '#687F6C',
          '&:hover': {
            borderWidth: '1.5px',
            borderColor: '#4E614F',
            backgroundColor: 'rgba(104, 127, 108, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          boxShadow: '0px 4px 20px rgba(104, 127, 108, 0.06)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 8px 25px rgba(104, 127, 108, 0.1)',
          },
          background: '#FFFFFF',
          border: '1px solid rgba(104, 127, 108, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          boxShadow: '0px 4px 20px rgba(104, 127, 108, 0.06)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: 'rgba(104, 127, 108, 0.04)',
            },
            '&.Mui-focused': {
              boxShadow: '0px 0px 0px 4px rgba(104, 127, 108, 0.12)',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(245, 240, 230, 0.95)',
          backdropFilter: 'blur(10px)',
          color: '#3F483F',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(104, 127, 108, 0.08)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: '4px 0px 20px rgba(104, 127, 108, 0.06)',
          background: '#FFFFFF',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(245, 240, 230, 0.6)',
          borderRadius: '16px',
          padding: '4px',
          '& .MuiTab-root.Mui-selected': {
            backgroundColor: '#FFFFFF',
            color: '#687F6C',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          minHeight: '44px',
          color: '#767D76',
          '&.Mui-selected': {
            color: '#687F6C',
            fontWeight: 600,
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(104, 127, 108, 0.15)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 8px 25px rgba(104, 127, 108, 0.2)',
          },
          background: 'linear-gradient(135deg, #687F6C 0%, #4E614F 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #7A907E 0%, #5C705D 100%)',
          },
        },
      },
    },
  },
});

export default theme;