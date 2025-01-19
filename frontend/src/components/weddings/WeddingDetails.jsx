import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
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
  CircularProgress,
  Stack,
  LinearProgress,
  alpha,
  Collapse,
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
  LocationOn as LocationIcon,
  Assignment as TasksIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CalendarToday as CalendarTodayIcon,
} from '@mui/icons-material';
import weddingService from '../../services/weddingService';
import GuestList from '../guests/GuestList';
import Timeline from '../timeline/Timeline';

const WeddingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true);
  const [wedding, setWedding] = useState(null);
  const [error, setError] = useState(null);
  
  // Get the section from the URL path
  const section = location.pathname.split('/').pop();
  const [activeTab, setActiveTab] = useState(section || 'details');

  useEffect(() => {
    // Update activeTab when the section changes
    setActiveTab(section || 'details');
  }, [section]);

  const [viewMode, setViewMode] = useState('list');
  const [expandedSections, setExpandedSections] = useState({
    planning: true,
    people: true,
    communication: true,
  });

  const flowerPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5zm0 50c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5zm20-20c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5zm-40 0c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5zm34.9-19.1c2 2 2 5.1 0 7.1s-5.1 2-7.1 0-2-5.1 0-7.1 5.1-2 7.1 0zm-29.8 29.8c2 2 2 5.1 0 7.1s-5.1 2-7.1 0-2-5.1 0-7.1 5.1-2 7.1 0zm0-29.8c2-2 5.1-2 7.1 0s2 5.1 0 7.1-5.1 2-7.1 0-2-5.1 0-7.1zm29.8 29.8c2-2 5.1-2 7.1 0s2 5.1 0 7.1-5.1 2-7.1 0-2-5.1 0-7.1z' fill='%234A5D4E' fill-opacity='0.015' fill-rule='evenodd'/%3E%3C/svg%3E")`;

  useEffect(() => {
    const fetchWedding = async () => {
      if (id === 'new') {
        // Handle new wedding case
        setLoading(false);
        return;
      }
      
      try {
        const response = await weddingService.getWedding(id);
        setWedding(response.wedding);
      } catch (err) {
        console.error('Failed to fetch wedding:', err);
      } finally {
        setLoading(false);
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
    if (path === 'details') {
      navigate(`/weddings/${id}/edit`);
      return;
    }
    if (path === 'guests') {
      navigate(`/weddings/${id}/guests`);
      return;
    }
    if (path === 'timeline') {
      navigate(`/weddings/${id}/timeline`);
      return;
    }
    if (path === 'tasks') {
      navigate(`/weddings/${id}/tasks`);
      return;
    }
    if (path === 'vendors') {
      navigate(`/weddings/${id}/vendors`);
      return;
    }
    if (path === 'tables') {
      navigate(`/weddings/${id}/tables`);
      return;
    }
    if (path === 'rsvp-form') {
      navigate(`/weddings/${id}/rsvp-form`);
      return;
    }
    if (id === 'new') {
      console.log('Creating new wedding...');
      return;
    }
    navigate(`/weddings/${id}/${path}`);
  };

  const calculateDaysUntil = (date) => {
    if (!date) return null;
    const weddingDate = new Date(date);
    const today = new Date();
    const diffTime = weddingDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Add keyframes for animations
  const keyframes = `
    @keyframes slideInFromRight {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes slideInFromLeft {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `;

  // Add style tag for keyframes
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = keyframes;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [keyframes]);

  const renderViewSwitcher = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3.5 }}>
      <Box
        sx={{
          display: 'inline-flex',
          bgcolor: 'transparent',
          borderRadius: '32px',
          p: 0.75,
          border: '1px solid',
          borderColor: '#E8D9C8',
          boxShadow: `0 2px 8px ${alpha('#E6D9C8', 0.15)}`,
          position: 'relative',
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          onClick={() => setViewMode('grid')}
          sx={{
            px: 2.75,
            py: 1.5,
            borderRadius: '28px',
            cursor: 'pointer',
            position: 'relative',
            bgcolor: viewMode === 'grid' ? '#E8D9C8' : 'transparent',
            border: '1px solid',
            borderColor: viewMode === 'grid' ? '#E8D9C8' : alpha('#E8D9C8', 0.6),
            boxShadow: viewMode === 'grid'
              ? 'inset 0 2px 4px rgba(255,255,255,0.6), 0 3px 12px rgba(230, 217, 200, 0.3)'
              : 'none',
            transform: viewMode === 'grid' ? 'translateY(-1px)' : 'none',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            '&:hover': {
              borderColor: viewMode === 'grid' ? '#E8D9C8' : '#D8C5AD',
              bgcolor: viewMode === 'grid' ? '#E8D9C8' : alpha('#E8D9C8', 0.08),
              transform: 'translateY(-1px)',
              boxShadow: viewMode === 'grid'
                ? 'inset 0 2px 4px rgba(255,255,255,0.7), 0 4px 16px rgba(230, 217, 200, 0.35)'
                : '0 2px 8px rgba(230, 217, 200, 0.15)',
            },
          }}
        >
          <GridViewIcon sx={{ 
            fontSize: 22,
            color: viewMode === 'grid' ? '#5C5C5C' : '#8F8F8F',
            opacity: viewMode === 'grid' ? 1 : 0.8,
          }} />
          <Typography
            sx={{
              fontSize: '0.9rem',
              fontWeight: viewMode === 'grid' ? 600 : 500,
              color: viewMode === 'grid' ? '#5C5C5C' : '#8F8F8F',
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            Grid View
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          onClick={() => setViewMode('list')}
          sx={{
            px: 2.75,
            py: 1.5,
            borderRadius: '28px',
            cursor: 'pointer',
            position: 'relative',
            bgcolor: viewMode === 'list' ? '#E8D9C8' : 'transparent',
            border: '1px solid',
            borderColor: viewMode === 'list' ? '#E8D9C8' : alpha('#E8D9C8', 0.6),
            boxShadow: viewMode === 'list'
              ? 'inset 0 2px 4px rgba(255,255,255,0.6), 0 3px 12px rgba(230, 217, 200, 0.3)'
              : 'none',
            transform: viewMode === 'list' ? 'translateY(-1px)' : 'none',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            '&:hover': {
              borderColor: viewMode === 'list' ? '#E8D9C8' : '#D8C5AD',
              bgcolor: viewMode === 'list' ? '#E8D9C8' : alpha('#E8D9C8', 0.08),
              transform: 'translateY(-1px)',
              boxShadow: viewMode === 'list'
                ? 'inset 0 2px 4px rgba(255,255,255,0.7), 0 4px 16px rgba(230, 217, 200, 0.35)'
                : '0 2px 8px rgba(230, 217, 200, 0.15)',
            },
          }}
        >
          <ViewListIcon sx={{ 
            fontSize: 22,
            color: viewMode === 'list' ? '#5C5C5C' : '#8F8F8F',
            opacity: viewMode === 'list' ? 1 : 0.8,
          }} />
          <Typography
            sx={{
              fontSize: '0.9rem',
              fontWeight: viewMode === 'list' ? 600 : 500,
              color: viewMode === 'list' ? '#5C5C5C' : '#8F8F8F',
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            List View
          </Typography>
        </Stack>
      </Box>
    </Box>
  );

  const renderSectionHeader = (title, section) => (
    <Box
      onClick={() => toggleSection(section)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 3.5,
        px: 4,
        cursor: 'pointer',
        borderRadius: '24px',
        bgcolor: '#F5EFEA',
        position: 'relative',
        '&:hover': {
          bgcolor: '#F0EAE5',
          transform: 'translateY(-1px)',
          boxShadow: `0 4px 16px ${alpha('#E8E3DD', 0.25)}`,
          '&::after': {
            opacity: 1,
            transform: 'scaleX(1)',
          },
        },
        mt: 4,
        mb: 3,
        boxShadow: `0 2px 12px ${alpha('#E8E3DD', 0.2)}`,
        border: '1px solid',
        borderColor: '#E8E3DD',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:active': {
          transform: 'translateY(0)',
          transition: 'all 0.1s ease',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 'inherit',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)',
          opacity: 0.8,
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: '50%',
          width: '90%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, #E8E3DD 50%, transparent 100%)',
          transform: 'translateX(-50%) scaleX(0.95)',
          opacity: 0.6,
          transition: 'all 0.3s ease',
        },
      }}
    >
      <Typography
        className="section-title"
        variant="h6"
        sx={{
          margin: 0,
          color: '#5C5C5C',
          transition: 'all 0.2s ease',
          fontWeight: 700,
          letterSpacing: '0.02em',
          fontStyle: 'italic',
          fontFamily: theme.typography.h1.fontFamily,
          position: 'relative',
          fontSize: '1.2rem',
          textShadow: '0 1px 1px rgba(255,255,255,0.6)',
          display: 'inline-flex',
          alignItems: 'center',
          '&:hover': {
            color: '#4A4A4A',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            bottom: -4,
            left: 0,
            width: '100%',
            height: '2px',
            background: 'linear-gradient(90deg, #5C5C5C 0%, rgba(92, 92, 92, 0.2) 100%)',
            borderRadius: '2px',
            opacity: 0.3,
            transform: expandedSections[section] ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          transform: expandedSections[section] ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          color: '#7A6B63',
          opacity: expandedSections[section] ? 0.9 : 0.7,
          '&:hover': {
            opacity: 1,
          },
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          bgcolor: expandedSections[section] ? alpha('#7A6B63', 0.08) : 'transparent',
          transition: 'all 0.3s ease',
          ml: 2,
        }}
      >
        {expandedSections[section] ? (
          <ExpandLessIcon sx={{ fontSize: 24 }} />
        ) : (
          <ExpandMoreIcon sx={{ fontSize: 24 }} />
        )}
      </Box>
    </Box>
  );

  const renderListView = (items, sectionTitle, section) => (
    <Box 
      sx={{ 
        mb: 4,
        position: 'relative',
        '&::after': expandedSections[section] ? {
          content: '""',
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: -16,
          height: '1px',
          bgcolor: '#E8E3DD',
        } : {},
      }}
    >
      {renderSectionHeader(sectionTitle, section)}
      <Collapse 
        in={expandedSections[section]}
        timeout={400}
        sx={{
          '& .MuiCollapse-wrapper': {
            borderRadius: '0 0 16px 16px',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        }}
      >
        <Box 
          sx={{ 
            px: 1,
            py: 1,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              borderRadius: '16px',
              bgcolor: alpha('#FAF8F4', 0.8),
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.04)}`,
              zIndex: -1,
            },
          }}
        >
          {items.map(({ icon: Icon, label, path }, index) => (
            <Card
              key={path}
              onClick={() => handleNavigate(path)}
              sx={{
                mb: 2,
                cursor: 'pointer',
                bgcolor: index % 2 === 0 ? '#FFFFFF' : '#FAF8F4',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid #E8E3DD',
                borderRadius: '16px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                animation: `fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s`,
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  borderColor: '#DED9D2',
                  bgcolor: index % 2 === 0 ? '#F7F5F1' : '#F2EEE9',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.06)',
                  '&::before': {
                    opacity: 1,
                  },
                  '&::after': {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
                '&:active': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.1s ease',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 'inherit',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 100%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  pointerEvents: 'none',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, #E8E3DD 0%, rgba(232, 227, 221, 0.3) 100%)',
                  opacity: 0,
                  transform: 'translateY(3px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  pointerEvents: 'none',
                },
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: '22px !important',
                  position: 'relative',
                  zIndex: 1,
                  '&:last-child': {
                    paddingRight: '22px !important',
                  },
                }}
              >
                <Box
                  className="list-item-icon-wrapper"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 56,
                    height: 56,
                    borderRadius: '18px',
                    bgcolor: alpha('#B0A396', 0.1),
                    mr: 2.5,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 'inherit',
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)',
                      opacity: 0.95,
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 1,
                      left: 1,
                      right: 1,
                      bottom: 1,
                      borderRadius: 'inherit',
                      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.9), inset 0 -2px 4px rgba(176, 163, 150, 0.1)',
                      pointerEvents: 'none',
                    },
                    '.MuiCard-root:hover &': {
                      bgcolor: alpha('#B0A396', 0.15),
                      transform: 'scale(1.05)',
                      '&::after': {
                        boxShadow: 'inset 0 3px 6px rgba(255,255,255,1), inset 0 -2px 4px rgba(176, 163, 150, 0.2)',
                      },
                    },
                  }}
                >
                  <Icon
                    className="list-item-icon"
                    sx={{
                      fontSize: 32,
                      color: '#B0A396',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      filter: 'drop-shadow(0 2px 3px rgba(176, 163, 150, 0.25))',
                      position: 'relative',
                      zIndex: 1,
                      '.MuiCard-root:hover &': {
                        color: '#9A8E82',
                        transform: 'scale(1.1) translateY(-1px)',
                        filter: 'drop-shadow(0 3px 5px rgba(176, 163, 150, 0.35))',
                      },
                    }}
                  />
                </Box>
                <Box sx={{ 
                  flex: 1, 
                  minWidth: 0,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    right: -12,
                    top: '50%',
                    width: 24,
                    height: 24,
                    background: 'radial-gradient(circle, rgba(232,227,221,0.2) 0%, rgba(232,227,221,0) 70%)',
                    transform: 'translateY(-50%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none',
                    '.MuiCard-root:hover &': {
                      opacity: 1,
                    },
                  },
                }}>
                  <Typography
                    className="list-item-title"
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#5C5C5C',
                      transition: 'color 0.2s ease',
                      mb: 0.75,
                      letterSpacing: '0.015em',
                      lineHeight: 1.4,
                      fontFamily: theme.typography.h1.fontFamily,
                      '& .MuiCard-root:hover &': {
                        color: '#4A4A4A',
                      },
                    }}
                  >
                    {label}
                  </Typography>
                  <Typography 
                    className="list-item-subtitle"
                    sx={{
                      fontSize: '0.85rem',
                      color: '#8F8F8F',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      opacity: 0.95,
                      letterSpacing: '0.01em',
                      lineHeight: 1.5,
                      fontFamily: theme.typography.body1.fontFamily,
                      transition: 'color 0.2s ease',
                      '.MuiCard-root:hover &': {
                        color: '#757575',
                      },
                    }}
                  >
                    {path === 'timeline' && "Schedule"}
                    {path === 'tasks' && `${wedding?.completedTasks || 0}/${wedding?.totalTasks || 0}`}
                    {path === 'details' && "Edit"}
                    {path === 'vendors' && "Manage vendors"}
                    {path === 'guests' && "Guest list"}
                    {path === 'tables' && "Seating plan"}
                    {path === 'rsvp-form' && "Responses"}
                    {path === 'invitation' && "Design"}
                    {path === 'budget' && "Expenses"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    ml: 2.5,
                    height: '100%',
                  }}
                >
                  <ChevronRightIcon
                    sx={{
                      fontSize: 28,
                      color: '#B0A396',
                      opacity: 0.85,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      filter: 'drop-shadow(0 1px 2px rgba(176, 163, 150, 0.2))',
                      '.MuiCard-root:hover &': {
                        opacity: 1,
                        transform: 'translateX(3px)',
                        color: '#9A8E82',
                        filter: 'drop-shadow(0 2px 4px rgba(176, 163, 150, 0.3))',
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Collapse>
    </Box>
  );

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderSection = () => {
    switch (activeTab) {
      case 'details':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Wedding Details
            </Typography>
            {/* Add your details section content here */}
          </Box>
        );
      case 'guests':
        return <GuestList weddingId={id} />;
      case 'invitation':
      case 'budget':
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Coming soon
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Fade in timeout={800}>
      <Box 
        sx={{ 
          pb: 4,
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            position: 'relative',
            height: isMobile ? '16vh' : '18vh',
            borderRadius: '0 0 24px 24px',
            overflow: 'hidden',
            mb: 2,
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F5EFEA 100%)',
            boxShadow: '0 2px 12px rgba(232, 227, 221, 0.25)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: flowerPattern,
              backgroundSize: '60px 60px',
              opacity: 0.12,
              animation: 'patternMove 30s linear infinite',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '5%',
              right: '5%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #E8E3DD 50%, transparent)',
              opacity: 0.9,
            },
          }}
        >
          {/* Back Button */}
          <IconButton
            onClick={() => navigate('/weddings')}
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 2px 8px rgba(232, 227, 221, 0.2)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 1)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(232, 227, 221, 0.3)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <ArrowBackIcon sx={{ color: '#5C5C5C' }} />
          </IconButton>

          {/* Wedding Title and Details */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 24,
              left: 24,
              right: 24,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: '#5C5C5C',
                fontFamily: theme.typography.h1.fontFamily,
                fontWeight: 700,
                fontSize: isMobile ? '1.75rem' : '2rem',
                mb: 1,
                textShadow: '0 1px 1px rgba(255,255,255,0.9)',
                letterSpacing: '0.01em',
              }}
            >
              {wedding?.title || 'Razvan & Adriana'}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: '#7A6F63',
                fontStyle: 'italic',
                mb: 1,
                textShadow: '0 1px 1px rgba(255,255,255,0.7)',
                fontSize: '1.1rem',
                letterSpacing: '0.02em',
              }}
            >
              {calculateDaysUntil(wedding?.date) > 0
                ? `${calculateDaysUntil(wedding?.date)} Days Until the Big Day!`
                : 'Today is the Big Day!'}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                color: '#8F8F8F',
                fontSize: '0.9rem',
                mt: 1.5,
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 0.75,
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(8px)',
                px: 2,
                py: 0.75,
                borderRadius: '14px',
                boxShadow: '0 1px 3px rgba(232, 227, 221, 0.25)',
                border: '1px solid rgba(232, 227, 221, 0.4)',
              }}>
                <CalendarTodayIcon sx={{ fontSize: '1.1rem', color: '#7A6F63' }} />
                <span style={{ color: '#7A6F63' }}>{wedding?.date ? format(new Date(wedding.date), 'MMMM d, yyyy') : 'January 31, 2025'}</span>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 0.75,
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(8px)',
                px: 2,
                py: 0.75,
                borderRadius: '14px',
                boxShadow: '0 1px 3px rgba(232, 227, 221, 0.25)',
                border: '1px solid rgba(232, 227, 221, 0.4)',
              }}>
                <LocationIcon sx={{ fontSize: '1.1rem', color: '#7A6F63' }} />
                <span style={{ color: '#7A6F63' }}>{wedding?.location || 'Vanatori'}</span>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Menu Section */}
        <Box sx={{ px: isMobile ? 2 : 4 }}>
          {renderViewSwitcher()}
          
          <Box sx={{ position: 'relative', minHeight: 200 }}>
            <Fade in={viewMode === 'grid'} timeout={300} unmountOnExit>
              <Box sx={{ 
                position: 'absolute',
                width: '100%',
                animation: viewMode === 'grid' ? 'slideInFromLeft 0.4s ease-out' : 'none',
              }}>
                {/* Planning Section */}
                {renderSectionHeader('Planning', 'planning')}
                <Collapse in={expandedSections.planning} timeout={300}>
                  <Grid 
                    container 
                    spacing={2} 
                    sx={{ 
                      mb: 3,
                      '& .MuiGrid-item': {
                        animation: 'fadeInUp 0.6s ease-out forwards',
                        animationDelay: (props) => `${props.index * 0.1}s`,
                      },
                    }}
                  >
                    {menuItems.slice(0, 3).map((item, index) => (
                      <Grid item xs={6} sm={4} key={item.path} index={index}>
                        <Card
                          onClick={() => handleNavigate(item.path)}
                          sx={{
                            minHeight: { xs: 140, sm: 160 },
                            cursor: 'pointer',
                            background: `linear-gradient(135deg, #FFFFFF 0%, ${alpha(theme.palette.accent.champagne, 0.4)} 100%)`,
                            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            border: '1px solid',
                            borderColor: activeTab === item.path 
                              ? theme.palette.secondary.main 
                              : alpha(theme.palette.secondary.main, 0.08),
                            borderRadius: '16px',
                            boxShadow: '0 4px 12px ' + alpha(theme.palette.secondary.main, 0.08),
                            overflow: 'hidden',
                            position: 'relative',
                            '&:hover': {
                              transform: 'translateY(-2px) scale(1.01)',
                              boxShadow: '0 6px 20px ' + alpha(theme.palette.secondary.main, 0.12),
                              borderColor: theme.palette.secondary.main,
                              '& .icon-wrapper': {
                                transform: 'scale(1.05)',
                                background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
                                '& .MuiSvgIcon-root': {
                                  color: '#FFFFFF',
                                },
                              },
                            },
                            ...(activeTab === item.path && {
                              background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.light, 0.12)} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
                              borderColor: theme.palette.secondary.main,
                              '& .icon-wrapper': {
                                background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
                                '& .MuiSvgIcon-root': {
                                  color: '#FFFFFF',
                                },
                              },
                            }),
                          }}
                        >
                          <CardContent
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              textAlign: 'center',
                              p: 1.5,
                              height: '100%',
                              '&:last-child': { pb: 1.5 },
                            }}
                          >
                            <Box
                              className="icon-wrapper"
                              sx={{
                                width: 48,
                                height: 48,
                                minWidth: 48,
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 1,
                                background: alpha(theme.palette.secondary.main, 0.08),
                                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                              }}
                            >
                              <item.icon sx={{ 
                                fontSize: 24,
                                color: theme.palette.secondary.main,
                                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                              }} />
                            </Box>
                            <Typography
                              variant="h6"
                              sx={{
                                color: theme.palette.text.primary,
                                fontSize: '0.9375rem',
                                fontWeight: 700,
                                fontFamily: theme.typography.h1.fontFamily,
                                mb: 0.25,
                                letterSpacing: '0.01em',
                              }}
                            >
                              {item.label}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: alpha(theme.palette.text.secondary, 0.7),
                                fontSize: '0.8125rem',
                                fontWeight: 400,
                                lineHeight: 1.3,
                                letterSpacing: '0.01em',
                              }}
                            >
                              {item.path === 'timeline' && "Schedule"}
                              {item.path === 'tasks' && `${wedding?.completedTasks || 0}/${wedding?.totalTasks || 0}`}
                              {item.path === 'details' && "Edit"}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Collapse>

                {/* People & Seating Section */}
                {renderSectionHeader('People & Seating', 'people')}
                <Collapse in={expandedSections.people} timeout={300}>
                  <Grid 
                    container 
                    spacing={2} 
                    sx={{ 
                      mb: 3,
                      '& .MuiGrid-item': {
                        animation: 'fadeInUp 0.6s ease-out forwards',
                        animationDelay: (props) => `${props.index * 0.1}s`,
                      },
                    }}
                  >
                    {menuItems.slice(3, 6).map((item, index) => (
                      <Grid item xs={6} sm={4} key={item.path} index={index}>
                        <Card
                          onClick={() => handleNavigate(item.path)}
                          sx={{
                            minHeight: { xs: 140, sm: 160 },
                            cursor: 'pointer',
                            background: `linear-gradient(135deg, #FFFFFF 0%, ${alpha(theme.palette.accent.champagne, 0.4)} 100%)`,
                            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            border: '1px solid',
                            borderColor: activeTab === item.path 
                              ? theme.palette.secondary.main 
                              : alpha(theme.palette.secondary.main, 0.08),
                            borderRadius: '16px',
                            boxShadow: '0 4px 12px ' + alpha(theme.palette.secondary.main, 0.08),
                            overflow: 'hidden',
                            position: 'relative',
                            '&:hover': {
                              transform: 'translateY(-2px) scale(1.01)',
                              boxShadow: '0 6px 20px ' + alpha(theme.palette.secondary.main, 0.12),
                              borderColor: theme.palette.secondary.main,
                              '& .icon-wrapper': {
                                transform: 'scale(1.05)',
                                background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
                                '& .MuiSvgIcon-root': {
                                  color: '#FFFFFF',
                                },
                              },
                            },
                            ...(activeTab === item.path && {
                              background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.light, 0.12)} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
                              borderColor: theme.palette.secondary.main,
                              '& .icon-wrapper': {
                                background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
                                '& .MuiSvgIcon-root': {
                                  color: '#FFFFFF',
                                },
                              },
                            }),
                          }}
                        >
                          <CardContent
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              textAlign: 'center',
                              p: 1.5,
                              height: '100%',
                              '&:last-child': { pb: 1.5 },
                            }}
                          >
                            <Box
                              className="icon-wrapper"
                              sx={{
                                width: 48,
                                height: 48,
                                minWidth: 48,
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 1,
                                background: alpha(theme.palette.secondary.main, 0.08),
                                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                              }}
                            >
                              <item.icon sx={{ 
                                fontSize: 24,
                                color: theme.palette.secondary.main,
                                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                              }} />
                            </Box>
                            <Typography
                              variant="h6"
                              sx={{
                                color: theme.palette.text.primary,
                                fontSize: '0.9375rem',
                                fontWeight: 700,
                                fontFamily: theme.typography.h1.fontFamily,
                                mb: 0.25,
                                letterSpacing: '0.01em',
                              }}
                            >
                              {item.label}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: alpha(theme.palette.text.secondary, 0.7),
                                fontSize: '0.8125rem',
                                fontWeight: 400,
                                lineHeight: 1.3,
                                letterSpacing: '0.01em',
                              }}
                            >
                              {item.path === 'timeline' && "Schedule"}
                              {item.path === 'tasks' && `${wedding?.completedTasks || 0}/${wedding?.totalTasks || 0}`}
                              {item.path === 'details' && "Edit"}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Collapse>

                {/* Communication & Budget Section */}
                {renderSectionHeader('Communication & Budget', 'communication')}
                <Collapse in={expandedSections.communication} timeout={300}>
                  <Grid 
                    container 
                    spacing={2} 
                    sx={{ 
                      mb: 3,
                      '& .MuiGrid-item': {
                        animation: 'fadeInUp 0.6s ease-out forwards',
                        animationDelay: (props) => `${props.index * 0.1}s`,
                      },
                    }}
                  >
                    {menuItems.slice(6).map((item, index) => (
                      <Grid item xs={6} sm={4} key={item.path} index={index}>
                        <Card
                          onClick={() => handleNavigate(item.path)}
                          sx={{
                            minHeight: { xs: 140, sm: 160 },
                            cursor: 'pointer',
                            background: `linear-gradient(135deg, #FFFFFF 0%, ${alpha(theme.palette.accent.champagne, 0.4)} 100%)`,
                            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            border: '1px solid',
                            borderColor: activeTab === item.path 
                              ? theme.palette.secondary.main 
                              : alpha(theme.palette.secondary.main, 0.08),
                            borderRadius: '16px',
                            boxShadow: '0 4px 12px ' + alpha(theme.palette.secondary.main, 0.08),
                            overflow: 'hidden',
                            position: 'relative',
                            '&:hover': {
                              transform: 'translateY(-2px) scale(1.01)',
                              boxShadow: '0 6px 20px ' + alpha(theme.palette.secondary.main, 0.12),
                              borderColor: theme.palette.secondary.main,
                              '& .icon-wrapper': {
                                transform: 'scale(1.05)',
                                background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
                                '& .MuiSvgIcon-root': {
                                  color: '#FFFFFF',
                                },
                              },
                            },
                            ...(activeTab === item.path && {
                              background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.light, 0.12)} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
                              borderColor: theme.palette.secondary.main,
                              '& .icon-wrapper': {
                                background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
                                '& .MuiSvgIcon-root': {
                                  color: '#FFFFFF',
                                },
                              },
                            }),
                          }}
                        >
                          <CardContent
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              textAlign: 'center',
                              p: 1.5,
                              height: '100%',
                              '&:last-child': { pb: 1.5 },
                            }}
                          >
                            <Box
                              className="icon-wrapper"
                              sx={{
                                width: 48,
                                height: 48,
                                minWidth: 48,
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 1,
                                background: alpha(theme.palette.secondary.main, 0.08),
                                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                              }}
                            >
                              <item.icon sx={{ 
                                fontSize: 24,
                                color: theme.palette.secondary.main,
                                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                              }} />
                            </Box>
                            <Typography
                              variant="h6"
                              sx={{
                                color: theme.palette.text.primary,
                                fontSize: '0.9375rem',
                                fontWeight: 700,
                                fontFamily: theme.typography.h1.fontFamily,
                                mb: 0.25,
                                letterSpacing: '0.01em',
                              }}
                            >
                              {item.label}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: alpha(theme.palette.text.secondary, 0.7),
                                fontSize: '0.8125rem',
                                fontWeight: 400,
                                lineHeight: 1.3,
                                letterSpacing: '0.01em',
                              }}
                            >
                              {item.path === 'timeline' && "Schedule"}
                              {item.path === 'tasks' && `${wedding?.completedTasks || 0}/${wedding?.totalTasks || 0}`}
                              {item.path === 'details' && "Edit"}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Collapse>
              </Box>
            </Fade>

            <Fade in={viewMode === 'list'} timeout={300} unmountOnExit>
              <Box sx={{ 
                position: 'absolute',
                width: '100%',
                animation: viewMode === 'list' ? 'slideInFromRight 0.4s ease-out' : 'none',
              }}>
                {renderListView(menuItems.slice(0, 3), 'Planning', 'planning')}
                {renderListView(menuItems.slice(3, 6), 'People & Seating', 'people')}
                {renderListView(menuItems.slice(6), 'Communication & Budget', 'communication')}
              </Box>
            </Fade>
          </Box>
        </Box>

        {/* Content Section */}
        <Box sx={{ mt: 4, px: isMobile ? 2 : 4 }}>
          {renderSection()}
        </Box>
      </Box>
    </Fade>
  );
};

export default WeddingDetails;