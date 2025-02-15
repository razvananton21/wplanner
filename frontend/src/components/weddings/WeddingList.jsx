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
  alpha,
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
  CheckCircle as CheckCircleIcon,
  Assignment as TaskIcon,
} from '@mui/icons-material';
import { format, differenceInDays } from 'date-fns';
import weddingService from '../../services/weddingService';

const WeddingCard = ({ wedding, isOwned }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleCardClick = () => {
    navigate(`/weddings/${wedding.id}`);
  };

  const handleEditWedding = (id) => {
    navigate(`/weddings/${id}`, { state: { startEditing: true } });
  };

  const daysUntil = differenceInDays(new Date(wedding.date), new Date());
  const progress = (wedding.completedTasks / wedding.totalTasks) * 100;
  const taskProgress = {
    completed: wedding.completedTasks || 0,
    total: wedding.totalTasks || 0,
  };

  const flowerPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5zm0 50c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5zm20-20c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5zm-40 0c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5zm34.9-19.1c2 2 2 5.1 0 7.1s-5.1 2-7.1 0-2-5.1 0-7.1 5.1-2 7.1 0zm-29.8 29.8c2 2 2 5.1 0 7.1s-5.1 2-7.1 0-2-5.1 0-7.1 5.1-2 7.1 0zm0-29.8c2-2 5.1-2 7.1 0s2 5.1 0 7.1-5.1 2-7.1 0-2-5.1 0-7.1zm29.8 29.8c2-2 5.1-2 7.1 0s2 5.1 0 7.1-5.1 2-7.1 0-2-5.1 0-7.1z' fill='%23FFFFFF' fill-opacity='0.15' fill-rule='evenodd'/%3E%3C/svg%3E")`;

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
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        boxShadow: '0px 8px 24px rgba(104, 127, 108, 0.12)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0px 16px 40px ' + alpha(theme.palette.secondary.main, 0.16),
        },
      }}
      onClick={handleCardClick}
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
              background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
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
                background: flowerPattern,
                backgroundSize: '60px 60px',
                opacity: 0.2,
                animation: 'patternMove 30s linear infinite',
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
              bgcolor: 'rgba(255, 255, 255, 0.24)',
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
              },
            }}
          />
          <Typography
            variant="subtitle1"
            sx={{
              color: '#FFFFFF',
              fontWeight: 700,
              textShadow: '0px 2px 4px rgba(0,0,0,0.2)',
              fontSize: '1.25rem',
              fontStyle: 'italic',
              fontFamily: theme.typography.h1.fontFamily,
              letterSpacing: '0.02em',
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
          background: `linear-gradient(135deg, #FFFFFF 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
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
            <CalendarIcon sx={{ fontSize: '1.5rem', color: theme.palette.secondary.main }} />
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
              <LocationIcon sx={{ fontSize: '1.5rem', color: theme.palette.secondary.main }} />
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
              <PeopleIcon sx={{ fontSize: '1.5rem', color: theme.palette.secondary.main }} />
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

          {isOwned && (
            <Stack direction="row" alignItems="center" spacing={2}>
              <TaskIcon sx={{ fontSize: '1.5rem', color: theme.palette.secondary.main }} />
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: 'text.primary',
                      fontWeight: 500,
                      fontSize: '1.125rem',
                    }}
                  >
                    Tasks Progress
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.secondary.main,
                      fontWeight: 600,
                    }}
                  >
                    {taskProgress.completed}/{taskProgress.total}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={(taskProgress.completed / taskProgress.total) * 100}
                  sx={{
                    mt: 1,
                    height: 6,
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.secondary.main, 0.12),
                    '& .MuiLinearProgress-bar': {
                      background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
                    },
                  }}
                />
              </Box>
            </Stack>
          )}
        </Stack>

        <Button
          fullWidth
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/weddings/${wedding.id}`);
          }}
          sx={{
            mt: 'auto',
            fontWeight: 600,
            fontSize: '1.125rem',
            background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 24px ${alpha(theme.palette.secondary.main, 0.24)}`,
            },
          }}
        >
          Plan Your Wedding
        </Button>
      </CardContent>
    </Card>
  );
};

const TabPanel = ({ children, value, index }) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ width: '100%' }}>
    {value === index && children}
  </Box>
);

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
      <Box sx={{ pb: 3 }}>
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
              pt: { xs: 3, sm: 4 },
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h1"
              sx={{
                mb: { xs: 2, sm: 2.5 },
                fontSize: { xs: '2.5rem', sm: '3.25rem' },
                lineHeight: { xs: 1.2, sm: 1.3 },
                fontWeight: 600,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #2C362C 0%, #4E614F 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0px 2px 4px rgba(0,0,0,0.05)',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '2px',
                  background: `linear-gradient(90deg, transparent, ${theme.palette.secondary.main}, transparent)`,
                },
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
                color: theme.palette.text.secondary,
                fontSize: { xs: '1rem', sm: '1.125rem' },
                lineHeight: 1.6,
                mt: 3,
                fontStyle: 'italic',
                letterSpacing: '0.01em',
              }}
            >
              Plan and manage your special day with ease
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: { xs: 3, sm: 4 },
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                minHeight: 56,
                width: '100%',
                maxWidth: '320px',
                bgcolor: alpha(theme.palette.secondary.main, 0.08),
                borderRadius: '32px',
                p: 1,
                '& .MuiTabs-indicator': {
                  height: '100%',
                  borderRadius: '24px',
                  background: '#FFFFFF',
                  boxShadow: '0 4px 12px ' + alpha(theme.palette.secondary.main, 0.24),
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  zIndex: 0,
                },
                '& .MuiTabs-flexContainer': {
                  gap: 1,
                  position: 'relative',
                  zIndex: 1,
                },
              }}
            >
              <Tooltip 
                title="Your Wedding Details" 
                placement="top"
                enterDelay={300}
              >
                <Tab
                  icon={<FavoriteIcon />}
                  label="My Wedding"
                  sx={{
                    minHeight: 48,
                    borderRadius: '24px',
                    color: 'text.secondary',
                    fontWeight: 600,
                    fontSize: '0.9375rem',
                    letterSpacing: '0.02em',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.secondary.main, 0.12),
                      transform: 'scale(1.02)',
                      boxShadow: '0 2px 8px ' + alpha(theme.palette.secondary.main, 0.16),
                    },
                    '&.Mui-selected': {
                      color: 'text.primary',
                      bgcolor: 'background.paper',
                      boxShadow: '0 4px 12px ' + alpha(theme.palette.secondary.main, 0.24),
                      '&:hover': {
                        bgcolor: 'background.paper',
                        transform: 'scale(1.02)',
                      },
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: '1.25rem',
                      marginRight: '8px',
                      color: theme.palette.secondary.main,
                      transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    },
                    '&:hover .MuiSvgIcon-root': {
                      transform: 'scale(1.1)',
                    },
                  }}
                />
              </Tooltip>
              <Tooltip 
                title="Events You're Invited To" 
                placement="top"
                enterDelay={300}
              >
                <Tab
                  icon={<MailIcon />}
                  label="Invited"
                  sx={{
                    minHeight: 48,
                    borderRadius: '24px',
                    color: 'text.secondary',
                    fontWeight: 600,
                    fontSize: '0.9375rem',
                    letterSpacing: '0.02em',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.secondary.main, 0.12),
                      transform: 'scale(1.02)',
                      boxShadow: '0 2px 8px ' + alpha(theme.palette.secondary.main, 0.16),
                    },
                    '&.Mui-selected': {
                      color: 'text.primary',
                      bgcolor: 'background.paper',
                      boxShadow: '0 4px 12px ' + alpha(theme.palette.secondary.main, 0.24),
                      '&:hover': {
                        bgcolor: 'background.paper',
                        transform: 'scale(1.02)',
                      },
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: '1.25rem',
                      marginRight: '8px',
                      color: theme.palette.secondary.main,
                      transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    },
                    '&:hover .MuiSvgIcon-root': {
                      transform: 'scale(1.1)',
                    },
                  }}
                />
              </Tooltip>
            </Tabs>
          </Box>
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
          {(tabValue === 0 ? weddings.owned : weddings.invited).map((wedding, index) => (
            <Fade 
              in 
              timeout={800 + index * 100}
              key={wedding.id}
            >
              <Grid item xs={12} sm={6} md={4}>
                <WeddingCard wedding={wedding} isOwned={tabValue === 0} />
              </Grid>
            </Fade>
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