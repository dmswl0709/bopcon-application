// src/types/JoinProps.ts
export interface JoinProps {
    accessToken: string;
    refreshToken: string;
    id?: number;
    nickname?: string; // 회원가입에만 필요한 필드
  }