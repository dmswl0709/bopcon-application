import { Alert } from 'react-native';
import { AxiosResponse } from 'axios';
import { httpClient } from './http';
import { Article } from '../types/type';

const ARTICLE_API_BASE_URL = '/api/articles';

export const getAllArticles = async (): Promise<Article[]> => {
  try {
    const response: AxiosResponse<Article[]> = await httpClient.get(ARTICLE_API_BASE_URL);
    return response.data;
  } catch (error) {
    Alert.alert('오류', '게시글을 불러오는 중 문제가 발생했습니다.');
    console.error('Error fetching all articles:', error);
    throw error;
  }
};

export const getArticleById = async (id: number): Promise<Article> => {
  try {
    const response: AxiosResponse<Article> = await httpClient.get(`${ARTICLE_API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    Alert.alert('오류', `게시글 ID ${id}를 불러오는 중 문제가 발생했습니다.`);
    console.error(`Error fetching article with ID ${id}:`, error);
    throw error;
  }
};

export const createArticle = async (
  article: {
    title: string;
    content: string;
    categoryType: 'FREE_BOARD' | 'NEW_CONCERT';
    artistId: number | null;
    userId: number;
    newConcertId: number | null;
  },
  token: string
): Promise<Article> => {
  try {
    const response: AxiosResponse<Article> = await httpClient.post(ARTICLE_API_BASE_URL, article, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    Alert.alert('오류', '게시글 생성 중 문제가 발생했습니다.');
    console.error('Error creating article:', error);
    throw error;
  }
};

export const updateArticle = async (
  id: number,
  article: {
    title?: string;
    content?: string;
    categoryType?: 'FREE_BOARD' | 'NEW_CONCERT';
    artistId?: number | null;
    newConcertId?: number | null;
  },
  token: string
): Promise<Article> => {
  try {
    const response: AxiosResponse<Article> = await httpClient.put(
      `${ARTICLE_API_BASE_URL}/${id}`,
      article,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    Alert.alert('오류', `게시글 ID ${id} 수정 중 문제가 발생했습니다.`);
    console.error(`Error updating article with ID ${id}:`, error);
    throw error;
  }
};

export const deleteArticle = async (id: number, token: string): Promise<void> => {
  try {
    await httpClient.delete(`${ARTICLE_API_BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    Alert.alert('오류', `게시글 ID ${id} 삭제 중 문제가 발생했습니다.`);
    console.error(`Error deleting article with ID ${id}:`, error);
    throw error;
  }
};