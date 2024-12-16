import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  StatusBar,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import GlobalList from '../components/GlobalList';
import MoreButton from '../components/MoreButton';
import MyConcert from '../components/MyConcert';
import MyArtist from '../components/MyArtist';
import MyWriteList from '../components/MyWriteList'; // 여기서 실제 게시글 로딩
import MyCommentList from '../components/MyCommentList';
import PersonIcon from '../assets/icons/Person.svg';
import LogoutIcon from '../assets/icons/exit.svg';
import BackIcon from '../assets/icons/behind.svg';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';

const MyPageScreen = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isExpanded, setIsExpanded] = useState([false, false, false, false]);
  const [loading, setLoading] = useState(true);

  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user && token) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [user, token]);

  const toggleExpand = (index: number) => {
    setIsExpanded((prev) =>
      prev.map((item, i) => (i === index ? !item : item))
    );
  };

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate('LoginScreen');
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const fetchComments = async (id: number) => {
    try {
      const response = await axios.get(`https://api.bopcon.site/api/comments/article/${id}`);
      console.log("댓글 데이터:", response.data); // 응답 데이터 로그
      setComments(response.data);
    } catch (error) {
      console.error("댓글 데이터를 불러오는 중 오류 발생:", error);
      Alert.alert("오류", "댓글 데이터를 불러올 수 없습니다.");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Alert.alert('알림', '댓글을 입력해주세요.');
      return;
    }

    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        Alert.alert('오류', '로그인이 필요합니다.');
        return;
      }

      const decodedToken: any = jwtDecode(authToken);
      const fullNickname = decodedToken.sub || '익명';
      const nickname = fullNickname.includes('@')
        ? fullNickname.split('@')[0]
        : fullNickname;

      const requestData = {
        articleId: selectedArticle.id,
        content: newComment.trim(),
      };

      const response = await axios.post(
        'https://api.bopcon.site/api/comments',
        requestData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const newCommentData = {
        ...response.data,
        nickname: nickname, // 댓글 닉네임 추가
      };

      setComments((prevComments) => [...prevComments, newCommentData]);
      setNewComment('');
      Alert.alert('성공', '댓글이 작성되었습니다.');
    } catch (error) {
      console.error('댓글 작성 오류:', error);
      Alert.alert('오류', '댓글 작성 중 문제가 발생했습니다.');
    }
  };

  // 게시글 클릭 시 모달 열기 (바텀시트)
  const handleArticlePress = async (article: any) => {
    setSelectedArticle(article);
    await fetchComments(article.id);
    setIsModalVisible(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setSelectedArticle(null);
    setIsModalVisible(false);
    setComments([]);
    setNewComment('');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <>
            <GlobalList title="아티스트" />
            <View style={styles.flexWrap}>
              <MyArtist isExpanded={isExpanded[0]} />
            </View>
            <MoreButton
              isExpanded={isExpanded[0]}
              onToggle={() => toggleExpand(0)}
            />
            <GlobalList title="콘서트" />
            <View style={styles.flexWrap}>
              <MyConcert isExpanded={isExpanded[1]} />
            </View>
            <MoreButton
              isExpanded={isExpanded[1]}
              onToggle={() => toggleExpand(1)}
            />
          </>
        );
      case 1:
        return (
          <>
            <GlobalList title="게시물" />
            <View style={styles.contentWrapper}>
              {/* MyWriteList로 실제 게시글 로딩 및 표시 */}
              <MyWriteList
                isExpanded={isExpanded[2]}
                onArticlePress={handleArticlePress} // 게시글 클릭 시 모달 열기
              />
            </View>
            <MoreButton
              isExpanded={isExpanded[2]}
              onToggle={() => toggleExpand(2)}
            />
            <View style={styles.spacer} />
            <GlobalList title="댓글" />
            <View style={styles.contentWrapper}>
              <MyCommentList isExpanded={isExpanded[3]} />
            </View>
            <MoreButton
              isExpanded={isExpanded[3]}
              onToggle={() => toggleExpand(3)}
            />
          </>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>데이터를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={[{ key: 'content' }]}
        renderItem={() => (
          <>
            <View style={styles.navigationBar}>
              <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                <BackIcon width={24} height={24} fill="#000" />
              </TouchableOpacity>
              <Text style={styles.pageTitle}>mypage</Text>
            </View>
            <View style={styles.userWrapper}>
              <View style={styles.userIconContainer}>
                <PersonIcon width={50} height={50} />
              </View>
              <Text style={styles.userName}>{user || '익명 사용자'}</Text>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <LogoutIcon width={24} height={24} />
              </TouchableOpacity>
            </View>
            <View style={styles.tabMenu}>
              {['즐겨찾기', '게시물'].map((tab, index) => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.tabButton,
                    activeTab === index && styles.activeTabButton,
                  ]}
                  onPress={() => setActiveTab(index)}
                >
                  <Text
                    style={[
                      styles.tabButtonText,
                      activeTab === index && styles.activeTabText,
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
        ListFooterComponent={renderTabContent}
        keyExtractor={(item) => item.key}
      />

      {/* 바텀 시트 형태의 모달 */}
      <Modal
  visible={isModalVisible}
  transparent={true}
  animationType="fade"
  onRequestClose={closeModal}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      {selectedArticle ? (
        <>
          <Text style={styles.modalTitle}>{selectedArticle.title}</Text>
          <Text style={styles.modalAuthor}>
            작성자: {selectedArticle.userName || "Unknown"}
          </Text>
          <Text style={styles.modalBody}>{selectedArticle.content}</Text>
          <Text style={styles.commentTitle}>댓글</Text>
          {comments.length > 0 ? (
            comments.map((comment: any, index: number) => (
              <View key={index} style={styles.commentItem}>
                <Text style={styles.commentNickname}>
                  {comment.nickname || "익명"}:
                </Text>
                <Text style={styles.commentText}>{comment.content}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noComments}>댓글이 없습니다.</Text>
          )}

          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="댓글 작성..."
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity
              style={styles.commentButton}
              onPress={handleAddComment}
            >
              <Text style={styles.commentButtonText}>작성</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={styles.emptyText}>데이터를 불러오는 중...</Text>
      )}

      <TouchableOpacity
        onPress={closeModal}
        style={styles.closeButton}
      >
        <Text style={styles.closeButtonText}>닫기</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  // 중앙 모달 오버레이
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',    // 중앙 정렬
    alignItems: 'center',        // 중앙 정렬
  },
  // 모달 컨테이너
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    maxHeight: '80%', 
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalAuthor: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  modalBody: {
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  commentItem: {
    marginBottom: 8,
  },
  commentNickname: {
    fontWeight: '600',
  },
  commentText: {
    color: '#333',
  },
  noComments: {
    color: '#888',
    marginBottom: 8,
  },
  commentInputContainer: {
    flexDirection: 'row',
    marginTop: 16,
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 40,
    marginRight: 8,
  },
  commentButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  commentButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  closeButton: {
    marginTop: 16,
    alignSelf: 'flex-end',
    backgroundColor: '#999',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 44,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    padding: 8,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  userWrapper: {
    alignItems: 'center',
    marginVertical: 24,
  },
  userIconContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 50,
    padding: 16,
  },
  userName: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  logoutButton: {
    marginTop: 8,
  },
  tabMenu: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#f5f5f5',
  },
  activeTabButton: {
    backgroundColor: '#fff',
    borderColor: '#d1d1d1',
    borderWidth: 1,
  },
  tabButtonText: {
    color: '#9e9e9e',
    fontSize: 14,
  },
  activeTabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  flexWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  contentWrapper: {
    paddingHorizontal: 16,
  },
  spacer: {
    marginVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  bottomModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
  
});

export default MyPageScreen;
