import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/slices/authSlice';
import guestReducer from '@/features/guests/guestSlice';
import tableReducer from '@/store/slices/tableSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    guests: guestReducer,
    tables: tableReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
        ignoredActionPaths: ['payload.token'],
        ignoredPaths: ['auth.token'],
      },
    }),
});

export default store; 