import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Picker,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';

interface ArticleFormProps {
  mode: 'create' | 'edit';
  initialTitle?: string;
  initialContent?: string;
  initialCategoryType?: 'FREE_BOARD' | 'NEW_CONCERT';
  fixedArtistId?: number | null;
  initialNewConcertId?: number | null;
  onSubmit: (
    title: string,
    content: string,
    categoryType: 'FREE_BOARD' | 'NEW_CONCERT',
    artistId: number | null,
    newConcertId: number | null
  ) => void;
  onCancel: () => void;
}

const ArticleForm: React.FC<ArticleFormProps> = ({
  mode,
  initialTitle = '',
  initialContent = '',
  initialCategoryType = 'FREE_BOARD',
  fixedArtistId = null,
  initialNewConcertId = null,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [categoryType, setCategoryType] = useState(initialCategoryType);
  const [newConcertId, setNewConcertId] = useState<number | null>(initialNewConcertId);
  const [concerts, setConcerts] = useState<{ newConcertId: number; title: string }[]>([]);
  const [artistName, setArtistName] = useState<string | null>(null);

  useEffect(() => {
    if (categoryType === 'NEW_CONCERT') {
      const fetchConcerts = async () => {
        try {
          const response = await axios.get('/api/new-concerts');
          setConcerts(response.data);
        } catch (error) {
          console.error('Failed to fetch concerts:', error);
        }
      };

      fetchConcerts();
    }
  }, [categoryType]);

  useEffect(() => {
    if (fixedArtistId) {
      const fetchArtist = async () => {
        try {
          const response = await axios.get(`/api/artists/${fixedArtistId}`);
          setArtistName(response.data.name);
        } catch (error) {
          console.error('Failed to fetch artist:', error);
        }
      };

      fetchArtist();
    }
  }, [fixedArtistId]);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('오류', '제목과 내용을 입력하세요.');
      return;
    }
    onSubmit(title.trim(), content.trim(), categoryType, fixedArtistId, newConcertId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {mode === 'create' ? '글쓰기' : '글 수정'}
      </Text>

      {fixedArtistId && artistName && (
        <View style={styles.artistInfo}>
          <Text style={styles.artistLabel}>아티스트</Text>
          <Text style={styles.artistName}>{artistName}</Text>
        </View>
      )}

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="제목"
        style={styles.input}
      />
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="내용"
        style={[styles.input, styles.textarea]}
        multiline
      />
      <Picker
        selectedValue={categoryType}
        onValueChange={(value) =>
          setCategoryType(value as 'FREE_BOARD' | 'NEW_CONCERT')
        }
        style={styles.picker}
      >
        <Picker.Item label="자유게시판" value="FREE_BOARD" />
        <Picker.Item label="콘서트 게시판" value="NEW_CONCERT" />
      </Picker>

      {categoryType === 'NEW_CONCERT' && (
        <Picker
          selectedValue={newConcertId || ''}
          onValueChange={(value) =>
            setNewConcertId(value ? Number(value) : null)
          }
          style={styles.picker}
        >
          <Picker.Item label="콘서트 선택 (선택 사항)" value="" />
          {concerts.map((concert) => (
            <Picker.Item
              key={concert.newConcertId}
              label={concert.title}
              value={concert.newConcertId}
            />
          ))}
        </Picker>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>
            {mode === 'create' ? '작성' : '수정'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
          <Text style={styles.buttonText}>취소</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  artistInfo: {
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  artistLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  artistName: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: '#555',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ArticleForm;