import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Stack,
  Alert,
} from '@mui/material';
import EntityViewLayout from '../common/EntityViewLayout';
import InvitationUpload from './InvitationUpload';
import InvitationViewer from './InvitationViewer';
import weddingService from '../../services/weddingService';

const InvitationPage = () => {
  const { id } = useParams();
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvitation = useCallback(async () => {
    console.log('Fetching invitation for wedding ID:', id);
    try {
      setLoading(true);
      const wedding = await weddingService.getWedding(id);
      console.log('Wedding data:', wedding);
      
      if (wedding && wedding.invitationPdfUrl) {
        console.log('Setting invitation URL:', wedding.invitationPdfUrl);
        setInvitation(wedding.invitationPdfUrl);
        setError(null);
      } else {
        console.log('No invitation found in wedding data');
        setInvitation(null);
        setError('No invitation uploaded yet');
      }
    } catch (err) {
      console.error('Error fetching invitation:', err);
      setError('Failed to load invitation');
      setInvitation(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    console.log('InvitationPage mounted with ID:', id);
    if (id) {
      fetchInvitation();
    }
  }, [id, fetchInvitation]);

  const handleUploadSuccess = () => {
    console.log('Upload success, refetching invitation...');
    fetchInvitation();
  };

  return (
    <EntityViewLayout
      title="Invitation"
      subtitle="Planning"
      backUrl={`/weddings/${id}`}
    >
      <Box sx={{ p: 3 }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography>Loading invitation...</Typography>
          </Box>
        ) : invitation ? (
          <Stack spacing={3}>
            <InvitationViewer 
              pdfUrl={invitation}
              onRsvpClick={() => {}}
            />
            <Box sx={{ mt: 3 }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  mb: 2,
                  color: '#5C5C5C',
                  fontWeight: 600,
                }}
              >
                Update Invitation
              </Typography>
              <InvitationUpload 
                weddingId={id} 
                onUploadSuccess={handleUploadSuccess}
              />
            </Box>
          </Stack>
        ) : (
          <Box>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 2,
                color: '#5C5C5C',
                fontWeight: 600,
              }}
            >
              Upload Invitation
            </Typography>
            <InvitationUpload 
              weddingId={id} 
              onUploadSuccess={handleUploadSuccess}
            />
          </Box>
        )}
      </Box>
    </EntityViewLayout>
  );
};

export default InvitationPage; 