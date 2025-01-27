export const commonTextFieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    bgcolor: '#FFFFFF',
    minHeight: 44,
    '& fieldset': {
      borderColor: '#E8E3DD',
      borderWidth: '1px',
      transition: 'all 0.2s ease',
    },
    '&:hover fieldset': {
      borderColor: '#D1BFA5',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#D1BFA5',
      borderWidth: '1.5px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#7A6B63',
    fontSize: '0.875rem',
    fontFamily: 'Inter, sans-serif',
    '&.Mui-focused': {
      color: '#D1BFA5',
    },
  },
  '& .MuiInputBase-input': {
    fontSize: '1rem',
    color: '#6A6A6A',
    fontFamily: 'Inter, sans-serif',
    padding: '12px',
  },
  '& .MuiInputBase-inputMultiline': {
    padding: '12px',
  },
}; 