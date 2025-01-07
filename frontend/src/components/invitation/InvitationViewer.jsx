import React, { useState } from 'react';
import { Box, IconButton, Paper, Stack, Button } from '@mui/material';
import { ChevronLeft, ChevronRight, Download } from '@mui/icons-material';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { styled } from '@mui/material/styles';

// Set worker URL for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: '100%',
  mx: 'auto',
  position: 'relative',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.12)'
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  padding: '10px 24px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'
  }
}));

const InvitationViewer = ({ pdfUrl, onRsvpClick }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => {
      const newPage = prevPageNumber + offset;
      if (newPage > numPages) return 1;
      if (newPage < 1) return numPages;
      return newPage;
    });
  };

  const handlePageClick = () => {
    changePage(1);
  };

  const handleDownload = () => {
    window.open(`/api${pdfUrl}`, '_blank');
  };

  return (
    <StyledPaper>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          cursor: 'pointer'
        }}
      >
        <Document
          file={`/api${pdfUrl}`}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <Box sx={{ p: 4, textAlign: 'center' }}>
              Loading invitation...
            </Box>
          }
        >
          <Box onClick={handlePageClick}>
            <Page 
              pageNumber={pageNumber} 
              renderTextLayer={false}
              renderAnnotationLayer={false}
              width={Math.min(window.innerWidth * 0.8, 600)}
            />
          </Box>
        </Document>

        <Stack 
          direction="row" 
          spacing={2} 
          alignItems="center"
          sx={{ mt: 2 }}
        >
          <IconButton 
            onClick={() => changePage(-1)}
            disabled={isLoading}
          >
            <ChevronLeft />
          </IconButton>

          <StyledButton
            variant="contained"
            onClick={onRsvpClick}
            disabled={isLoading}
          >
            RSVP Now
          </StyledButton>

          <IconButton 
            onClick={() => changePage(1)}
            disabled={isLoading}
          >
            <ChevronRight />
          </IconButton>

          <IconButton 
            onClick={handleDownload}
            disabled={isLoading}
          >
            <Download />
          </IconButton>
        </Stack>
      </Box>
    </StyledPaper>
  );
};

export default InvitationViewer; 