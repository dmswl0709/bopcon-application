import { Alert } from 'react-native';
import { httpClient } from './http'; // httpClient를 import

const API_BASE_URL = '/api/comments';

// 댓글 추가
export const addComment = async (
  articleId: number,
  content: string,
  token: string
): Promise<Comment> => {
  try {
    const response = await httpClient.post<Comment>(
      `${API_BASE_URL}`,
      { articleId, content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    Alert.alert('오류', '댓글 추가 중 문제가 발생했습니다.');
    throw error;
  }
};

// 특정 게시글의 댓글 조회
export const getCommentsByArticle = async (
  articleId: number
): Promise<Comment[]> => {
  try {
    const response = await httpClient.get<Comment[]>(`${API_BASE_URL}/article/${articleId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching comments for article ID ${articleId}:`, error);
    Alert.alert('오류', '댓글 조회 중 문제가 발생했습니다.');
    throw error;
  }
};

// 댓글 수정
export const updateComment = async (
  commentId: number,
  content: string,
  token: string
): Promise<Comment> => {
  try {
    const response = await httpClient.put<Comment>(
      `${API_BASE_URL}/${commentId}`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating comment ID ${commentId}:`, error);
    Alert.alert('오류', '댓글 수정 중 문제가 발생했습니다.');
    throw error;
  }
};

// 댓글 삭제
export const deleteComment = async (
  commentId: number,
  token: string
): Promise<void> => {
  try {
    await httpClient.delete(`${API_BASE_URL}/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error(`Error deleting comment ID ${commentId}:`, error);
    Alert.alert('오류', '댓글 삭제 중 문제가 발생했습니다.');
    throw error;
  }
};