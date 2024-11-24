export interface ConcertDetails {
  id: string; // Concert의 고유 ID
  title: string; // 공연 제목
  subTitle?: string; // 부제목 (선택적)
  date: string; // 공연 날짜
  venueName: string; // 공연장 이름
  cityName: string; // 도시 이름
  countryName: string; // 국가 이름
  ticketUrl?: string; // 티켓 URL (선택적)
  posterUrl?: string; // 포스터 이미지 URL (선택적)
  setlist?: string[]; // 셋리스트
  [key: string]: any; // 기타 데이터 허용
}