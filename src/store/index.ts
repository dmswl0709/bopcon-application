import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // authSlice import

const store = configureStore({
  reducer: {
    auth: authReducer, // Redux Slice 설정
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;