import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Alert, Modal, TextInput, Button,ScrollView } from "react-native";
import Header from "../components/Header";
import FavoriteButton from "../components/FavoriteButton"; // 즐겨찾기 버튼 임포트
import ConcertRow from "../components/ConcertRow";
import { SafeAreaView } from "react-native";
import InstagramLogo from "../assets/icons/InstagramLogo.svg";
import SpotifyLogo from "../assets/icons/SpotifyLogo.svg";
import { fetchUpcomingConcerts, fetchSongRanking, fetchPastConcerts} from "../apis/concerts";
import ArticleForm from "../components/ArticleForm";
import { format, parseISO } from "date-fns";
import axios from "axios";
import { Linking } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from '../store';
import { Article } from "../types/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode"; // 수정된 import 문
import {addComment} from "../apis/comments";



interface WriteItemProps {
  title: string;
  content: string;
  date?: string;
  nickname?: string;
  artistName?: string;
  userId: number;
}


const ArtistScreen = ({ route, navigation }) => {
  const {
    artistId = null,
    name = "Default Artist Name",
    krName = "Default Artist KR Name",
    snsUrl = "https://instagram.com",
    mediaUrl = "https://spotify.com",
  } = route.params || {};

  const [artistData, setArtistData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("곡 랭킹");
  const [visibleSongs, setVisibleSongs] = useState([]);
  const [upcomingConcerts, setUpcomingConcerts] = useState([]);
  const [pastConcerts, setPastConcerts] = useState([]); // 지난 공연 데이터 상태
  const [isCreating, setIsCreating] = useState(false); // isCreating 상태 추가
  const [boardArticles, setBoardArticles] = useState<Article[]>([]);
  const [articles, setArticles] = useState<Article[]>([]); // 초기화
  const token = useSelector((state: RootState) => state.auth.token);
  const userId = useSelector((state: RootState) => state.auth.userId); // userId 가져오기
  const user = useSelector((state: RootState) => state.auth.user);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");


  const [isEditing, setIsEditing] = useState(false); // 수정 상태
  const [selectedArticle, setSelectedArticle] = useState(null); // 선택된 게시글



  const WriteItem: React.FC<WriteItemProps> = ({ title, content, date, nickname, artistName}) => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>{content}</Text>
        <Text style={styles.meta}>
          {date} · {nickname} · {artistName}
        </Text>
      </View>
    );
  };
  

  const fetchBoardArticles = async () => {
    try {
      const response = await axios.get(`https://api.bopcon.site/api/articles/artist/${artistId}`, {
        params: {
          categoryType: "FREE_BOARD", // 필요에 따라 다른 카테고리 타입 사용
        },
      });

      const formattedArticles = response.data
        .map((article) => ({
          id: article.id,
          title: article.title,
          content: article.content,
          categoryType: article.categoryType,
          artistName: article.artistName || "Unknown Artist",
          userName: article.userName || "Anonymous",
          concertTitle: article.concertTitle || "",
          likeCount: article.likeCount || 0,
          commentCount: article.commentCount || 0,
          createdAt: new Date(article.createdAt), // 날짜 필드를 Date 객체로 변환
        }))
        .sort((a, b) => b.createdAt - a.createdAt); // 최신순 정렬

      setBoardArticles(formattedArticles);
    } catch (error) {
      console.error("게시글 데이터를 불러오는 중 오류 발생:", error.response || error.message);
      Alert.alert("오류", "게시글 데이터를 불러올 수 없습니다.");
    }
};





  
  

