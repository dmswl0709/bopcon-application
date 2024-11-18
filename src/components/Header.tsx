import React from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import AppNavigationParamList from "../navigation/AppNavigatorParamList";
import BOPCONLogo from "../assets/icons/BOPCONLogo.svg";

type HeaderProps = {
  onBackPress?: () => void; // onBackPress는 선택 사항으로 설정
};

const Header: React.FC<HeaderProps> = ({ onBackPress }) => {
  const navigation = useNavigation<NavigationProp<AppNavigationParamList>>();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const handleLogoPress = () => {
    navigation.navigate("HomeScreen");
  };

  return (
    <View style={styles.header}>
      {/* Back Button */}
      <TouchableOpacity onPress={handleBackPress} style={styles.iconContainer}>
        <Image
          source={require("../assets/icons/Backicon.png")}
          style={styles.icon}
        />
      </TouchableOpacity>

      {/* Spacer */}
      <View style={{ flex: 1 }} />

      {/* Logo */}
      <TouchableOpacity onPress={handleLogoPress} style={[styles.iconContainer, styles.alignContent, {marginRight: 10}]}>
        <BOPCONLogo width={110} height={40} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-end", // 아이콘과 로고를 아래로 정렬
    paddingHorizontal: 16,
    borderBottomColor: "#ddd",
    backgroundColor: "white",
    height: 100, // Header의 전체 높이를 늘려서 아래로 정렬
  },
   iconContainer: {
   marginBottom: 2, // 개별 아이콘을 아래로 내림
  },
   icon: {
    width: 20, // Backicon 크기 조정
    height: 40, // Backicon 크기 조정
    resizeMode: "contain",
  },
  alignContent: {
    justifyContent: "flex-end", // 아이콘과 로고의 위치를 아래로 정렬
  },
});

export default Header;
