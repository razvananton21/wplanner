import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  MenuItem,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { motion } from 'framer-motion';
import weddingService from '../../services/weddingService';

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string(),
  date: yup.date().required('Date is required').min(new Date(), 'Date must be in the future'),
  venue: yup.string().required('Venue is required'),
  language: yup.string().required('Language is required'),
});

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ro', name: 'Romanian' },
];

const CreateWedding = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      language: 'en',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await weddingService.createWedding(data);
      navigate(`/weddings/${response.wedding.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create wedding');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create New Wedding
          </Typography>

          <Paper sx={{ p: 4, mt: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                label="Wedding Title"
                {...register('title')}
                error={!!errors.title}
                helperText={errors.title?.message}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                {...register('description')}
                error={!!errors.description}
                helperText={errors.description?.message}
                sx={{ mb: 3 }}
              />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Wedding Date and Time"
                  onChange={(date) => setValue('date', date)}
                  sx={{ mb: 3, width: '100%' }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.date,
                      helperText: errors.date?.message,
                    },
                  }}
                />
              </LocalizationProvider>

              <TextField
                fullWidth
                label="Venue"
                {...register('venue')}
                error={!!errors.venue}
                helperText={errors.venue?.message}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                select
                label="Language"
                {...register('language')}
                error={!!errors.language}
                helperText={errors.language?.message}
                sx={{ mb: 3 }}
              >
                {languages.map((language) => (
                  <MenuItem key={language.code} value={language.code}>
                    {language.name}
                  </MenuItem>
                ))}
              </TextField>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/weddings')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Wedding'}
                </Button>
              </Box>
            </form>
          </Paper>
        </Box>
      </motion.div>
    </Container>
  );
};

export default CreateWedding; 