import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  position: relative;
  margin: auto;
  padding-bottom: 4rem;
  scroll-behavior: smooth;
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 8px;
    background: #4a6741;
  }
`;

const Title = styled.h1`
  font-family: 'Playfair Display', serif;
  color: #4a6741;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  font-style: italic;
`;

const FormGroup = styled.div`
  margin-bottom: 2rem;
`;

const Label = styled.label`
  display: block;
  color: #4a6741;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4a6741;
    box-shadow: 0 0 0 3px rgba(74, 103, 65, 0.1);
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(74, 103, 65, 0.05);
  }

  input {
    accent-color: #4a6741;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #4a6741;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #3d5636;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const GuestSection = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const GuestList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const GuestItem = styled.div`
  padding: 1rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
`;

const GuestControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const AddGuestButton = styled.button`
  background: none;
  border: 1px dashed #4a6741;
  color: #4a6741;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(74, 103, 65, 0.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const RemoveGuestButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  padding: 0.25rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  
  &:hover {
    background: rgba(220, 53, 69, 0.1);
  }
`;

const RsvpForm = ({ initialData = {} }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    attending: 'yes',
    diet: initialData.isVegetarian ? 'vegetarian' : 'regular',
    additionalGuests: [],
    preferences: '',
    invitationId: null,
    ...initialData
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          invitationId: formData.invitationId,
          isVegetarian: formData.diet === 'vegetarian',
          preferences: formData.preferences,
          additionalGuests: formData.additionalGuests,
          attending: formData.attending
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit RSVP');
      }

      alert('Mulțumim pentru răspuns!');
      onClose();
    } catch (error) {
        if(error?.length < 1) { 
            return;
        }
      console.error('Error submitting RSVP:', error);
      alert('A apărut o eroare. Vă rugăm să încercați din nou.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddGuest = () => {
    if (formData.additionalGuests.length < 4) {
      setFormData(prev => ({
        ...prev,
        additionalGuests: [
          ...prev.additionalGuests,
          { firstName: '', lastName: '', isChild: false, isVegetarian: false }
        ]
      }));
    }
  };

  return (
    <FormContainer>
      <Title>RSVP</Title>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormGroup>
            <Label>Prenume</Label>
            <Input 
              type="text" 
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required 
              placeholder="Prenume"
            />
          </FormGroup>

          <FormGroup>
            <Label>Nume</Label>
            <Input 
              type="text" 
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required 
              placeholder="Nume"
            />
          </FormGroup>
        </div>

        <FormGroup>
          <Label>Vei participa la eveniment?</Label>
          <RadioGroup>
            <RadioLabel>
              <input 
                type="radio" 
                name="attending" 
                value="yes"
                checked={formData.attending === 'yes'}
                onChange={handleChange}
                required 
              />
              <span>Da, voi participa</span>
            </RadioLabel>
            <RadioLabel>
              <input 
                type="radio" 
                name="attending" 
                value="no"
                checked={formData.attending === 'no'}
                onChange={handleChange}
              />
              <span>Nu pot participa</span>
            </RadioLabel>
          </RadioGroup>
        </FormGroup>

        {formData.attending === 'yes' && (
          <>
            <FormGroup>
              <Label>Preferințe alimentare</Label>
              <RadioGroup>
                <RadioLabel>
                  <input 
                    type="radio" 
                    name="diet" 
                    value="regular"
                    checked={formData.diet === 'regular'}
                    onChange={handleChange}
                    required 
                  />
                  <span>Meniu normal</span>
                </RadioLabel>
                <RadioLabel>
                  <input 
                    type="radio" 
                    name="diet" 
                    value="vegetarian"
                    checked={formData.diet === 'vegetarian'}
                    onChange={handleChange}
                  />
                  <span>Meniu vegetarian</span>
                </RadioLabel>
              </RadioGroup>
            </FormGroup>

            <GuestSection>
              <GuestControls>
                <Label style={{ margin: 0 }}>Însoțitori</Label>
                <AddGuestButton 
                  type="button" 
                  onClick={handleAddGuest}
                  disabled={formData.additionalGuests.length >= 4}
                >
                  + Adaugă însoțitor
                </AddGuestButton>
              </GuestControls>
              <GuestList>
                {formData.additionalGuests.map((guest, index) => (
                  <GuestItem key={index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <strong>Însoțitor {index + 1}</strong>
                      <RemoveGuestButton 
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            additionalGuests: prev.additionalGuests.filter((_, i) => i !== index)
                          }));
                        }}
                      >
                        ✕ Șterge
                      </RemoveGuestButton>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <FormGroup style={{ margin: 0 }}>
                        <Label>Prenume</Label>
                        <Input
                          type="text"
                          value={guest.firstName}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              additionalGuests: prev.additionalGuests.map((g, i) => 
                                i === index ? { ...g, firstName: e.target.value } : g
                              )
                            }));
                          }}
                          placeholder="Prenume"
                          required
                        />
                      </FormGroup>

                      <FormGroup style={{ margin: 0 }}>
                        <Label>Nume</Label>
                        <Input
                          type="text"
                          value={guest.lastName}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              additionalGuests: prev.additionalGuests.map((g, i) => 
                                i === index ? { ...g, lastName: e.target.value } : g
                              )
                            }));
                          }}
                          placeholder="Nume"
                          required
                        />
                      </FormGroup>
                    </div>

                    <RadioGroup>
                      <RadioLabel>
                        <input
                          type="checkbox"
                          checked={guest.isChild}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              additionalGuests: prev.additionalGuests.map((g, i) => 
                                i === index ? { ...g, isChild: e.target.checked } : g
                              )
                            }));
                          }}
                        />
                        <span>Copil</span>
                      </RadioLabel>
                      <RadioLabel>
                        <input
                          type="checkbox"
                          checked={guest.isVegetarian}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              additionalGuests: prev.additionalGuests.map((g, i) => 
                                i === index ? { ...g, isVegetarian: e.target.checked } : g
                              )
                            }));
                          }}
                        />
                        <span>Meniu vegetarian</span>
                      </RadioLabel>
                    </RadioGroup>
                  </GuestItem>
                ))}
              </GuestList>
            </GuestSection>
          </>
        )}

        <FormGroup>
          <Label>Alte mențiuni</Label>
          <Input 
            as="textarea" 
            name="preferences"
            value={formData.preferences}
            onChange={handleChange}
            rows="3"
            placeholder="Alte preferințe sau mențiuni speciale"
          />
        </FormGroup>

        <SubmitButton type="submit">
          Trimite RSVP
        </SubmitButton>
      </form>
    </FormContainer>
  );
};

export default RsvpForm; 