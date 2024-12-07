import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import GlobalList from '../components/GlobalList';
import MoreButton from '../components/MoreButton';
import Select from '../components/Select';
import MyConcert from '../components/MyConcert';
import MyArtist from '../components/MyArtist';
import MyWriteList from '../components/MyWriteList';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import PersonIcon from '../assets/icons/Person.svg';
import LogoutIcon from '../assets/icons/exit.svg';
import BackIcon from '../assets/icons/behind.svg';

const MyPageScreen = () => {
  const [isExpanded, setIsExpanded] = useState([false, false, false]);
  const [activeTab, setActiveTab] = useState(0);
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);

  // Log out user
  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate('LoginScreen');
  };

  // Go back handler
  const handleGoBack = () => {
    navigation.goBack();
  };

  // Handle loading state
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user && token) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [user, token]);

  const sections = [
    {
      key: 'favorites',
      title: '즐겨찾기',
      content: (
        <>
          <GlobalList title="아티스트" />
          <View style={styles.itemsContainer}>
            <MyArtist isExpanded={isExpanded[0]} />
          </View>
          <MoreButton
            isExpanded={isExpanded[0]}
            onToggle={() => toggleExpand(0)}
          />
          <GlobalList title="콘서트" />
          <View style={styles.itemsContainer}>
            <MyConcert isExpanded={isExpanded[1]} />
          </View>
          <MoreButton
            isExpanded={isExpanded[1]}
            onToggle={() => toggleExpand(1)}
          />
        </>
      ),
    },
    {
      key: 'posts',
      title: '게시물',
      content: (
        <>
          <GlobalList title="게시물" />
          <View style={styles.itemsContainer}>
            <MyWriteList isExpanded={isExpanded[2]} />
          </View>
          <MoreButton
            isExpanded={isExpanded[2]}
            onToggle={() => toggleExpand(2)}
          />
        </>
      ),
    },
  ];

  const toggleExpand = (index: number) => {
    setIsExpanded((prev) =>
      prev.map((item, i) => (i === index ? !item : item))
    );
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
    <SafeAreaView style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.navigationBar}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <BackIcon width={24} height={24} fill="#000" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>mypage</Text>
      </View>

      {/* User Section */}
      <View style={styles.userSection}>
        <PersonIcon width={50} height={50} style={styles.userIcon} />
        <Text style={styles.userText}>{user}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogoutIcon width={24} height={24} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.selectSection}>
        <Select
          tabs={sections.map((section) => section.title)}
          sectionRefs={sections.map(() => React.createRef())}
          activeTab={activeTab}
          onTabPress={(index) => setActiveTab(index)}
        />
      </View>

      {/* Sections */}
      <FlatList
        data={sections}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={styles.section}>{item.content}</View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    opacity: 0.9,
  },
  backButton: {
    marginRight: 16,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  userSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  userIcon: {
    marginBottom: 10,
  },
  userText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    marginTop: 10,
  },
  selectSection: {
    marginTop: 4,
  },
  listContainer: {
    paddingBottom: 20,
  },
  section: {
    marginTop: 4,
    paddingHorizontal: 16,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default MyPageScreen;