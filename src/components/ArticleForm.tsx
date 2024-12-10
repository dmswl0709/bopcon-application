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

interface ArticleFormProps {
  mode: "create" | "edit";
  initialTitle?: string;
  initialContent?: string;
  initialCategoryType?: "FREE_BOARD" | "NEW_CONCERT";
  fixedArtistId?: number | null;
  artistName?: string;
  initialNewConcertId?: number | null;
  token: string;
  userId: number; // userId 추가
  onSubmit: (
    title: string,
    content: string,
    categoryType: "FREE_BOARD" | "NEW_CONCERT",
    artistId: number | null,
    newConcertId: number | null,
    token: string,
    userId: number
  ) => void;
  onCancel: () => void;
}

const ArticleForm: React.FC<ArticleFormProps> = ({
  mode,
  initialTitle = "",
  initialContent = "",
  initialCategoryType = "FREE_BOARD",
  fixedArtistId = null,
  artistName,
  initialNewConcertId = null,
  token,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [categoryType, setCategoryType] = useState(initialCategoryType);
  const [newConcertId, setNewConcertId] = useState<number | null>(
    initialNewConcertId
  );
  const [isModalVisible, setModalVisible] = useState(false);
  const userId = useSelector((state: any) => state.auth.userId);


  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert("오류", "userId가 누락되었습니다. 다시 로그인해주세요.");
      return;
    }
  
    const validNewConcertId =
      categoryType === "NEW_CONCERT" && newConcertId
        ? newConcertId
        : null;
  
    const requestData = {
      title: title.trim(),
      content: content.trim(),
      categoryType,
      artistId: fixedArtistId,
      newConcertId: validNewConcertId,
      token,
      userId, // userId 포함
    };
  
    console.log("요청 데이터:", requestData);
  
    try {
      await onSubmit(
        title.trim(),
        content.trim(),
        categoryType,
        fixedArtistId,
        validNewConcertId,
        token,
        userId // 전달
      );
      Alert.alert("성공", "게시글이 작성되었습니다.");
    } catch (error) {
      console.error("Error during submission:", error);
      Alert.alert("오류", "게시글 처리 중 문제가 발생했습니다.");
    }
  };
  

  const options = [
    { label: "자유게시판", value: "FREE_BOARD" },
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
                    setCategoryType(item.value as "FREE_BOARD" | "NEW_CONCERT");
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
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  artistInfo: {
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  artistLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
  },
  artistName: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f9f9f9",
    marginBottom: 16,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
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
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#555",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ArticleForm;
