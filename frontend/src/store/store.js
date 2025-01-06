import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import guestReducer from '../features/guests/guestSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    guests: guestReducer,
  },
});

export default store; 