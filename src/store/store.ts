import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import favoritesReducer from "./slices/favoritesSlice"; // favorites 슬라이스 추가


const store = configureStore({
  reducer: {
    auth: authReducer, // 추가된 auth 관련 리듀서
    favorites: favoritesReducer, // favorites 슬라이스 등록
  },
});

// 스토어 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;