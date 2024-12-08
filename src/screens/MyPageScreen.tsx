import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import GlobalList from '../components/GlobalList';
import MoreButton from '../components/MoreButton';
import MyConcert from '../components/MyConcert';
import MyArtist from '../components/MyArtist';
import MyWriteList from '../components/MyWriteList';
import MyCommentList from '../components/MyCommentList';
import PersonIcon from '../assets/icons/Person.svg';
import LogoutIcon from '../assets/icons/exit.svg';
import BackIcon from '../assets/icons/behind.svg';

const MyPageScreen = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isExpanded, setIsExpanded] = useState([false, false, false, false]);
  const [loading, setLoading] = useState(true);

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
              <MyWriteList isExpanded={isExpanded[2]} />
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
    <FlatList
      data={[{ key: 'content' }]} // 단일 항목 데이터
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
      ListFooterComponent={renderTabContent} // 탭 콘텐츠 렌더링
      keyExtractor={(item) => item.key}
    />
  );
};

const styles = StyleSheet.create({
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
  tabContentWrapper: {
    marginTop: 16,
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
});

export default MyPageScreen;
>>>>>>> ce6a63a (feat: 마이페이지에서 즐겨찾기한 아티스트, 콘서트 사진 불러오기, 게시글 기능 추가)
