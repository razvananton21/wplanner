import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  IconButton,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Fade,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  People as PeopleIcon,
  TableChart as TableIcon,
  Email as EmailIcon,
  AccountBalanceWallet as WalletIcon,
  Edit as EditIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import weddingService from '../../services/weddingService';

const WeddingDetails = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { id } = useParams();
  const [wedding, setWedding] = useState(null);

  useEffect(() => {
    const fetchWedding = async () => {
      try {
        const response = await weddingService.getWedding(id);
        setWedding(response.wedding);
      } catch (err) {
        console.error('Failed to fetch wedding:', err);
      }
    };
    fetchWedding();
  }, [id]);

  const menuItems = [
    { icon: EditIcon, label: 'Details', path: 'details' },
    { icon: EventIcon, label: 'Timeline', path: 'timeline' },
    { icon: CheckCircleIcon, label: 'Tasks', path: 'tasks' },
    { icon: PeopleIcon, label: 'Vendors', path: 'vendors' },
    { icon: PeopleIcon, label: 'Guests', path: 'guests' },
    { icon: TableIcon, label: 'Tables', path: 'tables' },
    { icon: EmailIcon, label: 'RSVP Form', path: 'rsvp-form' },
    { icon: FileIcon, label: 'Invitation', path: 'invitation' },
    { icon: WalletIcon, label: 'Budget', path: 'budget' },
  ];

  const handleNavigate = (path) => {
    setActiveTab(path);
  };

  const [activeTab, setActiveTab] = useState('details');

  return (
    <Fade in timeout={800}>
      <Box sx={{ pb: 4 }}>
        {/* Header Section */}
        <Box
          sx={{
            position: 'relative',
            height: isMobile ? '30vh' : '40vh',
            bgcolor: 'primary.light',
            mb: 3,
            borderRadius: '0 0 24px 24px',
            overflow: 'hidden',
            background: `linear-gradient(to bottom, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          }}
        >
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              bgcolor: 'background.paper',
              boxShadow: '0px 2px 8px rgba(104, 127, 108, 0.12)',
              '&:hover': { 
                bgcolor: 'background.paper',
                transform: 'translateY(-2px)',
                boxShadow: '0px 4px 12px rgba(104, 127, 108, 0.2)',
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 3,
              background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontFamily: '"Cormorant Garamond", serif',
                textAlign: 'center',
                mb: 1,
                fontWeight: 500,
              }}
            >
              {wedding?.title || 'Loading...'}
            </Typography>
          </Box>
        </Box>

        {/* Menu Grid */}
        <Box sx={{ px: isMobile ? 2 : 4 }}>
          <Grid container spacing={2}>
            {menuItems.map((item) => (
              <Grid item xs={4} sm={4} md={4} key={item.path}>
                <Card
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    bgcolor: 'background.paper',
                    transition: 'all 0.2s ease-in-out',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: 'none',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0px 4px 20px rgba(104, 127, 108, 0.12)',
                      borderColor: 'primary.main',
                    },
                    ...(activeTab === item.path && {
                      borderColor: 'primary.main',
                      bgcolor: 'rgba(104, 127, 108, 0.04)',
                    }),
                  }}
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      p: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1,
                        position: 'relative',
                        color: activeTab === item.path ? 'primary.main' : 'text.secondary',
                        bgcolor: activeTab === item.path ? 'rgba(104, 127, 108, 0.08)' : 'transparent',
                      }}
                    >
                      <item.icon sx={{ fontSize: 24 }} />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: activeTab === item.path ? 'primary.main' : 'text.secondary',
                        fontSize: '0.875rem',
                        fontWeight: activeTab === item.path ? 600 : 500,
                      }}
                    >
                      {item.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Content Section */}
        <Box sx={{ mt: 4, px: isMobile ? 2 : 4 }}>
          {/* The content for each tab will be rendered here */}
        </Box>
      </Box>
    </Fade>
  );
};

export default WeddingDetails;