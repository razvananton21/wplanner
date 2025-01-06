import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tableService } from '../../services/tableService';

// Async thunks
export const fetchTables = createAsyncThunk(
    'tables/fetchTables',
    async (weddingId) => {
        return await tableService.getTables(weddingId);
    }
);

export const fetchTable = createAsyncThunk(
    'tables/fetchTable',
    async (tableId) => {
        return await tableService.getTable(tableId);
    }
);

export const createTable = createAsyncThunk(
    'tables/createTable',
    async ({ weddingId, tableData }) => {
        return await tableService.createTable(weddingId, tableData);
    }
);

export const updateTable = createAsyncThunk(
    'tables/updateTable',
    async ({ tableId, tableData }) => {
        return await tableService.updateTable(tableId, tableData);
    }
);

export const deleteTable = createAsyncThunk(
    'tables/deleteTable',
    async (tableId) => {
        await tableService.deleteTable(tableId);
        return tableId;
    }
);

export const assignGuests = createAsyncThunk(
    'tables/assignGuests',
    async ({ tableId, guestIds }) => {
        return await tableService.assignGuests(tableId, guestIds);
    }
);

export const removeGuest = createAsyncThunk(
    'tables/removeGuest',
    async ({ tableId, guestId }) => {
        return await tableService.removeGuest(tableId, guestId);
    }
);

export const validateAssignment = createAsyncThunk(
    'tables/validateAssignment',
    async ({ tableId, guestIds }) => {
        return await tableService.validateAssignment(tableId, guestIds);
    }
);

const initialState = {
    tables: [],
    selectedTable: null,
    loading: false,
    error: null,
    validationResult: null
};

const tableSlice = createSlice({
    name: 'tables',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearValidationResult: (state) => {
            state.validationResult = null;
        },
        setSelectedTable: (state, action) => {
            state.selectedTable = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Tables
            .addCase(fetchTables.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTables.fulfilled, (state, action) => {
                state.loading = false;
                state.tables = action.payload;
            })
            .addCase(fetchTables.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch Single Table
            .addCase(fetchTable.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTable.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedTable = action.payload;
            })
            .addCase(fetchTable.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Create Table
            .addCase(createTable.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTable.fulfilled, (state, action) => {
                state.loading = false;
                state.tables.push(action.payload);
            })
            .addCase(createTable.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Update Table
            .addCase(updateTable.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTable.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.tables.findIndex(table => table.id === action.payload.id);
                if (index !== -1) {
                    state.tables[index] = action.payload;
                }
                if (state.selectedTable?.id === action.payload.id) {
                    state.selectedTable = action.payload;
                }
            })
            .addCase(updateTable.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Delete Table
            .addCase(deleteTable.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTable.fulfilled, (state, action) => {
                state.loading = false;
                state.tables = state.tables.filter(table => table.id !== action.payload);
                if (state.selectedTable?.id === action.payload) {
                    state.selectedTable = null;
                }
            })
            .addCase(deleteTable.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Assign Guests
            .addCase(assignGuests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(assignGuests.fulfilled, (state, action) => {
                state.loading = false;
                // We'll need to refresh the table data after assignment
                if (state.selectedTable) {
                    state.selectedTable = {
                        ...state.selectedTable,
                        guestCount: action.payload.guestCount,
                        availableSeats: action.payload.availableSeats
                    };
                }
            })
            .addCase(assignGuests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Remove Guest
            .addCase(removeGuest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeGuest.fulfilled, (state, action) => {
                state.loading = false;
                if (state.selectedTable) {
                    state.selectedTable = {
                        ...state.selectedTable,
                        guestCount: action.payload.guestCount,
                        availableSeats: action.payload.availableSeats
                    };
                }
            })
            .addCase(removeGuest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Validate Assignment
            .addCase(validateAssignment.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.validationResult = null;
            })
            .addCase(validateAssignment.fulfilled, (state, action) => {
                state.loading = false;
                state.validationResult = action.payload;
            })
            .addCase(validateAssignment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.validationResult = null;
            });
    }
});

export const { clearError, clearValidationResult, setSelectedTable } = tableSlice.actions;
export default tableSlice.reducer; 