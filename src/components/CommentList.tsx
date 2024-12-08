import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { getCommentsByArticle, deleteComment, updateComment } from '../apis/comments';
import { Comment } from '../types/type';

interface CommentListProps {
  articleId: number;
  token: string;
  onCommentDeleted: (commentId: number) => void;
}

const CommentList: React.FC<CommentListProps> = ({ articleId, token, onCommentDeleted }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null); // 수정할 댓글 ID
  const [newContent, setNewContent] = useState<string>(''); // 수정할 내용

  useEffect(() => {
    getCommentsByArticle(articleId)
      .then(setComments)
      .catch((error) => console.error('댓글 조회 실패:', error));
  }, [articleId]);

  const handleDelete = (commentId: number) => {
    deleteComment(commentId, token)
      .then(() => {
        setComments((prev) => prev.filter((comment) => comment.id !== commentId));
        onCommentDeleted(commentId); // 부모 컴포넌트에 삭제 알림
      })
      .catch((error) => console.error('댓글 삭제 실패:', error));
  };

  const handleEdit = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setNewContent(content);
  };

  const handleSaveEdit = (commentId: number) => {
    if (newContent.trim() === '') {
      return;
    }

    updateComment(commentId, newContent, token)
      .then((updatedComment) => {
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId ? { ...comment, content: updatedComment.content } : comment
          )
        );
        setEditingCommentId(null); // 수정 모드 종료
        setNewContent(''); // 입력값 초기화
      })
      .catch((error) => console.error('댓글 수정 실패:', error));
  };

  const renderItem = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <Text style={styles.author}>{item.author}:</Text>
      {editingCommentId === item.id ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.textInput}
            value={newContent}
            onChangeText={setNewContent}
          />
          <View style={styles.buttonGroup}>
            <TouchableOpacity onPress={() => handleSaveEdit(item.id)} style={styles.saveButton}>
              <Text style={styles.buttonText}>저장</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditingCommentId(null)} style={styles.cancelButton}>
              <Text style={styles.buttonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={styles.content}>{item.content}</Text>
      )}
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
          <Text style={styles.buttonText}>삭제</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleEdit(item.id, item.content)} style={styles.editButton}>
          <Text style={styles.buttonText}>수정</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={comments}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  commentItem: {
    marginBottom: 16,
    padding: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
  },
  author: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
    marginBottom: 8,
  },
  editContainer: {
    marginBottom: 8,
  },
  textInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteButton: {
    marginRight: 8,
    backgroundColor: 'red',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  editButton: {
    backgroundColor: 'blue',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  saveButton: {
    backgroundColor: 'green',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  cancelButton: {
    backgroundColor: 'gray',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default CommentList;