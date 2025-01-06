import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { weddingService } from '../../services/api';

const TableList = () => {
  const { id: weddingId } = useParams();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTable, setNewTable] = useState({ name: '', capacity: 8 });

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await weddingService.getWedding(weddingId);
        setTables(response.wedding.tables || []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch tables');
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, [weddingId]);

  const handleAddTable = () => {
    setNewTable({ name: '', capacity: 8 });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSaveTable = async () => {
    try {
      // TODO: Implement table creation API call
      // const response = await weddingService.createTable(weddingId, newTable);
      // setTables([...tables, response.table]);
      setDialogOpen(false);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to create table');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mt: 4, mb: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Typography variant="h4" component="h1">
              Tables
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddTable}
            >
              Add Table
            </Button>
          </Box>

          <Grid container spacing={3}>
            {tables.map((table) => (
              <Grid item xs={12} sm={6} md={4} key={table.id}>
                <Paper
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    {table.name}
                  </Typography>
                  <Typography color="text.secondary">
                    Capacity: {table.capacity}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Guests: {table.guests?.length || 0} / {table.capacity}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {tables.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                bgcolor: 'background.paper',
                borderRadius: 2,
                mt: 4,
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tables yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Add tables to start organizing your seating arrangement
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddTable}
              >
                Add First Table
              </Button>
            </Box>
          )}
        </Box>
      </motion.div>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Add New Table</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Table Name"
              value={newTable.name}
              onChange={(e) => setNewTable({ ...newTable, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="number"
              label="Capacity"
              value={newTable.capacity}
              onChange={(e) => setNewTable({ ...newTable, capacity: parseInt(e.target.value, 10) })}
              inputProps={{ min: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveTable} variant="contained">
            Add Table
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TableList; 