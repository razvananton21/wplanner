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
  Stack,
  useTheme,
  useMediaQuery,
  Fade,
  CircularProgress,
  Alert,
  Fab,
  Tabs,
  Tab,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Edit as EditIcon,
  Favorite as FavoriteIcon,
  Mail as MailIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { format, differenceInDays } from 'date-fns';
import weddingService from '../../services/weddingService';

const WeddingCard = ({ wedding, isOwned }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const daysUntil = differenceInDays(new Date(wedding.date), new Date());
  const progress = Math.max(0, Math.min(100, (daysUntil / 365) * 100));

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      onClick={() => handleViewDetails(wedding)}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        {wedding.coverImage ? (
          <CardMedia
            component="img"
            height={isMobile ? "240" : "280"}
            image={wedding.coverImage}
            alt={wedding.title}
            sx={{
              transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          />
        ) : (
          <Box
            sx={{
              height: isMobile ? 240 : 280,
              background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0c16.569 0 30 13.431 30 30 0 16.569-13.431 30-30 30C13.431 60 0 46.569 0 30 0 13.431 13.431 0 30 0zm0 8c-12.15 0-22 9.85-22 22s9.85 22 22 22 22-9.85 22-22-9.85-22-22-22zm0 4c9.941 0 18 8.059 18 18s-8.059 18-18 18-18-8.059-18-18 8.059-18 18-18z' fill='%23FFFFFF' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                backgroundSize: '30px 30px',
                opacity: 0.2,
                animation: 'patternMove 20s linear infinite',
              },
            }}
          >
            <ImageIcon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.5)' }} />
          </Box>
        )}
        {isOwned && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleEditWedding(wedding.id);
            }}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.98)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <EditIcon />
          </IconButton>
        )}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            px: 4,
            py: 3,
            background: 'linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0))',
          }}
        >
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              width: '100%',
              mb: 1.5,
              height: 8,
              borderRadius: 4,
            }}
          />
          <Typography
            variant="subtitle1"
            sx={{
              color: '#FFFFFF',
              fontWeight: 600,
              textShadow: '0px 2px 4px rgba(0,0,0,0.2)',
              fontSize: '1.125rem',
            }}
          >
            {daysUntil} days until the big day
          </Typography>
        </Box>
      </Box>
      <CardContent 
        sx={{ 
          p: { xs: 3, sm: 4 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 3, sm: 4 },
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: '1.5rem', sm: '1.75rem' },
            fontWeight: 600,
            color: 'text.primary',
            fontFamily: theme.typography.h1.fontFamily,
            letterSpacing: '-0.01em',
          }}
        >
          {wedding.title}
        </Typography>
        
        <Stack spacing={{ xs: 2, sm: 2.5 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <CalendarIcon sx={{ fontSize: '1.5rem', color: theme.palette.primary.main }} />
            <Typography
              variant="subtitle1"
              sx={{
                color: 'text.primary',
                fontWeight: 500,
                fontSize: '1.125rem',
              }}
            >
              {format(new Date(wedding.date), 'MMMM d, yyyy')}
            </Typography>
          </Stack>
          
          {wedding.venue && (
            <Stack direction="row" alignItems="center" spacing={2}>
              <LocationIcon sx={{ fontSize: '1.5rem', color: theme.palette.primary.main }} />
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'text.primary',
                  fontWeight: 500,
                  fontSize: '1.125rem',
                }}
                noWrap
              >
                {wedding.venue}
              </Typography>
            </Stack>
          )}
          
          {wedding.guestCount && (
            <Stack direction="row" alignItems="center" spacing={2}>
              <PeopleIcon sx={{ fontSize: '1.5rem', color: theme.palette.primary.main }} />
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'text.primary',
                  fontWeight: 500,
                  fontSize: '1.125rem',
                }}
              >
                {wedding.guestCount} Guests
              </Typography>
            </Stack>
          )}
        </Stack>

        <Button
          variant="contained"
          size="large"
          sx={{
            mt: 'auto',
            fontWeight: 600,
            fontSize: '1.125rem',
          }}
        >
          {isOwned ? "Plan Your Wedding" : "View Timeline"}
        </Button>
      </CardContent>
    </Card>
  );
};

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress size={40} thickness={4} />
      </Box>
    );
  }

  return (
    <Fade in timeout={800}>
      <Box sx={{ pb: { xs: 8, sm: 3 } }}>
        <Box
          sx={{
            mb: { xs: 4, sm: 6 },
            px: { xs: 2, sm: 3, md: 0 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: { xs: 4, sm: 5 },
              pt: { xs: 2, sm: 3 },
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h1"
              sx={{
                mb: { xs: 1.5, sm: 2 },
                background: 'linear-gradient(135deg, #2C362C 0%, #4E614F 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Upcoming Weddings
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                maxWidth: '600px',
                mx: 'auto',
                px: { xs: 2, sm: 0 },
                color: 'text.secondary',
              }}
            >
              Plan and manage your special day with ease
            </Typography>
          </Box>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            sx={{
              mb: { xs: 3, sm: 4 },
            }}
          >
            <Tab
              icon={<FavoriteIcon />}
              label="My Wedding"
              sx={{
                flex: 1,
                minHeight: 48,
              }}
            />
            <Tab
              icon={<MailIcon />}
              label="Invited"
              sx={{
                flex: 1,
                minHeight: 48,
              }}
            />
          </Tabs>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: { xs: 3, sm: 4 },
              mx: { xs: 2, sm: 3, md: 0 },
            }}
          >
            {error}
          </Alert>
        )}

        <Grid 
          container 
          spacing={{ xs: 2, sm: 3 }} 
          sx={{ 
            px: { xs: 2, sm: 3, md: 0 },
          }}
        >
          {(tabValue === 0 ? weddings.owned : weddings.invited).map((wedding) => (
            <Grid item xs={12} sm={6} md={4} key={wedding.id}>
              <WeddingCard wedding={wedding} isOwned={tabValue === 0} />
            </Grid>
          ))}
        </Grid>

        {tabValue === 0 && (
          <Tooltip 
            title="Add Wedding" 
            placement="left"
            enterDelay={200}
            sx={{
              '& .MuiTooltip-tooltip': {
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: '8px',
                px: 2,
                py: 1,
                bgcolor: 'rgba(44, 54, 44, 0.9)',
                backdropFilter: 'blur(4px)',
              },
            }}
          >
            <Fab
              color="primary"
              aria-label="add wedding"
              onClick={handleCreateWedding}
              className={weddings.owned.length === 0 ? 'pulse' : ''}
              sx={{
                position: 'fixed',
                bottom: { xs: 16, sm: 24 },
                right: { xs: 16, sm: 24 },
              }}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        )}
      </Box>
    </Fade>
  );
};

export default WeddingList; 