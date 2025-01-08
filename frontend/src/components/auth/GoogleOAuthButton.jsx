import React from 'react';
import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { oauthService } from '../../services/oauthService';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const GoogleOAuthButton = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            // Get the Google OAuth URL
            const authUrl = await oauthService.getGoogleAuthUrl();
            
            // Open the Google OAuth window
            const width = 500;
            const height = 600;
            const left = window.screenX + (window.outerWidth - width) / 2;
            const top = window.screenY + (window.outerHeight - height) / 2;
            
            const authWindow = window.open(
                authUrl,
                'Google OAuth',
                `width=${width},height=${height},left=${left},top=${top}`
            );

            // Listen for the OAuth callback
            const handleMessage = async (event) => {
                // Verify the origin of the message
                if (event.origin !== window.location.origin) return;

                try {
                    if (event.data.type === 'oauth-callback' && event.data.code) {
                        // Close the OAuth window
                        authWindow.close();
                        
                        // Handle the OAuth callback
                        const tokens = await oauthService.handleGoogleCallback(event.data.code);
                        
                        // Login the user
                        await login(tokens);
                        
                        // Redirect to homepage
                        navigate('/');
                    }
                } catch (error) {
                    console.error('Google OAuth error:', error);
                }
            };

            window.addEventListener('message', handleMessage);
            
            // Cleanup the event listener when the OAuth window is closed
            const checkWindow = setInterval(() => {
                if (authWindow.closed) {
                    clearInterval(checkWindow);
                    window.removeEventListener('message', handleMessage);
                }
            }, 500);

        } catch (error) {
            console.error('Failed to initiate Google login:', error);
        }
    };

    return (
        <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{
                backgroundColor: '#4285F4',
                '&:hover': {
                    backgroundColor: '#357ABD'
                },
                marginTop: 2,
                marginBottom: 2
            }}
        >
            Continue with Google
        </Button>
    );
};

export default GoogleOAuthButton; 