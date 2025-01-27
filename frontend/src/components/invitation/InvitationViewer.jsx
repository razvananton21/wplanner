import React, { useState, useEffect } from 'react';
import { Box, useTheme, CircularProgress, Typography, alpha } from '@mui/material';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { motion, AnimatePresence } from 'framer-motion';

// Set worker URL for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const InvitationViewer = ({ pdfUrl }) => {
  const theme = useTheme();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = React.useRef(null);
  const [showHint, setShowHint] = useState(true);

  // Hide the hint after 3 seconds
  useEffect(() => {
    if (showHint) {
      const timer = setTimeout(() => setShowHint(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showHint]);

  // Prepend /api to the URL if it's a relative path
  const fullPdfUrl = pdfUrl.startsWith('http') ? pdfUrl : `/api${pdfUrl}`;

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = Math.min(
          containerRef.current.offsetWidth,
          window.innerHeight * 0.7 * 0.707 // maintain A4 aspect ratio based on height
        );
        setContainerWidth(width);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log('PDF loaded successfully with', numPages, 'pages');
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setError('Failed to load PDF');
    setIsLoading(false);
  };

  const handlePageClick = () => {
    setPageNumber(prevPageNumber => {
      if (prevPageNumber >= numPages) return 1;
      return prevPageNumber + 1;
    });
    setShowHint(false);
  };

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        cursor: 'pointer',
        gap: 2
      }}
    >
      <Box
        onClick={handlePageClick}
        sx={{
          position: 'relative',
          width: containerWidth,
          perspective: '1000px'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={pageNumber}
            initial={{ opacity: 0, rotateY: -90, scale: 0.9 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            exit={{ opacity: 0, rotateY: 90, scale: 0.9 }}
            transition={{ 
              duration: 0.5,
              type: "spring",
              stiffness: 100,
              damping: 20
            }}
            style={{
              width: '100%',
              background: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
              transformStyle: 'preserve-3d'
            }}
          >
            <Document
              file={fullPdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <Box sx={{ 
                  width: '100%',
                  aspectRatio: '1/1.414',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(255, 255, 255, 0.8)'
                }}>
                  <CircularProgress sx={{ color: '#D1BFA5' }} />
                </Box>
              }
            >
              <Page
                pageNumber={pageNumber}
                width={containerWidth}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            </Document>

            {/* Click hint overlay */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '12px'
                  }}
                >
                  <Typography
                    sx={{
                      color: '#FFFFFF',
                      fontSize: '1.2rem',
                      textAlign: 'center',
                      px: 3,
                      py: 2,
                      bgcolor: 'rgba(0, 0, 0, 0.6)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    Click to flip pages
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Page indicators */}
      {numPages > 1 && (
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            mt: 2
          }}
        >
          {[...Array(numPages)].map((_, index) => (
            <motion.div
              key={index}
              initial={false}
              animate={{
                scale: pageNumber === index + 1 ? 1.2 : 1,
                backgroundColor: pageNumber === index + 1 ? '#D1BFA5' : alpha('#D1BFA5', 0.3)
              }}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default InvitationViewer; 