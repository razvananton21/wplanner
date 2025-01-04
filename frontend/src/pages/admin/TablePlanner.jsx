import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import styled from 'styled-components';
import { PopupOverlay, PopupContent, PopupClose, DetailRow } from '../../components/shared/Popup';
import { motion } from 'framer-motion';
import GuestDetailsPopup from '../../components/shared/GuestDetailsPopup';

// First, define ActionButton
const ActionButton = styled.button`
  background: ${props => props.variant === 'outline' ? 'transparent' : '#4a6741'};
  color: ${props => props.variant === 'outline' ? '#4a6741' : 'white'};
  border: ${props => props.variant === 'outline' ? '1px solid #4a6741' : 'none'};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.variant === 'outline' ? 'none' : '0 2px 4px rgba(74, 103, 65, 0.2)'};

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.variant === 'outline' 
      ? '0 2px 4px rgba(74, 103, 65, 0.1)' 
      : '0 4px 8px rgba(74, 103, 65, 0.2)'};
    background: ${props => props.variant === 'outline' ? 'rgba(74, 103, 65, 0.05)' : '#3d5636'};
  }

  &:active {
    transform: translateY(0);
  }
`;

// Then define RemoveFromSeatButton
const RemoveFromSeatButton = styled(ActionButton)`
  margin-top: 1rem;
  background: #dc3545;
  width: 100%;
  justify-content: center;

  &:hover {
    background: #c82333;
  }
`;

// First, define RemoveTableButton
const RemoveTableButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s ease;
  padding: 0;
  margin-left: 4px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-1px);

  span {
    display: inline-block;
    line-height: 1;
    font-size: 1.4rem;
  }

  &:hover {
    background: rgba(220, 53, 69, 0.1);
    transform: translateY(-1px) scale(1.1);
  }

  &:active {
    transform: translateY(-1px) scale(0.95);
  }
`;

// Then define TableWrapper that uses RemoveTableButton
const TableWrapper = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: relative;
  transition: all 0.2s ease;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  &:hover ${RemoveTableButton} {
    opacity: 1;
    visibility: visible;
  }
`;

const TablePlannerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TableContainer = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

const TableGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  padding: 1.5rem;
  max-height: calc(100vh - 250px);
  overflow-y: auto;
  align-items: start;
`;

const Table = styled.div`
  background-color: ${props => props.isTableFull ? '#e0dcd2' : '#e8e3d7'};
  border: 2px solid #4a6741;
  border-radius: 50%;
  width: 180px;
  height: 180px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  font-family: ${props => props.theme.fonts.heading};
  color: #4a6741;
  font-size: 2rem;
  font-weight: 500;
`;

const TableSeats = styled.div`
  position: absolute;
  inset: 0;
  margin: 1rem;
`;

const Seat = styled.div`
  position: absolute;
  width: 65px;
  height: 65px;
  background-color: ${props => props.occupied ? '#4a6741' : 'rgba(74, 103, 65, 0.1)'};
  border: 2px solid ${props => props.occupied ? '#4a6741' : 'rgba(74, 103, 65, 0.3)'};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  cursor: ${props => props.occupied ? 'move' : 'default'};

  &:hover {
    background-color: ${props => props.occupied ? '#4a6741' : 'rgba(74, 103, 65, 0.2)'};
  }
`;

const SeatLabel = styled.div`
  color: ${props => props.occupied ? 'white' : '#4a6741'};
  font-size: 1rem;
  text-align: center;
  padding: 0.25rem;
  font-family: ${props => props.theme.fonts.heading};
  opacity: ${props => props.occupied ? 1 : 0.7};
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
`;

const TableTitle = styled.div`
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  color: #4a6741;
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  user-select: none;
`;

const Guest = styled.div`
  padding: 0.5rem;
  background-color: #fff;
  border-radius: 4px;
  margin: 0.2rem;
  text-align: center;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AttendeeList = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 1rem;
  background-color: #f0f0f0;
  border-radius: 8px;
`;

const SaveButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: ${props => props.theme.fonts.body};
  margin-bottom: 1rem;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SeatCount = styled.div`
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.9rem;
  color: ${props => props.error ? 'red' : 'inherit'};
`;

const UnseatedGuestName = styled.span`
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const GuestCount = styled.span`
  font-size: 0.7rem;
  color: #666;
  margin-left: 4px;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  min-height: calc(100% - 73px);
`;

