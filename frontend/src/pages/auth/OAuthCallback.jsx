import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CircularProgress, Container, Box } from '@mui/material';

const OAuthCallback = () => {
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        
        if (code) {
            // Send the code to the parent window
            window.opener.postMessage({
                type: 'oauth-callback',
                code: code
            }, window.location.origin);
        }
    }, [location]);

    return (
        <Container>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh'
                }}
            >
                <CircularProgress />
            </Box>
        </Container>
    );
};

export default OAuthCallback; 