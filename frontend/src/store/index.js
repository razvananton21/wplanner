import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import weddingReducer from './slices/weddingSlice';
import invitationReducer from './slices/invitationSlice';
import photoReducer from './slices/photoSlice';
import tableReducer from './slices/tableSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    wedding: weddingReducer,
    invitation: invitationReducer,
    photo: photoReducer,
    table: tableReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.token'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.token'],
      },
    }),
});

export default store; 