import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Article, Comment } from '../types/type';
import {
  getCommentsByArticle,
  deleteComment,
  updateComment,
} from '../apis/comments';
import CommentsSection from './CommentsSection';

interface ModalProps {
  article: Article;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ArticleModal: React.FC<ModalProps> = ({
  article,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasFetchedComments, setHasFetchedComments] = useState<boolean>(false);
  const token = useSelector((state: RootState) => state.auth.token);
  const nickname = useSelector((state: RootState) => state.auth.nickname);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      if (hasFetchedComments) return;

      try {
        setLoading(true);
        const data = await getCommentsByArticle(article.id);
        setComments(data);
        setHasFetchedComments(true);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      } finally {
        setLoading(false);
      }
    };

    if (article.id) {
      fetchComments();
    }
  }, [article.id, hasFetchedComments]);

  // Add comment
  const handleAddComment = (comment: Comment) => {
    setComments((prev) => [...prev, { ...comment, nickname: nickname || '' }]);
  };

  // Delete comment
  const handleDeleteComment = async (commentId: number) => {
    try {
      if (nickname && token) {
        await deleteComment(commentId, token);
        setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      } else {
        Alert.alert('오류', '로그인이 필요합니다.');
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  // Update comment
  const handleUpdateComment = async (commentId: number, updatedContent: string) => {
    try {
      if (nickname && token) {
        await updateComment(commentId, updatedContent, token);
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId ? { ...comment, content: updatedContent } : comment
          )
        );
      } else {
        Alert.alert('오류', '로그인이 필요합니다.');
      }
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <Text style={styles.title}>{article.title}</Text>
            <Text style={styles.author}>작성자: {article.userName || '알 수 없음'}</Text>
            <Text style={styles.content}>{article.content}</Text>

            <View style={styles.commentsSection}>
              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <CommentsSection
                  articleId={article.id}
                  comments={comments}
                  onAddComment={handleAddComment}
                  onDeleteComment={handleDeleteComment}
                  onUpdateComment={handleUpdateComment}
                  nickname={nickname}
                />
              )}
            </View>

            <View style={styles.buttonContainer}>
              {nickname === article.userName && (
                <>
                  <TouchableOpacity
                    style={[styles.button, styles.editButton]}
                    onPress={onEdit}
                  >
                    <Text style={styles.buttonText}>수정</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={onDelete}
                  >
                    <Text style={styles.buttonText}>삭제</Text>
                  </TouchableOpacity>
                </>
              )}
              <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  author: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    marginBottom: 20,
  },
  commentsSection: {
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  closeButton: {
    backgroundColor: '#555',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ArticleModal;