import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native"; // navigation 추가

const ArticleForm = ({
  mode,
  initialTitle = "",
  initialContent = "",
  initialCategoryType = "FREE_BOARD",
  fixedArtistId = null,
  artistName,
  initialNewConcertId = null,
  token,
  userId,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [categoryType, setCategoryType] = useState(initialCategoryType);
  const [newConcertId, setNewConcertId] = useState(initialNewConcertId);
  const [isModalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation(); // navigation 사용

  const handleSubmit = async () => {
    if (!token || token.trim() === "") {
      Alert.alert("오류", "유효하지 않은 토큰입니다. 다시 로그인해주세요.");
      return;
    }

    if (!userId) {
      Alert.alert("오류", "로그인이 필요합니다. 다시 로그인해주세요.", [
        {
          text: "확인",
          onPress: () => navigation.navigate("LoginScreen"), // 로그인 스크린으로 이동
        },
      ]);
      return;
    }

    if (typeof onSubmit !== "function") {
      console.error("onSubmit이 함수가 아닙니다. props를 확인해주세요.");
      Alert.alert("오류", "onSubmit 함수가 정의되지 않았습니다.");
      return;
    }

    const validNewConcertId =
      categoryType === "NEW_CONCERT" && newConcertId ? newConcertId : null;

    try {
      await onSubmit(
        title.trim(),
        content.trim(),
        categoryType,
        fixedArtistId,
        validNewConcertId,
        token,
        userId
      );
    } catch (error) {
      console.error("게시글 작성 중 오류:", error);
      Alert.alert("오류", "게시글 작성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const options = [
    { label: "자유 게시판", value: "FREE_BOARD" },
    { label: "콘서트 게시판", value: "NEW_CONCERT" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {mode === "create" ? "글쓰기" : "글 수정"}
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
        maxLength={50}
      />
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="내용"
        style={[styles.input, styles.textarea]}
        multiline
        maxLength={500}
      />

      <Text style={styles.label}>게시판 선택</Text>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.dropdownButtonText}>
          {options.find((opt) => opt.value === categoryType)?.label || "선택"}
        </Text>
      </TouchableOpacity>

      {categoryType === "NEW_CONCERT" && (
        <TextInput
          style={styles.input}
          placeholder="콘서트 ID 입력"
          keyboardType="number-pad"
          value={newConcertId ? newConcertId.toString() : ""}
          onChangeText={(text) => setNewConcertId(Number(text) || null)}
        />
      )}

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setCategoryType(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.buttonText}>
            {mode === "create" ? "작성" : "수정"}
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
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    margin: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  artistInfo: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  artistLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#888",
    marginBottom: 4,
  },
  artistName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  textarea: {
    height: 120,
    textAlignVertical: "top",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#555",
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#555",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
  },
  modalItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  submitButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ArticleForm;
