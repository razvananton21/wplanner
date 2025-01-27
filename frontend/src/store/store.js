import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/slices/authSlice';
import guestReducer from '@/features/guests/guestSlice';
import tableReducer from '@/store/slices/tableSlice';
import budgetReducer from '@/store/slices/budgetSlice';
import rsvpReducer from '@/store/slices/rsvpSlice';

const customMiddleware = (store) => (next) => (action) => {
  console.log('Dispatching:', action);
  const result = next(action);
  console.log('Next State:', store.getState());
  return result;
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    guests: guestReducer,
    tables: tableReducer,
    budget: budgetReducer,
    rsvps: rsvpReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
        ignoredActionPaths: ['payload.token'],
        ignoredPaths: ['auth.token'],
      },
    }).concat(customMiddleware),
});

export default store; 