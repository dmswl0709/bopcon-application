import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';

interface Post {
  id: number;
  title: string;
}

interface PostListProps {
  posts: Post[];
  onSelectPost: (id: number) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, onSelectPost }) => {
  // 게시글을 렌더링하는 함수
  const renderItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => onSelectPost(item.id)}
    >
      <Text style={styles.postTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {posts.length === 0 ? (
        <Text style={styles.noPostsText}>게시글이 없습니다.</Text>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  noPostsText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  postItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PostList;
