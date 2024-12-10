// 댓글 데이터 타입
// src/types/type.ts
export interface Comment {
  id: number;
  nickname: string;
  content: string;
  author: string;
  createdAt: string;
}


// 게시글 데이터 타입
export interface Post {
  id: number;
  title: string;
  content: string;
  comments: Comment[]; // 댓글 배열
  author: string; // 게시글 작성자
}

export interface Article {
  id: number;
  title: string;
  content: string;
  categoryType: 'FREE_BOARD' | 'NEW_CONCERT';
  artist?: { id: number; name: string };
  newConcert?: { id: number; name: string };
  userName: string;
  userId: number;   // 사용자 ID

}
