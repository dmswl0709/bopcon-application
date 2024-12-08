import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Comment } from '../types/type';
import CommentForm from './CommentForm';

interface CommentsSectionProps {
  articleId: number;
  comments: Comment[];
  onAddComment: (comment: Comment) => void;
  onDeleteComment: (commentId: number) => void;
  onUpdateComment: (commentId: number, updatedContent: string) => void;
  nickname: string | null;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  articleId,
  comments,
  onAddComment,
  onDeleteComment,
  onUpdateComment,
  nickname,
}) => {
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState<string>('');

  const handleEdit = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditingCommentContent(content);
  };

  const handleUpdate = () => {
    if (editingCommentContent.trim()) {
      onUpdateComment(editingCommentId as number, editingCommentContent);
      setEditingCommentId(null);
      setEditingCommentContent('');
    }
  };

  const handleCommentAdded = (newComment: Comment) => {
    onAddComment(newComment);
  };

  const renderCommentItem = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <Text style={styles.commentText}>
        <Text style={styles.nickname}>{item.nickname}: </Text>
        {item.content}
      </Text>
      {nickname && nickname === item.nickname && (
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => handleEdit(item.id, item.content)} style={styles.editButton}>
            <Text style={styles.actionText}>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDeleteComment(item.id)} style={styles.deleteButton}>
            <Text style={styles.actionText}>삭제</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>댓글</Text>
      {comments.length > 0 ? (
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCommentItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noComments}>댓글이 없습니다.</Text>
      )}

      {editingCommentId && (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            value={editingCommentContent}
            onChangeText={setEditingCommentContent}
          />
          <TouchableOpacity onPress={handleUpdate} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>댓글 수정</Text>
          </TouchableOpacity>
        </View>
      )}

      <CommentForm articleId={articleId} onCommentAdded={handleCommentAdded} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContainer: {
    marginBottom: 16,
  },
  commentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  commentText: {
    flex: 1,
    fontSize: 14,
  },
  nickname: {
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
  },
  editButton: {
    marginRight: 8,
    backgroundColor: '#FFD700',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  deleteButton: {
    backgroundColor: '#FF4500',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noComments: {
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
  },
  editContainer: {
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default CommentsSection;