const UnseatedList = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  height: fit-content;
  position: sticky;
  top: calc(73px + 2rem); // Header height + padding

  h3 {
    margin: 0;
    padding: 1.25rem;
    font-size: 1rem;
    font-weight: 600;
    color: #2d3748;
    border-bottom: 1px solid #f0f0f0;
  }
`;

const UnseatedGuest = styled.div`
  padding: 1rem 1.25rem;
  background: white;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
  cursor: move;

  &:hover {
    background: #f9fafb;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const UnseatedGuestTitle = styled.div`
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 0.25rem;
`;

const GuestIndicators = styled.div`
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #718096;
`;

const GuestIndicator = styled.span`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const SeatIndicator = styled.span`
  position: absolute;
  font-size: 0.9rem;
  background: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
`;

const GuestTypeIndicator = styled(SeatIndicator)`
  top: -5px;
  right: -5px;
  background: none;
  color: #4a6741;
  box-shadow: none;
  border: none;
  font-size: 1.2rem;
  transform: scale(1.2);
`;

const VegetarianIndicator = styled(SeatIndicator)`
  top: -5px;
  left: -5px;
  background: none;
  color: #4a6741;
  box-shadow: none;
  border: none;
  font-size: 1.2rem;
`;

const PreferencesIndicator = styled(SeatIndicator)`
  bottom: -5px;
  right: -5px;
  background: none;
  color: #4a6741;
  box-shadow: none;
  border: none;
  font-size: 1.2rem;
`;

const GuestSeat = styled(Seat)`
  width: 60px;
  height: 60px;
  background-color: ${props => {
    if (props.isDragOver) return 'rgba(74, 103, 65, 0.1)';
    if (!props.occupied) return 'white';
    return props.isAdditionalGuest ? '#7d9a74' : '#4a6741';
  }};
  border: 2px solid ${props => {
    if (props.isDragOver) return '#4a6741';
    if (!props.occupied) return '#e2e8f0';
    return props.isAdditionalGuest ? '#7d9a74' : '#4a6741';
  }};
  box-shadow: ${props => props.occupied ? '0 2px 4px rgba(0, 0, 0, 0.05)' : 'none'};
  transition: all 0.2s ease;
  transform: ${props => props.isDragOver ? 'scale(1.1)' : 'scale(1)'};

  &:hover {
    transform: ${props => props.occupied ? 'scale(1.05)' : 'scale(1)'};
    box-shadow: ${props => props.occupied ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none'};
  }

  ${props => props.isDragOver && `
    > * {
      opacity: 0 !important;
      visibility: hidden;
    }
  `}
`;

const GuestSeatLabel = styled(SeatLabel)`
  font-size: ${props => props.isAdditionalGuest ? '0.75rem' : '0.8rem'};
  font-weight: 500;
  color: white;
  opacity: ${props => props.isAdditionalGuest ? 0.9 : 1};
  padding: 0.5rem;
  line-height: 1.2;
`;

// Add a helper function to calculate seat positions
const calculateSeatPosition = (index, totalSeats) => {
  const radius = 160; // Increased radius
  const angleOffset = -90;
  const angle = (index * (360 / totalSeats) + angleOffset) * (Math.PI / 180);
  
  return {
    left: `calc(50% + ${Math.cos(angle) * radius}px)`,
    top: `calc(50% + ${Math.sin(angle) * radius}px)`,
    transform: 'translate(-50%, -50%)'
  };
};

const TableNumber = ({ table, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [number, setNumber] = useState(table.name.replace('Table ', ''));
  
  const handleBlur = () => {
    setEditing(false);
    onUpdate(table.id, `Table ${number}`);
  };

  return editing ? (
    <TableNumberInput
      type="text"
      value={number}
      onChange={(e) => setNumber(e.target.value)}
      onBlur={handleBlur}
      autoFocus
    />
  ) : (
    <div onClick={() => setEditing(true)}>{number}</div>
  );
};

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TableControls = styled.div`
  display: flex;
  gap: 1rem;
`;

const ViewToggle = styled.div`
  display: flex;
  background: #f7fafc;
  padding: 0.25rem;
  border-radius: 10px;
  gap: 0.25rem;
`;

const ViewButton = styled.button`
  background: ${props => props.active ? '#4a6741' : 'transparent'};
  color: ${props => props.active ? 'white' : '#4a6741'};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${props => props.active ? '#4a6741' : 'rgba(74, 103, 65, 0.05)'};
  }
`;

const TablesSection = styled.div`
  flex: 1;
  overflow: auto;
  padding: 1rem;
  display: ${props => props.view === 'table' ? 'block' : 'flex'};
  flex-direction: column;
  gap: 1rem;
`;

const TableListView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TableListItem = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const TableListHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #2d3748;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const TableStats = styled.div`
  display: flex;
  gap: 2rem;
  padding: 1rem;
  background: #f9fafb;
  border-bottom: 1px solid #f0f0f0;

  > div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #4a5568;

    strong {
      color: #2d3748;
    }
  }
`;

const TableListContent = styled.div`
  padding: 1rem;
`;

const SeatsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SeatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: ${props => props.isDragOver ? 'rgba(74, 103, 65, 0.1)' : props.occupied ? 'white' : '#f9fafb'};
  border: 1px solid ${props => props.isDragOver ? '#4a6741' : '#e2e8f0'};
  border-radius: 8px;
  transition: all 0.2s ease;
`;

const SeatNumber = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.occupied ? '#4a6741' : '#e2e8f0'};
  color: ${props => props.occupied ? 'white' : '#4a5568'};
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ListViewRemoveButton = styled(RemoveTableButton)`
  opacity: 1;
  visibility: visible;
`;

