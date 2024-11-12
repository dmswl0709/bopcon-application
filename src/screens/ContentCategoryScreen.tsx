import { useNavigation } from "@react-navigation/native";
import Layout from "../components/Layout";
import { Text } from "react-native";
import AppNavigationParamList from "../navigation/AppNavigatorParamList";
import { StackScreenProps } from "@react-navigation/stack";
import LoginForm from "../components/LoginForm";

export type ContentCategoryScreenProps = StackScreenProps<AppNavigationParamList, "ContentCategoryScreen">


const ContentCategoryScreen = ({route}: ContentCategoryScreenProps ) => {
    return (
      <Layout>
        <Text>{route.params.name}</Text>
      </Layout>
    );
  };
  
  export default ContentCategoryScreen;