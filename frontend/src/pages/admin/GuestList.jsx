import React from 'react';
import styled from 'styled-components';
import { PopupOverlay, PopupContent, PopupClose, DetailRow } from '../../components/shared/Popup';
import GuestDetailsPopup from '../../components/shared/GuestDetailsPopup';

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
`;

const StatLabel = styled.div`
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  color: #1a202c;
  font-size: 2rem;
  font-weight: 600;
`;

const GuestTable = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 2fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
`;

const GuestRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 2fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f8fafc;
  }
`;

const GuestName = styled.div`
  color: #1a202c;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const GuestBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    switch (props.type) {
      case 'main': return '#4a6741';
      case 'guest': return '#7d9a74';
      case 'child': return '#9f7aea';
      case 'vegetarian': return '#48bb78';
      default: return '#e2e8f0';
    }
  }};
  color: white;
`;

const GuestPreferences = styled.div`
  color: #64748b;
  font-size: 0.875rem;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    white-space: normal;
    overflow: visible;
  }
`;

const TableHeaderCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;

  &:hover {
    color: #1a202c;
  }

  ${props => props.active && `
    color: #1a202c;
    font-weight: 600;
  `}
`;

const SortIcon = styled.span`
  font-size: 0.875rem;
  opacity: ${props => props.active ? 1 : 0.3};
  transition: all 0.2s ease;

  ${props => !props.active && `
    opacity: 0;
    ${TableHeaderCell}:hover & {
      opacity: 0.3;
    }
  `}
`;

const GuestList = () => {
  const [guests, setGuests] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [sortConfig, setSortConfig] = React.useState({
    key: 'name',
    direction: 'asc'
  });
  const [selectedGuest, setSelectedGuest] = React.useState(null);

  React.useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/attendees');
        const data = await response.json();
        
        // Transform the data to include all guests
        const allGuests = data.attendees.flatMap(attendee => {
          // Main guest
          const mainGuest = {
            id: `main-${attendee.id}`,
            name: `${attendee.firstName} ${attendee.lastName}`,
            isMain: true,
            isVegetarian: attendee.isVegetarian,
            preferences: attendee.preferences || '-',
            guestCount: (attendee.additionalGuests || []).length + 1
          };

          // Additional guests
          const additionalGuests = (attendee.additionalGuests || []).map((guest, index) => ({
            id: `guest-${attendee.id}-${index}`,
            name: `${guest.firstName} ${guest.lastName}`,
            isGuest: true,
            isChild: guest.isChild,
            isVegetarian: guest.isVegetarian,
            preferences: '-',
            broughtBy: `${attendee.firstName} ${attendee.lastName}`
          }));

          return [mainGuest, ...additionalGuests];
        });

        setGuests(allGuests);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching guests:', error);
        setLoading(false);
      }
    };

    fetchGuests();
  }, []);

  const sortData = (data, key, direction) => {
    return [...data].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      // Handle special cases
      switch (key) {
        case 'type':
          aValue = a.isMain ? 'main' : 'guest';
          bValue = b.isMain ? 'main' : 'guest';
          break;
        case 'dietary':
          aValue = a.isVegetarian ? 'vegetarian' : 'regular';
          bValue = b.isVegetarian ? 'vegetarian' : 'regular';
          break;
        case 'broughtBy':
          // Handle null/undefined values
          aValue = a.broughtBy || '';
          bValue = b.broughtBy || '';
          break;
        case 'preferences':
          // Handle null/undefined values
          aValue = a.preferences || '';
          bValue = b.preferences || '';
          break;
        case 'name':
          // Ensure case-insensitive sorting
          aValue = (a.name || '').toLowerCase();
          bValue = (b.name || '').toLowerCase();
          break;
      }

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => {
      const newDirection = 
        prevConfig.key === key && prevConfig.direction === 'asc' 
          ? 'desc' 
          : 'asc';
      
      return { key, direction: newDirection };
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const sortedGuests = React.useMemo(() => {
    return sortData(guests, sortConfig.key, sortConfig.direction);
  }, [guests, sortConfig]);

  const stats = {
    total: guests.length,
    vegetarian: guests.filter(g => g.isVegetarian).length,
    children: guests.filter(g => g.isChild).length,
    mainGuests: guests.filter(g => g.isMain).length
  };

  const handleGuestClick = (guest) => {
    setSelectedGuest(guest);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <StatsGrid>
        <StatCard>
          <StatLabel>Total Guests</StatLabel>
          <StatValue>{stats.total}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Main Guests</StatLabel>
          <StatValue>{stats.mainGuests}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Vegetarian Meals</StatLabel>
          <StatValue>{stats.vegetarian}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Children</StatLabel>
          <StatValue>{stats.children}</StatValue>
        </StatCard>
      </StatsGrid>

      <GuestTable>
        <TableHeader>
          <TableHeaderCell 
            active={sortConfig.key === 'name'}
            onClick={() => handleSort('name')}
          >
            Name
            <SortIcon active={sortConfig.key === 'name'}>
              {getSortIcon('name')}
            </SortIcon>
          </TableHeaderCell>
          
          <TableHeaderCell 
            active={sortConfig.key === 'type'}
            onClick={() => handleSort('type')}
          >
            Type
            <SortIcon active={sortConfig.key === 'type'}>
              {getSortIcon('type')}
            </SortIcon>
          </TableHeaderCell>
          
          <TableHeaderCell 
            active={sortConfig.key === 'dietary'}
            onClick={() => handleSort('dietary')}
          >
            Dietary
            <SortIcon active={sortConfig.key === 'dietary'}>
              {getSortIcon('dietary')}
            </SortIcon>
          </TableHeaderCell>
          
          <TableHeaderCell 
            active={sortConfig.key === 'broughtBy'}
            onClick={() => handleSort('broughtBy')}
          >
            Guest Of
            <SortIcon active={sortConfig.key === 'broughtBy'}>
              {getSortIcon('broughtBy')}
            </SortIcon>
          </TableHeaderCell>
          
          <TableHeaderCell 
            active={sortConfig.key === 'preferences'}
            onClick={() => handleSort('preferences')}
          >
            Preferences
            <SortIcon active={sortConfig.key === 'preferences'}>
              {getSortIcon('preferences')}
            </SortIcon>
          </TableHeaderCell>
        </TableHeader>

        {sortedGuests.map(guest => (
          <GuestRow 
            key={guest.id}
            onClick={() => handleGuestClick(guest)}
            style={{ cursor: 'pointer' }}
          >
            <GuestName>
              {guest.name}
              {guest.isChild && <GuestBadge type="child">Child</GuestBadge>}
            </GuestName>
            <div>
              <GuestBadge type={guest.isMain ? 'main' : 'guest'}>
                {guest.isMain ? 'Main' : 'Additional'}
              </GuestBadge>
            </div>
            <div>
              {guest.isVegetarian && (
                <GuestBadge type="vegetarian">Vegetarian</GuestBadge>
              )}
            </div>
            <div>
              {guest.broughtBy || '-'}
            </div>
            <GuestPreferences>
              {guest.preferences}
            </GuestPreferences>
          </GuestRow>
        ))}
      </GuestTable>

      {selectedGuest && (
        <GuestDetailsPopup 
          guest={selectedGuest}
          onClose={() => setSelectedGuest(null)}
        />
      )}
    </div>
  );
};

export default GuestList; 