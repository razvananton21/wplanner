import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  TextField,
  InputAdornment,
  Badge,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import GuestList from './GuestList';
import EntityViewLayout from '../common/EntityViewLayout';

const GuestsPage = () => {
  const { id } = useParams();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isBulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const handleAddGuest = () => {
    setAddModalOpen(true);
  };

  return (
    <EntityViewLayout
      title="Guest List"
      backUrl={`/weddings/${id}`}
      onAdd={handleAddGuest}
    >

      <GuestList 
        weddingId={id} 
        isAddModalOpen={isAddModalOpen}
        setAddModalOpen={setAddModalOpen}
        isBulkUploadOpen={isBulkUploadOpen}
        setBulkUploadOpen={setBulkUploadOpen}
        searchQuery={searchQuery}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        filterDialogOpen={filterDialogOpen}
        setFilterDialogOpen={setFilterDialogOpen}
      />
    </EntityViewLayout>
  );
};

export default GuestsPage; 