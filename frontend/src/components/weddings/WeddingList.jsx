import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
  Fade,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import weddingService from '../../services/weddingService';

const WeddingList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [weddings, setWeddings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeddings = async () => {
      try {
        setLoading(true);
        const data = await weddingService.getWeddings();
        // Filter out deleted weddings and sort by date
        const activeWeddings = data.managed
          .filter(wedding => !wedding.deletedAt)
          .sort((a, b) => new Date(a.date) - new Date(b.date));
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

  const handleViewDetails = (id) => {
    navigate(`/weddings/${id}`);
  };

  const handleEditWedding = (id) => {
    navigate(`/weddings/${id}`, { state: { startEditing: true } });
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Fade in timeout={800}>
      <Box sx={{ pb: isMobile ? 8 : 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            px: isMobile ? 2 : 0,
            position: 'sticky',
            top: 0,
            bgcolor: 'background.default',
            zIndex: 1,
            py: 2,
          }}
        >
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            sx={{
              fontWeight: 700,
              background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            My Weddings
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateWedding}
            sx={{
              background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
              '&:hover': {
                background: `linear-gradient(120deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
              },
              minWidth: isMobile ? 'auto' : undefined,
              px: isMobile ? 2 : 3,
            }}
          >
            {isMobile ? 'Add' : 'Create Wedding'}
          </Button>
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

        <Grid container spacing={isMobile ? 2 : 3}>
          {weddings.map((wedding, index) => (
            <Grid item xs={12} sm={6} md={4} key={wedding.id}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'visible',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    borderRadius: '16px 16px 0 0',
                  },
                }}
              >
                <CardContent sx={{ flex: 1, p: isMobile ? 2 : 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: theme.palette.text.primary,
                        fontSize: isMobile ? '1.1rem' : undefined,
                      }}
                    >
                      {wedding.title}
                    </Typography>
                    <Stack 
                      direction={isMobile ? 'column' : 'row'} 
                      spacing={isMobile ? 1 : 2} 
                      sx={{ mb: 2 }}
                    >
                      <Chip
                        icon={<CalendarIcon />}
                        label={format(new Date(wedding.date), 'MMM d, yyyy')}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(45, 48, 71, 0.05)',
                          color: theme.palette.text.secondary,
                          width: isMobile ? 'fit-content' : undefined,
                        }}
                      />
                      {wedding.venue && (
                        <Chip
                          icon={<LocationIcon />}
                          label={wedding.venue}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(232, 95, 92, 0.05)',
                            color: theme.palette.text.secondary,
                            width: isMobile ? 'fit-content' : undefined,
                          }}
                        />
                      )}
                    </Stack>
                    {wedding.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {wedding.description}
                      </Typography>
                    )}
                  </Box>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      mt: 'auto',
                      pt: 2,
                      borderTop: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Button
                      startIcon={<ViewIcon />}
                      onClick={() => handleViewDetails(wedding.id)}
                      size={isMobile ? 'medium' : 'small'}
                      sx={{ 
                        flex: 1,
                        height: isMobile ? 40 : undefined,
                      }}
                    >
                      View Details
                    </Button>
                    <IconButton
                      size={isMobile ? 'medium' : 'small'}
                      onClick={() => handleEditWedding(wedding.id)}
                      sx={{ 
                        color: theme.palette.text.secondary,
                        width: isMobile ? 40 : 32,
                        height: isMobile ? 40 : 32,
                      }}
                    >
                      <EditIcon fontSize={isMobile ? 'small' : 'inherit'} />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
              {isMobile && index < weddings.length - 1 && (
                <Divider sx={{ my: 2 }} />
              )}
            </Grid>
          ))}
        </Grid>

        {!loading && weddings.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              px: 2,
              bgcolor: 'background.paper',
              borderRadius: 2,
              mt: 4,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No weddings yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first wedding to get started with planning
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateWedding}
              sx={{
                background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: 'white',
                '&:hover': {
                  background: `linear-gradient(120deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                },
              }}
            >
              Create Wedding
            </Button>
          </Box>
        )}
      </Box>
    </Fade>
  );
};

export default WeddingList; 