import React from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import GuestList from './GuestList';
import TablePlanner from './TablePlanner';
import SendInvitation from './SendInvitation';

const Container = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
`;

const MenuButton = styled(Link)`
  background: ${props => props.active ? '#4a6741' : 'white'};
  color: ${props => props.active ? 'white' : '#4a6741'};
  padding: 0.75rem 1.5rem;
  border: 1px solid #4a6741;
  border-radius: 8px;
  text-decoration: none;
  margin-right: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? '#3d5636' : 'rgba(74, 103, 65, 0.05)'};
  }
`;

const Dashboard = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    if (path === '/admin/guests') {
      return location.pathname === '/admin' || location.pathname === '/admin/guests';
    }
    return location.pathname === path;
  };

  return (
    <Container>
      <Title>Admin Dashboard</Title>
      <div style={{ marginBottom: '2rem' }}>
        <MenuButton 
          to="/admin/guests" 
          active={isActive('/admin/guests') ? 1 : 0}
        >
          Guest List
        </MenuButton>
        <MenuButton 
          to="/admin/planner" 
          active={isActive('/admin/planner') ? 1 : 0}
        >
          Table Planner
        </MenuButton>
        <MenuButton 
          to="/admin/invitations" 
          active={isActive('/admin/invitations') ? 1 : 0}
        >
          Invitations
        </MenuButton>
      </div>

      <Routes>
        <Route path="/guests" element={<GuestList />} />
        <Route path="/planner" element={<TablePlanner />} />
        <Route path="/invitations" element={<SendInvitation />} />
      </Routes>
    </Container>
  );
};

export default Dashboard; 