import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store'; // 프로젝트에 맞게 수정
import { addComment } from '../apis/comments'; // 댓글 추가 API 호출 함수
import { Comment } from '../types/type'; // Comment 타입

interface CommentFormProps {
  articleId: number;
  onCommentAdded: (newComment: Comment) => void; // 새 댓글을 부모 컴포넌트에 전달하는 콜백 함수
}

const CommentForm: React.FC<CommentFormProps> = ({ articleId, onCommentAdded }) => {
  const [newComment, setNewComment] = useState<string>(''); // 댓글 내용 상태
  const [error, setError] = useState<string>(''); // 에러 상태
  const token = useSelector((state: RootState) => state.auth.token); // Redux에서 토큰 가져오기
  const nickname = useSelector((state: RootState) => state.auth.nickname); // 로그인된 사용자 닉네임

  const handleAddComment = async () => {
    if (newComment.trim()) {
      if (!token) {
        setError('로그인된 사용자가 없습니다.');
        return;
      }

      if (!nickname) {
        setError('댓글을 작성하려면 로그인해야 합니다.');
        return;
      }

      try {
        const addedComment = await addComment(articleId, newComment, token);
        onCommentAdded(addedComment); // 부모 컴포넌트에 새 댓글 전달
        setNewComment(''); // 입력 필드 초기화
        setError(''); // 에러 초기화
      } catch (error) {
        console.error('댓글 추가 실패:', error);
        setError('댓글 추가에 실패했습니다. 다시 시도해주세요.');
      }
    } else {
      setError('댓글 내용을 입력하세요!');
    }
  };

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.errorText}>{error}</Text> : null} {/* 에러 메시지 표시 */}
      <TextInput
        style={styles.input}
        placeholder="댓글 작성..."
        value={newComment}
        onChangeText={setNewComment} // 댓글 내용 관리
      />
      <TouchableOpacity onPress={handleAddComment} style={styles.button}>
        <Text style={styles.buttonText}>댓글 추가</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CommentForm;