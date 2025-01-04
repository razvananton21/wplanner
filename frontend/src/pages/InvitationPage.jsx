import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Rsvp from './Rsvp';

const InvitationPage = () => {
  const { uuid } = useParams();
  const [invitation, setInvitation] = useState(null);
  const [existingRsvp, setExistingRsvp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch invitation details
        const inviteResponse = await fetch(`http://localhost:8000/api/invitations/${uuid}`);
        if (!inviteResponse.ok) throw new Error('Invitation not found');
        const inviteData = await inviteResponse.json();
        setInvitation(inviteData);

        // Try to fetch existing RSVP
        const rsvpResponse = await fetch(`http://localhost:8000/api/rsvp/${uuid}`);
        if (rsvpResponse.ok) {
          const rsvpData = await rsvpResponse.json();
          setExistingRsvp(rsvpData);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (uuid) {
      fetchData();
    }
  }, [uuid]);

  return (
    <Rsvp 
      initialData={{
        firstName: existingRsvp?.firstName || invitation?.name.split(' ')[0] || '',
        lastName: existingRsvp?.lastName || invitation?.name.split(' ')[1] || '',
        email: invitation?.email || '',
        phoneNumber: invitation?.phoneNumber || '',
        invitationId: uuid,
        isVegetarian: existingRsvp?.isVegetarian || false,
        preferences: existingRsvp?.preferences || '',
        additionalGuests: existingRsvp?.additionalGuests || []
      }}
      isUpdate={!!existingRsvp}
    />
  );
};

export default InvitationPage; 