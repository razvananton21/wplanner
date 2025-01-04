import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-family: ${props => props.theme.fonts.body};
  color: ${props => props.theme.colors.primary};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 4px;
  font-family: ${props => props.theme.fonts.body};
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 4px;
  font-family: ${props => props.theme.fonts.body};
  min-height: 100px;
  resize: vertical;
`;

const Button = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  font-family: ${props => props.theme.fonts.body};
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff0033;
  margin: 1rem 0;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: #ffe6e6;
`;

const SuccessMessage = styled.div`
  color: #007700;
  margin: 1rem 0;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: #e6ffe6;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const Checkbox = styled.input`
  cursor: pointer;
`;

const AttendeeForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    numberOfGuests: 1,
    isVegetarian: false,
    preferences: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:8000/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit RSVP');
      }

      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        numberOfGuests: 1,
        isVegetarian: false,
        preferences: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <FormContainer>
        <SuccessMessage>
          Thank you for your RSVP! We look forward to celebrating with you.
        </SuccessMessage>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <FormGroup>
          <Label>First Name</Label>
          <Input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Last Name</Label>
          <Input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Number of Guests</Label>
          <Input
            type="number"
            min="1"
            value={formData.numberOfGuests}
            onChange={(e) => setFormData({ ...formData, numberOfGuests: parseInt(e.target.value) })}
            required
          />
        </FormGroup>
        <FormGroup>
          <CheckboxLabel>
            <Checkbox
              type="checkbox"
              checked={formData.isVegetarian}
              onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
            />
            Vegetarian Option
          </CheckboxLabel>
        </FormGroup>
        <FormGroup>
          <Label>Special Preferences</Label>
          <TextArea
            value={formData.preferences}
            onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
            placeholder="Any dietary restrictions or special requirements?"
          />
        </FormGroup>
        <Button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Confirm Attendance'}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default AttendeeForm; 