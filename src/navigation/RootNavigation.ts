import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

/**
 * navigate 함수: 전역적으로 화면 이동을 관리
 * @param name - 이동하려는 화면 이름
 * @param params - 해당 화면으로 전달할 매개변수
 */
export function navigate(name: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

/**
 * goBack 함수: 이전 화면으로 돌아가기
 */
export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}