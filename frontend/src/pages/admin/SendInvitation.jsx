import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  color: #4a6741;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4a6741;
    box-shadow: 0 0 0 3px rgba(74, 103, 65, 0.1);
  }
`;

const Button = styled.button`
  background: #4a6741;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #3d5636;
  }
`;

const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  border-bottom: 2px solid #e2e8f0;
  color: #4a6741;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
`;

const ActionButton = styled(Button)`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  margin-right: 0.5rem;
`;

const SendInvitation = () => {
  const [invitations, setInvitations] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/admin/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create invitation');

      fetchInvitations();
      setFormData({ name: '', email: '', phoneNumber: '' });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const sendInvitation = async (id, method) => {
    try {
        const response = await fetch(`http://localhost:8000/api/admin/invitations/${id}/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ method })
        });

        const data = await response.json();
        console.log('Send invitation response:', data);

        if (!response.ok) {
            throw new Error(data.message || 'Failed to send invitation');
        }

        if (data.whatsappLink) {
            window.open(data.whatsappLink, '_blank');
        }

        alert('Invitație trimisă cu succes!');
        fetchInvitations();
    } catch (error) {
        console.error('Error sending invitation:', error);
        alert(`Eroare la trimiterea invitației: ${error.message}`);
    }
  };

  const fetchInvitations = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/admin/invitations');
        const data = await response.json();
        console.log('Fetched invitations:', data);

        if (!response.ok) {
            throw new Error('Failed to fetch invitations');
        }

        setInvitations(data.invitations || []);
    } catch (error) {
        console.error('Error fetching invitations:', error);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleCreateAndSend = async (e) => {
    e.preventDefault();
    try {
      // First create the invitation
      const createResponse = await fetch('http://localhost:8000/api/admin/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create invitation');
      }

      const { id } = await createResponse.json();

      // Then send it
      const method = formData.email ? 'email' : 'whatsapp';
      const sendResponse = await fetch(`http://localhost:8000/api/admin/invitations/${id}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method })
      });

      const sendResult = await sendResponse.json();

      if (!sendResponse.ok) {
        throw new Error(sendResult.message || 'Failed to send invitation');
      }

      if (sendResult.whatsappLink) {
        window.open(sendResult.whatsappLink, '_blank');
      }

      alert('Invitație creată și trimisă cu succes!');
      setFormData({ name: '', email: '', phoneNumber: '' });
      fetchInvitations();
    } catch (error) {
      console.error('Error:', error);
      alert(`Eroare: ${error.message}`);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', color: '#4a6741' }}>Send Invitations</h2>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Name</Label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Email</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
        </FormGroup>
        <FormGroup>
          <Label>Phone Number</Label>
          <Input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
          />
        </FormGroup>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button type="submit">Create Invitation</Button>
          <Button 
            type="button" 
            onClick={handleCreateAndSend}
            style={{ background: '#2c3e50' }}
          >
            Create & Send
          </Button>
        </div>
      </Form>

      <h3 style={{ marginBottom: '1rem', color: '#4a6741' }}>Sent Invitations</h3>
      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Contact</Th>
            <Th>Status</Th>
            <Th>Created</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {invitations.map(invitation => (
            <tr key={invitation.id}>
              <Td>{invitation.name}</Td>
              <Td>
                {invitation.email && <div>{invitation.email}</div>}
                {invitation.phoneNumber && <div>{invitation.phoneNumber}</div>}
              </Td>
              <Td>{invitation.status}</Td>
              <Td>{new Date(invitation.createdAt).toLocaleDateString()}</Td>
              <Td>
                {invitation.email && (
                  <ActionButton onClick={() => sendInvitation(invitation.id, 'email')}>
                    Send Email
                  </ActionButton>
                )}
                {invitation.phoneNumber && (
                  <ActionButton onClick={() => sendInvitation(invitation.id, 'whatsapp')}>
                    Send WhatsApp
                  </ActionButton>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SendInvitation; 