import { RootState } from '../store';
import { createSelector } from 'reselect';

// Base selector: Redux에서 setlist 상태 가져오기
const selectSetlistState = (state: RootState) => state.setlist;

// Memoized selector: setlist 데이터를 캐싱하여 반환
export const selectSetlist = createSelector(
  [selectSetlistState],
  (setlistState) => setlistState?.setlist || []
);

// Loading 상태 캐싱
export const selectSetlistLoading = createSelector(
  [selectSetlistState],
  (setlistState) => setlistState?.loading || false
);

// 에러 상태 캐싱
export const selectSetlistError = createSelector(
  [selectSetlistState],
  (setlistState) => setlistState?.error || null
);

// Auth slice에서 닉네임 가져오기
export const selectUserNickname = (state: RootState) =>
  state.auth?.nickname || '';