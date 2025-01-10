import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  IconButton,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
  Fade,
  CircularProgress,
  Alert,
  Fab,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import weddingService from '../../services/weddingService';

const WeddingList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [weddings, setWeddings] = useState({ owned: [], invited: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchWeddings = async () => {
      try {
        setLoading(true);
        const data = await weddingService.getWeddings();
        
        // Ensure we have both arrays, even if empty
        const activeWeddings = {
          owned: Array.isArray(data.managed) 
            ? data.managed
                .filter(wedding => !wedding.deletedAt)
                .sort((a, b) => new Date(a.date) - new Date(b.date))
            : [],
          invited: Array.isArray(data.invited)
            ? data.invited
                .filter(wedding => !wedding.deletedAt)
                .sort((a, b) => new Date(a.date) - new Date(b.date))
            : [],
        };
        setWeddings(activeWeddings);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch weddings:', err);
        setError(err.message || 'Failed to load weddings');
      } finally {
        setLoading(false);
      }
    };

    fetchWeddings();
  }, []);

  const handleCreateWedding = () => {
    navigate('/weddings/new');
  };

  const handleViewDetails = (wedding) => {
    navigate(`/weddings/${wedding.id}`);
  };

  const handleEditWedding = (id) => {
    navigate(`/weddings/${id}`, { state: { startEditing: true } });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const WeddingCard = ({ wedding, isOwned }) => (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        borderRadius: '20px',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.08)',
          '& .MuiCardMedia-root': {
            transform: 'scale(1.05)',
          },
        },
      }}
      onClick={() => handleViewDetails(wedding)}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        {wedding.coverImage ? (
          <CardMedia
            component="img"
            height="200"
            image={wedding.coverImage}
            alt={wedding.title}
            sx={{
              transition: 'transform 0.3s ease-in-out',
            }}
          />
        ) : (
          <Box
            sx={{
              height: 200,
              background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
            }}
          />
        )}
      </Box>
      <CardContent 
        sx={{ 
          p: 2.5,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: '1.1rem',
            color: 'text.primary',
          }}
        >
          {wedding.title}
        </Typography>
        
        <Stack spacing={1.5}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CalendarIcon sx={{ fontSize: '1.1rem', color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {format(new Date(wedding.date), 'MMM d, yyyy')}
            </Typography>
          </Stack>
          
          {wedding.guestCount && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <PeopleIcon sx={{ fontSize: '1.1rem', color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {wedding.guestCount} Guests
              </Typography>
            </Stack>
          )}
          
          {wedding.venue && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <LocationIcon sx={{ fontSize: '1.1rem', color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" noWrap>
                {wedding.venue}
              </Typography>
            </Stack>
          )}
        </Stack>

        <Button
          variant="outlined"
          size="small"
          sx={{
            mt: 'auto',
            borderRadius: '10px',
            textTransform: 'none',
            borderWidth: '1.5px',
            '&:hover': {
              borderWidth: '1.5px',
            },
          }}
        >
          View Details
        </Button>
        
        {isOwned && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleEditWedding(wedding.id);
            }}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: 'background.paper',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
              width: 32,
              height: 32,
              '&:hover': {
                bgcolor: 'background.paper',
              },
            }}
          >
            <EditIcon sx={{ fontSize: '1.1rem' }} />
          </IconButton>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  const hasAnyWeddings = weddings.owned.length > 0 || weddings.invited.length > 0;

  return (
    <Fade in timeout={800}>
      <Box sx={{ pb: 3 }}>
        <Box
          sx={{
            mb: 4,
            px: isMobile ? 2 : 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
              pt: 2,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontWeight: 500,
                fontSize: isMobile ? '1.75rem' : '2.25rem',
                color: 'primary.main',
                textAlign: 'center',
                letterSpacing: '0.02em',
                mb: 0.5,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '40px',
                  height: '2px',
                  background: `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                  borderRadius: '2px',
                },
              }}
            >
              Upcoming Weddings
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: 'text.secondary',
                fontWeight: 400,
                fontSize: '0.95rem',
                mt: 2,
                opacity: 0.9,
                maxWidth: '600px',
                textAlign: 'center',
                px: 2,
              }}
            >
              Plan and manage your special day with ease
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 4,
            }}
          >
            <Box
              sx={{
                bgcolor: 'background.paper',
                borderRadius: '16px',
                p: 0.5,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  minHeight: 44,
                  '& .MuiTab-root': {
                    fontSize: '0.9rem',
                    textTransform: 'none',
                    fontWeight: 500,
                    minWidth: 120,
                    minHeight: 44,
                    borderRadius: '12px',
                    color: 'text.secondary',
                    '&.Mui-selected': {
                      color: 'text.primary',
                      fontWeight: 600,
                      backgroundColor: 'primary.light',
                    },
                  },
                  '& .MuiTabs-indicator': {
                    display: 'none',
                  },
                }}
              >
                <Tab label="My Wedding" />
                <Tab label="Invited" />
              </Tabs>
            </Box>
          </Box>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, mx: isMobile ? 2 : 0 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {!hasAnyWeddings && tabValue === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              px: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No weddings yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Start by creating your first wedding
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateWedding}
              sx={{
                height: 48,
                borderRadius: '12px',
                px: 4,
              }}
            >
              Create Wedding
            </Button>
          </Box>
        ) : (
          <Box sx={{ px: isMobile ? 2 : 0 }}>
            <Grid container spacing={3}>
              {(tabValue === 0 ? weddings.owned : weddings.invited).map((wedding) => (
                <Grid item xs={12} sm={6} md={4} key={wedding.id}>
                  <WeddingCard wedding={wedding} isOwned={tabValue === 0} />
                </Grid>
              ))}
              {tabValue === 1 && weddings.invited.length === 0 && (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                      No invitations yet
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {tabValue === 0 && (
          isMobile ? (
            <Fab
              color="primary"
              aria-label="add wedding"
              onClick={handleCreateWedding}
              sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                zIndex: 1000,
                bgcolor: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                },
              }}
            >
              <AddIcon />
            </Fab>
          ) : (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateWedding}
              sx={{
                position: 'fixed',
                bottom: 32,
                right: 32,
                zIndex: 1000,
                height: 48,
                borderRadius: '12px',
                px: 4,
              }}
            >
              Create Wedding
            </Button>
          )
        )}
      </Box>
    </Fade>
  );
};

export default WeddingList; 