const DraggableGuestItem = styled.div`
  opacity: ${props => props.isDragging ? 0.5 : 1};
  transform: scale(${props => props.isDragging ? 0.95 : 1});
  transition: all 0.2s ease;
`;

const TableRemoveButton = styled(RemoveTableButton)`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const TableNumberInput = styled.input`
  width: 40px;
  text-align: center;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 0.25rem;
  font-size: inherit;
  font-family: inherit;
  color: inherit;
  background: transparent;

  &:focus {
    outline: none;
    border-color: #4a6741;
  }
`;

const TablePlanner = () => {
  const [tables, setTables] = useState([
    { 
      id: 'table-1', 
      name: 'Table 1',
      seats: new Array(10).fill(null)
    }
  ]);

  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [view, setView] = useState('table'); // 'table' or 'list'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const attendeesResponse = await fetch('http://localhost:8000/api/attendees');
        const configResponse = await fetch('http://localhost:8000/api/table-configuration');
        
        if (!attendeesResponse.ok || !configResponse.ok) throw new Error('Failed to fetch data');
        
        const attendeesData = await attendeesResponse.json();
        const configData = await configResponse.json();

        // Transform attendees
        const transformedAttendees = (attendeesData.attendees || []).flatMap(attendee => {
          const mainGuest = {
            id: `guest-${attendee.id}`,
            name: `${attendee.firstName} ${attendee.lastName}`,
            isVegetarian: attendee.isVegetarian,
            preferences: attendee.preferences
          };

          const additionalGuests = (attendee.additionalGuests || []).map((guest, index) => ({
            id: `guest-${attendee.id}-guest-${index + 1}`,
            name: `${guest.firstName} ${guest.lastName}`,
            isGuest: true,
            isVegetarian: guest.isVegetarian,
            isChild: guest.isChild,
            preferences: '',
            broughtBy: `${attendee.firstName} ${attendee.lastName}`
          }));

          return [mainGuest, ...additionalGuests];
        });

        // Set initial state
        if (configData.configuration && configData.configuration.length > 0) {
          // Use saved configuration
          const normalizedTables = configData.configuration.map(table => ({
            ...table,
            seats: Array(10).fill(null).map((_, i) => table.seats[i] || null)
          }));
          setTables(normalizedTables);
          
          // Filter out seated attendees
          const seatedIds = new Set(
            normalizedTables.flatMap(table => 
              table.seats.filter(Boolean).map(guest => guest.id)
            )
          );
          setAttendees(transformedAttendees.filter(a => !seatedIds.has(a.id)));
        } else {
          // Start with one empty table
          setTables([
            { id: 'table-1', name: 'Table 1', seats: Array(10).fill(null) }
          ]);
          setAttendees(transformedAttendees);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const expandGuests = (attendee) => {
    const guests = [];
    guests.push({ ...attendee, isMainGuest: true });
    
    // Add additional guests if there are any
    if (attendee.additionalGuests) {
        attendee.additionalGuests.forEach((guest, index) => {
            guests.push({
                id: `${attendee.id}-guest-${index + 1}`,
                name: `${guest.firstName} ${guest.lastName}`,
                isGuest: true,
                mainGuestId: attendee.id,
                isVegetarian: guest.isVegetarian,
                isChild: guest.isChild
            });
        });
    }
    
    return guests;
  };

  const getTableSeatCount = (table) => {
    return table.guests.length;
  };

  const canAddToTable = (table, guestCount = 1) => {
    const currentSeats = getTableSeatCount(table);
    return (currentSeats + guestCount) <= 10;
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === 'attendees') {
      // Moving from attendee list to a seat
      const guest = { ...attendees[source.index] }; // Create a deep copy
      const [tableId, seatId] = destination.droppableId.split('-seat-');
      
      setTables(prev => {
        const newTables = prev.map(table => {
          if (table.id === tableId) {
            const newSeats = [...table.seats];
            const currentOccupant = newSeats[parseInt(seatId)];
            
            if (currentOccupant) {
              const nextAvailableSeat = newSeats.findIndex(seat => seat === null);
              if (nextAvailableSeat !== -1) {
                // Preserve the original guest object structure
                newSeats[nextAvailableSeat] = { ...currentOccupant };
              } else {
                // Preserve the original guest object structure when moving to unseated
                setAttendees(prev => [...prev, { ...currentOccupant }]);
              }
            }

            // Preserve the guest ID and structure when placing in seat
            newSeats[parseInt(seatId)] = {
              ...guest,
              id: guest.id // Ensure ID is preserved
            };
            return { ...table, seats: newSeats };
          }
          return table;
        });
        return newTables;
      });
      
      setAttendees(prev => prev.filter((_, i) => i !== source.index));
    } else {
      // Moving between seats
      const [sourceTableId, sourceSeatId] = source.droppableId.split('-seat-');
      const [destTableId, destSeatId] = destination.droppableId.split('-seat-');
      
      setTables(prev => {
        const sourceTable = prev.find(t => t.id === sourceTableId);
        const movingGuest = { ...sourceTable.seats[parseInt(sourceSeatId)] };

        return prev.map(table => {
          if (table.id === sourceTableId) {
            const newSeats = [...table.seats];
            newSeats[parseInt(sourceSeatId)] = null;
            
            if (table.id === destTableId) {
              const currentOccupant = newSeats[parseInt(destSeatId)];
              
              if (currentOccupant) {
                const nextAvailableSeat = newSeats.findIndex(seat => seat === null);
                if (nextAvailableSeat !== -1) {
                  newSeats[nextAvailableSeat] = { ...currentOccupant };
                } else {
                  setAttendees(prev => [...prev, { ...currentOccupant }]);
                }
              }
              
              newSeats[parseInt(destSeatId)] = { ...movingGuest };
            }
            return { ...table, seats: newSeats };
          }
          if (table.id === destTableId && sourceTableId !== destTableId) {
            const newSeats = [...table.seats];
            const currentOccupant = newSeats[parseInt(destSeatId)];
            
            if (currentOccupant) {
              const nextAvailableSeat = newSeats.findIndex(seat => seat === null);
              if (nextAvailableSeat !== -1) {
                newSeats[nextAvailableSeat] = { ...currentOccupant };
              } else {
                setAttendees(prev => [...prev, { ...currentOccupant }]);
              }
            }
            
            newSeats[parseInt(destSeatId)] = { ...movingGuest };
            return { ...table, seats: newSeats };
          }
          return table;
        });
      });
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/table-configuration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tables)
      });

      if (!response.ok) throw new Error('Failed to save configuration');
      
      alert('Table configuration saved successfully!');
    } catch (error) {
      alert('Failed to save configuration: ' + error.message);
    }
  };

  const handleGuestClick = (guest) => {
    setSelectedGuest(guest);
  };

  const handleAddTable = () => {
    const newTableId = `table-${tables.length + 1}`;
    const newTable = {
      id: newTableId,
      name: `Table ${tables.length + 1}`,
      seats: new Array(10).fill(null)
    };
    setTables([...tables, newTable]);
  };

  const handleRemoveTable = (tableId) => {
    const tableToRemove = tables.find(t => t.id === tableId);
    if (!tableToRemove) return;

    // Move seated guests back to unseated list
    const seatedGuests = tableToRemove.seats.filter(Boolean);
    if (seatedGuests.length > 0) {
      setAttendees(prev => [...prev, ...seatedGuests]);
    }

    // Remove the table
    setTables(prev => {
      const newTables = prev.filter(t => t.id !== tableId);
      // Renumber remaining tables
      return newTables.map((table, index) => ({
        ...table,
        id: `table-${index + 1}`,
        name: `Table ${index + 1}`
      }));
    });
  };

  const findGuestTable = (guest) => {
    for (const table of tables) {
      const seatIndex = table.seats.findIndex(seat => seat?.id === guest.id);
      if (seatIndex !== -1) {
        return { table, seatIndex };
      }
    }
    return null;
  };

  const handleRemoveFromSeat = (guest) => {
    const seatedAt = findGuestTable(guest);
    if (!seatedAt) return;

    setTables(prev => prev.map(table => {
      if (table.id === seatedAt.table.id) {
        const newSeats = [...table.seats];
        newSeats[seatedAt.seatIndex] = null;
        return { ...table, seats: newSeats };
      }
      return table;
    }));

    setAttendees(prev => [...prev, guest]);
    setSelectedGuest(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <TablePlannerContainer>
      <PageHeader>
        <HeaderControls>
          <TableControls>
            <ActionButton onClick={handleSave}>
              💾 Save Configuration
            </ActionButton>
            <ActionButton onClick={handleAddTable}>
              ➕ Add Table
            </ActionButton>
          </TableControls>
        </HeaderControls>
        <ViewToggle>
          <ViewButton 
            active={view === 'table'} 
            onClick={() => setView('table')}
          >
            <span>⊞</span> Table View
          </ViewButton>
          <ViewButton 
            active={view === 'list'} 
            onClick={() => setView('list')}
          >
            <span>≣</span> List View
          </ViewButton>
        </ViewToggle>
      </PageHeader>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Layout>
          <Droppable droppableId="attendees">
            {(provided) => (
              <UnseatedList ref={provided.innerRef} {...provided.droppableProps}>
                <h3>Unseated Guests</h3>
                {attendees.map((attendee, index) => (
                  <Draggable key={attendee.id} draggableId={attendee.id} index={index}>
                    {(provided, snapshot) => (
                      <DraggableGuestItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        isDragging={snapshot.isDragging}
                      >
                        <UnseatedGuest
                          onClick={() => handleGuestClick(attendee)}
                        >
                          <div>
                            <UnseatedGuestName>{attendee.name}</UnseatedGuestName>
                            <GuestIndicators>
                              {attendee.guests > 1 && (
                                <GuestIndicator title={`+${attendee.guests - 1} guests`}>
                                  👥
                                </GuestIndicator>
                              )}
                              {attendee.isVegetarian && (
                                <GuestIndicator title="Vegetarian">🥗</GuestIndicator>
                              )}
                              {attendee.preferences && (
                                <GuestIndicator title="Has preferences">📝</GuestIndicator>
                              )}
                            </GuestIndicators>
                          </div>
                        </UnseatedGuest>
                      </DraggableGuestItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </UnseatedList>
            )}
          </Droppable>

          <TablesSection view={view}>
            {view === 'table' ? (
              <TableGrid>
                {tables.map((table) => {
                  const isTableFull = table.seats.every(seat => seat !== null);
                  
                  return (
                    <TableWrapper 
                      key={table.id} 
                      isTableFull={isTableFull}
                    >
                      <TableTitle>
                        {table.name}
                      </TableTitle>
                      <TableRemoveButton
                        onClick={() => handleRemoveTable(table.id)}
                        title="Remove table"
                      >
                        <span>×</span>
                      </TableRemoveButton>
                      <Table isTableFull={isTableFull}>
                        <TableNumber 
                          table={table} 
                          onUpdate={(id, newName) => {
                            setTables(tables.map(t => 
                              t.id === id ? { ...t, name: newName } : t
                            ));
                          }} 
                        />
                      </Table>
                      <TableSeats>
                        {Array.from({ length: 10 }).map((_, seatIndex) => (
                          <Droppable
                            key={`${table.id}-seat-${seatIndex}`}
                            droppableId={`${table.id}-seat-${seatIndex}`}
                          >
                            {(provided, snapshot) => {
                              const guest = table.seats[seatIndex];
                              const position = calculateSeatPosition(seatIndex, 10);
                              
                              return (
                                <div 
                                  style={{
                                    ...position,
                                    position: 'absolute',
                                    width: '65px',
                                    height: '65px',
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: snapshot.isDraggingOver ? 2 : 1
                                  }}
                                >
                                  <GuestSeat
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    occupied={!!guest}
                                    isAdditionalGuest={guest?.isGuest}
                                    isDragOver={snapshot.isDraggingOver}
                                  >
                                    {guest ? (
                                      <Draggable draggableId={guest.id} index={0}>
                                        {(provided, snapshot) => (
                                          <>
                                            <GuestSeatLabel
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                              occupied
                                              isAdditionalGuest={guest.isGuest}
                                              onClick={() => handleGuestClick(guest)}
                                              style={{
                                                ...provided.draggableProps.style,
                                                opacity: snapshot.isDragging ? 0.5 : 1
                                              }}
                                            >
                                              {guest.name}
                                            </GuestSeatLabel>
                                            {guest.isGuest && (
                                              <GuestTypeIndicator title="Additional Guest">👥</GuestTypeIndicator>
                                            )}
                                            {guest.isVegetarian && (
                                              <VegetarianIndicator title="Vegetarian">🥗</VegetarianIndicator>
                                            )}
                                            {guest.preferences && (
                                              <PreferencesIndicator title="Has preferences">📝</PreferencesIndicator>
                                            )}
                                          </>
                                        )}
                                      </Draggable>
                                    ) : (
                                      <SeatLabel>Seat {seatIndex + 1}</SeatLabel>
                                    )}
                                    {provided.placeholder}
                                  </GuestSeat>
                                </div>
                              );
                            }}
                          </Droppable>
                        ))}
                      </TableSeats>
                    </TableWrapper>
                  );
                })}
              </TableGrid>
            ) : (
              <TableListView>
                {tables.map((table) => {
                  const occupiedSeats = table.seats.filter(Boolean).length;
                  const isTableFull = occupiedSeats === 10;
                  
                  return (
                    <TableListItem key={table.id}>
                      <TableListHeader>
                        <h3>
                          {table.name}
                          {isTableFull && <span title="Table Full">🔒</span>}
                        </h3>
                        <ListViewRemoveButton
                          onClick={() => handleRemoveTable(table.id)}
                          title="Remove table"
                        >
                          <span>×</span>
                        </ListViewRemoveButton>
                      </TableListHeader>

                      <TableStats>
                        <div>
                          <span>Seats:</span>
                          <strong>{occupiedSeats}/10</strong>
                        </div>
                        <div>
                          <span>Vegetarian:</span>
                          <strong>
                            {table.seats.filter(guest => guest?.isVegetarian).length}
                          </strong>
                        </div>
                        <div>
                          <span>Children:</span>
                          <strong>
                            {table.seats.filter(guest => guest?.isChild).length}
                          </strong>
                        </div>
                      </TableStats>

                      <TableListContent>
                        <SeatsList>
                          {table.seats.map((guest, seatIndex) => (
                            <Droppable
                              key={`${table.id}-seat-${seatIndex}`}
                              droppableId={`${table.id}-seat-${seatIndex}`}
                            >
                              {(provided, snapshot) => (
                                <SeatItem
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  isDragOver={snapshot.isDraggingOver}
                                  occupied={!!guest}
                                  isAdditionalGuest={guest?.isGuest}
                                >
                                  <SeatNumber occupied={!!guest}>
                                    {seatIndex + 1}
                                  </SeatNumber>
                                  
                                  {guest ? (
                                    <Draggable draggableId={guest.id} index={0}>
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          style={{
                                            ...provided.draggableProps.style,
                                            opacity: snapshot.isDragging ? 0.5 : 1,
                                            flex: 1,
                                            cursor: 'pointer'
                                          }}
                                          onClick={() => handleGuestClick(guest)}
                                        >
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ flex: 1 }}>{guest.name}</span>
                                            <div style={{ display: 'flex', gap: '0.3rem' }}>
                                              {guest.isGuest && <span title="Additional Guest">👥</span>}
                                              {guest.isVegetarian && <span title="Vegetarian">🥗</span>}
                                              {guest.preferences && <span title="Has preferences">📝</span>}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </Draggable>
                                  ) : (
                                    <div style={{ color: '#666' }}>Empty Seat</div>
                                  )}
                                  {provided.placeholder}
                                </SeatItem>
                              )}
                            </Droppable>
                          ))}
                        </SeatsList>
                      </TableListContent>
                    </TableListItem>
                  );
                })}
              </TableListView>
            )}
          </TablesSection>
        </Layout>
      </DragDropContext>
      
      {selectedGuest && (
        <GuestDetailsPopup 
          guest={selectedGuest}
          onClose={() => setSelectedGuest(null)}
          onRemove={() => handleRemoveFromSeat(selectedGuest)}
          showRemoveButton={!!findGuestTable(selectedGuest)}
        />
      )}
    </TablePlannerContainer>
  );
};

export default TablePlanner; 