const handleDeleteArticle = async (article: Article) => {
  if (!token) {
    Alert.alert("오류", "로그인이 필요합니다.");
    return;
  }

  // 현재 사용자의 userName과 게시글 작성자의 userName을 비교
  if (article.userName !== user) {
    Alert.alert("권한 없음", "다른 사용자의 게시글을 삭제할 수 없습니다.");
    return;
  }

  Alert.alert("확인", "이 게시글을 정말 삭제하시겠습니까?", [
    { text: "취소", style: "cancel" },
    {
      text: "삭제",
      onPress: async () => {
        try {
          // 로컬 상태에서 먼저 게시글 제거
          setBoardArticles((prevArticles) =>
            prevArticles.filter((a) => a.id !== article.id)
          );

          // 서버로 삭제 요청
          await axios.delete(`https://api.bopcon.site/api/articles/${article.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          Alert.alert("성공", "게시글이 삭제되었습니다.");
        } catch (error) {
          console.error("게시글 삭제 오류:", error.response || error.message);
          Alert.alert("오류", "게시글을 삭제할 수 없습니다.");
        }
      },
    },
  ]);
};






  
  // 상태 변화 디버깅
useEffect(() => {
  console.log("현재 상태의 게시글 목록:", boardArticles);
}, [boardArticles]);
  
  
  
  
  
  
  
  
  
  
  // Fetch Articles Function
  const fetchArticles = async () => {
    try {
      const response = await axios.get(`https://api.bopcon.site/api/articles/artist/${artistId}`);
      return response.data.map((article: any) => ({
        id: article.id,
        title: article.title,
        content: article.content,
        categoryType: article.categoryType,
        artistName: article.artistName || "Unknown Artist",
        userName: article.userName || "Anonymous",
        concertTitle: article.concertTitle || "",
        likeCount: article.likeCount || 0,
        commentCount: article.commentCount || 0,
      }));
    } catch (error) {
      console.error("Error fetching articles:", error.response || error.message);
      return [];
    }
  };
  


  useEffect(() => {
    fetchBoardArticles();
  }, []);

  // Fetch artist data
  useEffect(() => {
    if (!artistId) {
      console.error("artistId is undefined in route.params");
      setIsLoading(false);
      return;
    }

    const fetchArtistData = async () => {
      try {
        const response = await axios.get(`https://api.bopcon.site/api/artists/${artistId}`);
        console.log("Artist API Response:", response.data);
        setArtistData(response.data);
      } catch (error) {
        console.error("Error fetching artist data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistData();
  }, [artistId]);

  useEffect(() => {
    const getUpcomingConcerts = async () => {
      try {
        const concerts = await fetchUpcomingConcerts(artistId);
        console.log("Upcoming concerts data in ArtistScreen:", concerts); // 콘솔 로그 추가
        if (concerts && concerts.length > 0) {
          setUpcomingConcerts(concerts);
        } else {
          console.warn("No upcoming concerts found. Using fallback data.");
          setUpcomingConcerts(tempConcertData); // fallback
        }
      } catch (error) {
        console.error("Error fetching upcoming concerts:", error);
        setUpcomingConcerts(tempConcertData); // fallback
      }
    };
  
    getUpcomingConcerts();
  }, [artistId]);

  // 곡 랭킹 불러오기 useEffect
  useEffect(() => {
    const loadSongRanking = async () => {
      try {
        const artistId = artistData?.artistId;

        if (!artistId) {
          console.error("artistId가 없습니다. 곡 랭킹을 불러올 수 없습니다.");
          return;
        }

        console.log(`Fetching song rankings for artistId: ${artistId}`);
        const response = await axios.get(`https://api.bopcon.site/api/artists/${artistId}/song-ranking`);
        console.log("Fetched song rankings:", response.data);

        setVisibleSongs(response.data || []); // 데이터가 없으면 빈 배열로 설정
      } catch (error) {
        console.error("Error fetching song rankings:", error);
      }
    };

    if (artistData) {
      loadSongRanking(); // artistData가 있을 때만 실행
    }
  }, [artistData]);

  // 곡 랭킹 표시
  const renderRankingContent = () => {
    const sortedSongs = visibleSongs
      .sort((a, b) => b.count - a.count) // count 기준으로 내림차순 정렬
      .slice(0, 20); // 상위 20개 선택

    return (
      <View>
        <Text style={styles.sectionTitle}>최근 20개 콘서트 기준</Text>
        {sortedSongs.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 16 }}>곡 데이터가 없습니다.</Text>
        ) : (
          <FlatList
            data={sortedSongs}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.rankRow}>
                <Text
                  style={[
                    styles.rankNumber,
                    index === 0 && styles.firstRank,
                    index === 1 && styles.secondRank,
                    index === 2 && styles.thirdRank,
                  ]}
                >
                  {index + 1 < 10 ? `0${index + 1}` : index + 1}
                </Text>
                <Text style={styles.rankSong}>{item.title}</Text>
              </View>
            )}
          />
        )}
      </View>
    );
  };

  const renderUpcomingConcerts = () => (
    <View>
      {upcomingConcerts.length > 0 ? (
        upcomingConcerts.map((concert, index) => {
          const formatWithDot = (dateArray) => {
            if (!Array.isArray(dateArray) || dateArray.length !== 3) return "";
            const [year, month, day] = dateArray;
            return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}`;
          };

          const startDay = formatWithDot(concert.startDate);
          const endDay = formatWithDot(concert.endDate);
          const displayDate = startDay === endDay ? startDay : `${startDay} ~ ${endDay}`;

          console.log("ConcertRow Props:", {
            startDay,
            endDay,
            description: concert.title,
          });

          return (
            <ConcertRow
              key={index}
              startDay={startDay}
              endDay={endDay}
              description={concert.title || "No title"}
              onPress={() =>
                navigation.navigate("ConcertScreen", {
                  concertDetails: { ...concert, startDay, endDay },
                  concertId: concert.newConcertId || `generated-id-${index}`,
                })
              }
            />
          );
        })
      ) : (
        <Text style={{ textAlign: "center", color: "gray" }}>
          내한 예정 콘서트가 없습니다.
        </Text>
      )}
    </View>
  );

  // 수정 버튼 핸들러 함수
const handleEditPress = (article) => {
  if (article.userName !== user) {
    Alert.alert("권한 없음", "다른 사용자의 게시글은 수정할 수 없습니다.");
    return;
  }

  setIsEditing(true);
  setSelectedArticle(article); // 선택된 게시글 상태 설정
};

  const handleCancelEdit = () => {
    setIsEditing(false); // 수정 모드 비활성화
    setSelectedArticle(null); // 선택된 게시글 초기화
  };

   // 수정 완료 이벤트
   const handleUpdateArticle = async (
    title,
    content,
    categoryType,
    artistId,
    concertId,
    token,
    userId
  ) => {
    try {
      const updatedArticle = {
        title,
        content,
        categoryType,
        newConcertId: concertId,
      };
  
      console.log("수정 요청 데이터:", updatedArticle);
  
      const response = await axios.put(
        `https://api.bopcon.site/api/articles/${selectedArticle.id}`,
        updatedArticle,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("수정된 게시글 응답:", response.data);
  
      // 수정된 게시글로 상태 업데이트
      setBoardArticles((prev) =>
        prev.map((article) =>
          article.id === selectedArticle.id
            ? { ...article, ...response.data } // 수정된 데이터 반영
            : article
        )
      );
  
      setIsEditing(false);
      setSelectedArticle(null);
      Alert.alert("성공", "게시글이 수정되었습니다.");
    } catch (error) {
      console.error(
        "게시글 수정 오류:",
        error.response?.data || error.message
      );
      Alert.alert("오류", "게시글 수정에 실패했습니다.");
    }
  };
  
  

  const handleEditArticle = (article: Article) => {
    if (article.userId !== userId) {
      Alert.alert("권한 없음", "다른 사용자의 게시글을 수정할 수 없습니다.");
      return;
    }
  
    setIsEditing(true);
    setSelectedArticle(article);
  };
  

  // 렌더링할 콘텐츠
  const renderBoardContent = () => {
    if (isCreating) {
      // 글쓰기 모드
      return (
        <ArticleForm
          mode="create"
          fixedArtistId={artistId}
          token={token}
          userId={userId}
          onSubmit={handleCreateArticle}
          onCancel={() => setIsCreating(false)}
        />
      );
    }
  
    if (isEditing && selectedArticle) {
      // 수정 모드
      return (
        <ArticleForm
          mode="edit"
          initialTitle={selectedArticle.title}
          initialContent={selectedArticle.content}
          initialCategoryType={selectedArticle.categoryType}
          fixedArtistId={selectedArticle.artistId}
          token={token}
          userId={userId}
          onSubmit={handleUpdateArticle} // 수정 로직 전달
          onCancel={() => {
            setIsEditing(false);
            setSelectedArticle(null);
          }}
        />
      );
    }
  
    // 게시글 목록
    return (
      <View style={styles.container}>
        {isCreating ? (
          <ArticleForm
            mode="create"
            fixedArtistId={artistId}
            token={token}
            userId={userId}
            onSubmit={handleCreateArticle} // 글쓰기 완료 핸들러
            onCancel={() => setIsCreating(false)} // 글쓰기 모드 취소
          />
        ) : (
          <>
            <FlatList
              data={boardArticles}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.boardItemContainer}
                  onPress={() => handleArticlePress(item)} // 게시글 클릭 시 모달 열기
                >
                  {/* 게시글 상단 */}
                  <View style={styles.headerRow}>
                    <Text style={styles.boardTitle}>{item.title}</Text>
                    {item.userName === user && (
                      <View style={styles.boardActions}>
                        {/* 수정 버튼 */}
                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={() => {
                            setIsEditing(true);
                            setSelectedArticle(item);
                          }}
                        >
                          <Text style={styles.actionText}>수정</Text>
                        </TouchableOpacity>
                        {/* 삭제 버튼 */}
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeleteArticle(item)}
                        >
                          <Text style={styles.actionText}>삭제</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
    
                  {/* 게시글 내용 */}
                  <Text style={styles.boardContent} numberOfLines={2}>
                    {item.content}
                  </Text>
    
                  {/* 게시글 하단 */}
                  <View style={styles.boardFooter}>
                    <Text style={styles.boardFooterText}>
                      작성자 | {item.userName || "Unknown"}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>게시글이 없습니다.</Text>
              }
            />
    
            {/* 글쓰기 버튼 */}
            {!isEditing && !isCreating && (
              <TouchableOpacity
                style={styles.writeButton}
                onPress={() => setIsCreating(true)}
              >
                <Text style={styles.writeButtonText}>글쓰기</Text>
              </TouchableOpacity>
            )}
    
            {/* 게시글 상세 보기 모달 */}
            <Modal
  visible={isModalVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={closeModal}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      {/* selectedArticle이 null이 아닐 때만 FlatList 렌더링 */}
      {selectedArticle ? (
        <FlatList
          data={[{ key: "header" }, ...comments]} // 헤더와 댓글 데이터 결합
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            // 헤더 렌더링
            if (item.key === "header") {
              return (
                <>
                  <Text style={styles.modalTitle}>{selectedArticle.title}</Text>
                  <Text style={styles.modalAuthor}>
                    작성자: {selectedArticle.userName || "Unknown"}
                  </Text>
                  <Text style={styles.modalBody}>{selectedArticle.content}</Text>
                  <Text style={styles.commentTitle}>댓글</Text>
                </>
              );
            }
            // 댓글 렌더링
            return (
              <View style={styles.commentItemContainer}>
                <Text style={styles.commentUser}>
                  {item.nickname || "익명"}:
                </Text>
                <Text style={styles.commentItem}>{item.content}</Text>
              </View>
            );
          }}
          ListFooterComponent={
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
          }
        />
      ) : (
        // 데이터 로딩 또는 예외 처리
        <Text style={styles.emptyText}>데이터를 불러오는 중...</Text>
      )}

      {/* 닫기 버튼 */}
      <TouchableOpacity
        onPress={() => {
          setNewComment(""); // 입력창 초기화
          closeModal(); // 모달 닫기
        }}
        style={styles.closeButton}
      >
        <Text style={styles.closeButtonText}>닫기</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


          </>
        )}
      </View>
    );
    
    
  };
  

   

  // 댓글 불러오기
  const fetchComments = async (id) => {
    try {
      const response = await axios.get(`https://api.bopcon.site/api/comments/article/${id}`);
      console.log("댓글 데이터:", response.data); // 응답 데이터 로그 확인
      setComments(response.data);
    } catch (error) {
      console.error("댓글 데이터를 불러오는 중 오류 발생:", error);
      Alert.alert("오류", "댓글 데이터를 불러올 수 없습니다.");
    }
  };

  // 댓글 추가
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Alert.alert('알림', '댓글을 입력해주세요.');
      return;
    }
  
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('오류', '로그인이 필요합니다.');
        return;
      }
  
      const decodedToken = jwtDecode(token);
      const fullNickname = decodedToken.sub || '익명';
      const nickname = fullNickname.includes('@')
        ? fullNickname.split('@')[0] // 이메일일 경우 '@' 앞부분만 가져옴
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
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      const newCommentData = {
        ...response.data,
        nickname: nickname, // 프론트에서 임시 닉네임 추가
      };
  
      setComments((prevComments) => [...prevComments, newCommentData]);
      setNewComment('');
      Alert.alert('성공', '댓글이 작성되었습니다.');
    } catch (error) {
      console.error('댓글 작성 오류:', error);
      Alert.alert('오류', '댓글 작성 중 문제가 발생했습니다.');
    }
  };


  // 게시글 클릭 시 모달 열기
  const handleArticlePress = (article) => {
    setSelectedArticle(article);
    setIsModalVisible(true);
    fetchComments(article.id);
  };

  // 모달 닫기
  const closeModal = () => {
    setSelectedArticle(null);
    setIsModalVisible(false);
    setComments([]);
  };

  
  
  

  const renderContent = () => {
    switch (activeTab) {
      case "곡 랭킹":
        return renderRankingContent();
      case "지난 공연":
        return renderPastConcertContent();
      case "게시판":
        return renderBoardContent(); // 게시판 렌더링 함수 추가
      default:
        return null;
    }
  };

  
  const handleCreateArticle = async (
    title,
    content,
    categoryType,
    artistId,
    newConcertId,
    token,
    id
  ) => {
    // 필수 입력값 검증
    if (!title.trim() || !content.trim()) {
      Alert.alert("오류", "제목과 내용을 모두 입력해주세요.");
      return;
    }
  
    // 사용자 인증 정보 검증
    if (!token || !id) {
      Alert.alert("로그인이 필요합니다.", "로그인 페이지로 이동합니다.", [
        {
          text: "확인",
          onPress: () => navigation.navigate("LoginScreen"),
        },
        { text: "취소", style: "cancel" },
      ]);
      return;
    }
  
    // newConcertId 검증 및 처리
    const validNewConcertId =
      categoryType === "NEW_CONCERT" && typeof newConcertId === "number" && newConcertId > 0
        ? newConcertId
        : null;
  
    // 요청 데이터 생성
    const requestData = {
      title,
      content,
      categoryType,
      artistId,
      newConcertId: validNewConcertId,
    };
    
    
    console.log("요청 데이터:", requestData);
  
    try {
      const response = await axios.post(
        `https://api.bopcon.site/api/articles`,
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      console.log("응답 데이터:", response.data);
      Alert.alert("성공", "게시글이 작성되었습니다.");
      setIsCreating(false); // 게시글 작성 상태 업데이트
      await fetchBoardArticles(); // 게시글 목록 새로고침
    } catch (error) {
      if (error.response) {
        console.error("서버 응답 오류:", error.response.status, error.response.data);
        Alert.alert(
          "오류",
          `게시글 작성 실패: ${error.response.data.message || "알 수 없는 오류"}`
        );
      } else {
        console.error("요청 오류:", error.message);
        Alert.alert("오류", "서버와 통신 중 문제가 발생했습니다. 네트워크를 확인해주세요.");
      }
    }
  };

  
  
  
  
  
  
  
  
  
  

  // 지난 공연 데이터를 로드
  useEffect(() => {
    const loadPastConcerts = async () => {
      try {
        if (!artistId) {
          console.error("artistId가 없습니다. API 요청을 중단합니다.");
          return;
        }
    
        const response = await axios.get(`https://api.bopcon.site/api/artists/${artistId}/past-concerts`);
        console.log("Past concerts response:", response.data); // 응답 데이터 확인
    
        if (Array.isArray(response.data)) {
          setPastConcerts(response.data);
        } else {
          console.error("API 응답이 배열 형태가 아닙니다. 빈 배열로 설정합니다.");
          setPastConcerts([]);
        }
      } catch (error) {
        console.error("과거 콘서트를 불러오는 중 오류 발생:", error);
      }
    };

    if (artistData) {
      loadPastConcerts();
    }
  }, [artistData]);

  const renderPastConcertContent = () => (
    <View style={{ paddingHorizontal: 16 }}>
    {pastConcerts.length > 0 ? (
      pastConcerts.map((concert, index) => {
        const formatWithDot = (dateArray) => {
          if (!Array.isArray(dateArray) || dateArray.length !== 3) return "";
          const [year, month, day] = dateArray;
          return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}`;
        };

        const startDay = formatWithDot(concert.startDate || concert.date);
        const endDay = formatWithDot(concert.endDate || concert.date);

        // `concert.date`에서 `year`, `month`, `day`를 안전하게 추출
        const year = concert.date?.[0];
        const month = concert.date?.[1];
        const day = concert.date?.[2];
        
        // 날짜가 없을 경우 로그를 남기고 해당 항목을 렌더링하지 않음
        if (!year || !month || !day) {
          console.warn("Invalid date format for concert:", concert);
          return null;
         }

          return (
            <ConcertRow
              key={concert.pastConcertId}
              startDay={startDay}
              endDay={endDay}
              description={concert.title || `${concert.venueName || ""}, ${concert.cityName || ""}` || "공연 제목 없음"}
              onPress={() =>
                navigation.navigate("SetListScreen", {
                  artistId, // 현재 아티스트 ID 전달
                  pastConcertId: concert.pastConcertId, // 선택한 공연 ID 전달
                  title: concert.title || "Unknown Concert", // 제목 전달
                  venueName: concert.venueName || "Unknown Venue", // 공연장 정보 전달
                  cityName: concert.cityName || "Unknown City", // 도시 정보 전달
                })
              }
            />
          );
        })
      ) : (
        <Text style={{ textAlign: "center", color: "gray", marginTop: 16 }}>
          지난 공연 데이터가 없습니다.
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Header title="Artist" onBackPress={() => navigation.goBack()} />
            <View style={styles.artistInfoSection}>
              <Image source={{ uri: artistData?.imgUrl }} style={styles.artistImage} />
              <View style={styles.socialMediaRow}>
                <TouchableOpacity onPress={() => Linking.openURL(artistData?.snsUrl || snsUrl)}>
                  <InstagramLogo width={40} height={40} style={styles.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL(artistData?.mediaUrl || mediaUrl)}>
                  <SpotifyLogo width={40} height={40} style={styles.socialIcon} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.artistNameRow}>
              <View style={styles.artistNameContainer}>
                <Text style={styles.artistName}>{artistData?.name || name}</Text>
                <Text style={styles.artistKrName}>{artistData?.krName || krName}</Text>
              </View>
              {/* 즐겨찾기 버튼 추가 */}
              <FavoriteButton id={artistId} type="artist" />
            </View>
            <Text style={styles.upcomingTitle}>내한 예정</Text>
            {renderUpcomingConcerts()}
            <View style={styles.tabRow}>
              {["곡 랭킹", "지난 공연", "게시판"].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={[
                    styles.tabButton,
                    activeTab === tab && styles.activeTabButton,
                  ]}
                >
                  <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
        data={[]} // 콘텐츠는 렌더링하지 않음
        renderItem={null}
        ListFooterComponent={renderContent()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  modalScroll: {
    flexGrow: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "left",
  },
  modalAuthor: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    textAlign: "left",
  },
  modalBody: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "left",
  },
  commentSection: {
    flex: 1,
    marginBottom: 16,
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  commentItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  commentUser: {
    fontWeight: "bold",
    marginRight: 8,
  },
  commentItem: {
    flexShrink: 1,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  commentButton: {
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  commentButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
 
  
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
  },
  boardItemContainer: {
    padding: 16, // 게시글 전체 패딩
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 8, // 게시글 간 간격
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8, // 제목과 내용 사이 간격
  },
  boardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1, // 제목이 버튼을 밀지 않도록 flex로 공간 확보
    marginRight: 8, // 버튼과 간격
  },
  boardActions: {
    flexDirection: "row",
  },
  editButton: {
    marginRight: 8,
    backgroundColor: "#80B5E7",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  deleteButton: {
    backgroundColor: "#ED9CA5",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  actionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  boardItemContent: {
    marginTop: 8, // 제목과 내용 사이 간격
  },
  boardContent: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8, // 내용과 작성자 정보 사이 간격
  },
  boardFooter: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  boardFooterText: {
    fontSize: 12,
    color: "#999",
  },
  emptyText: {
    textAlign: "center",
    color: "#555",
    fontSize: 16,
    marginTop: 20,
  },
  writeButton: {
    backgroundColor: "#000",
    padding: 14,
    alignItems: "center",
    marginVertical: 16,
    borderRadius: 8,
  },
  writeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },


 

  
  headerContainer: {
    marginTop: -55,
    paddingHorizontal: 16,
  },
  artistInfoSection: {
    alignItems: "center", // 이미지와 로고를 수직 중앙 정렬
    marginBottom: 16, // 전체 섹션 아래 여백
  },
  artistImage: {
    width: 220,
    height: 220,
    borderRadius: 2,
    resizeMode: "cover",
    marginBottom: 10, // 로고와의 간격
  },
  socialMediaRow: {
    flexDirection: "row", // 로고들을 가로로 정렬
    justifyContent: "center", // 가로 중앙 정렬
    marginTop: 10, // 이미지와 로고 간 간격
  },
  socialIcon: {
    marginHorizontal: 15, // 로고 간 간격
  },  
  artistNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  artistName: {
    fontSize: 22, // 기존 크기 유지
    fontWeight: "bold",
    marginBottom: 4,
  },
  artistKrName: {
    fontSize: 16, // 크기를 살짝 줄임
    fontWeight: "normal", // bold 제거, regular로 설정
    color: "gray", // 약간의 시각적 구분을 위해 색상 변경 (옵션)
  },
  artistDetail: {
    fontSize: 14,
    color: "gray",
  },
  upcomingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  divider1: {
    borderBottomWidth: 2,
    borderBottomColor: "black",
    marginBottom: 16,
    width: "98%",
    marginLeft: 2,
  },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTabButton: {
    borderBottomColor: "black",
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    color: "gray",
  },
  activeTabText: {
    color: "black",
  },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginLeft: 16,
  },
  rankNumber: {
    width: 32,
    textAlign: "center",
    fontWeight: "bold",
    marginRight: 8,
    marginLeft: 16,
  },
  firstRank: {
    backgroundColor: "yellow",
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  secondRank: {
    backgroundColor: "lightgray",
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  thirdRank: {
    backgroundColor: "gold",
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  rankSong: {
    flex: 1,
  },
  moreButton: {
    textAlign: "center",
    marginTop: 16,
    color: "gray",
  },
  concertRowContainer: {
    marginLeft: 16,
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: "black",
    marginBottom: 16,
    marginLeft: 5,
    marginRight: 16,
    alignSelf: "stretch",
  },
  boardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 15,
  },
  boardRow: {
    marginBottom: 16,
  },
  
  
  boardDate: {
    fontSize: 12,
    color: "gray",
    marginLeft: 16,
  },
  lightDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    marginBottom: 16,
  },
  moreButtonGray: {
    textAlign: "center",
    color: "gray",
    marginRight: 32,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    marginLeft: 16,
    marginBottom: 12,
  },
});

export default ArtistScreen;