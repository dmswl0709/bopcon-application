import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

// 스토어 구성
const store = configureStore({
  reducer: {
    auth: authReducer, // auth 슬라이스 등록
  },
});

// RootState 타입 정의: 전체 Redux 상태의 타입
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch 타입 정의: Redux에서 사용하는 디스패치 타입
export type AppDispatch = typeof store.dispatch;

// Redux 디스패치용 커스텀 훅 사용시 타입 추가를 위해 export
export const useAppDispatch: () => AppDispatch = () => useDispatch<AppDispatch>();

// 스토어 내보내기
export default store;
