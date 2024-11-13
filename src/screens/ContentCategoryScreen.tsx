import { Text, StyleSheet, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import AppNavigationParamList from "../navigation/AppNavigatorParamList";
import NavigationView from "../components/NavigationView";
import ConcertListComponent from "../components/ConcertListComponent";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { TouchableOpacity } from 'react-native-gesture-handler';
import Sample1 from '../assets/images/sampleimg1.jpg';

export type ContentCategoryScreenProps = StackScreenProps<AppNavigationParamList, "ContentCategoryScreen">;

const ContentCategoryScreen = ({ route }: ContentCategoryScreenProps) => {
  const { name } = route.params;

  // 샘플 데이터
  const data = [
    { id: '1', title: 'sample', name: 'name', singer: 'String', date: '1111.11.11', source: Sample1 },
    { id: '2', title: 'sample', name: 'name', singer: 'String', date: '1111.11.11', source: Sample1 },
    { id: '3', title: 'sample', name: 'name', singer: 'String', date: '1111.11.11', source: Sample1 },
    { id: '4', title: 'sample', name: 'name', singer: 'String', date: '1111.11.11', source: Sample1 },
    { id: '5', title: 'sample', name: 'name', singer: 'String', date: '1111.11.11', source: Sample1 },
    { id: '6', title: 'sample', name: 'name', singer: 'String', date: '1111.11.11', source: Sample1 },
    { id: '7', title: 'sample', name: 'name', singer: 'String', date: '1111.11.11', source: Sample1 },
    { id: '8', title: 'sample', name: 'name', singer: 'String', date: '1111.11.11', source: Sample1 },
  ];

  return (
    <NavigationView>
      <View style={styles.container}>
        <Text style={styles.header}>{name}</Text>
        {/* ConcertListComponent 자체가 스크롤 가능하도록 설정 */}
        <ConcertListComponent concerts={data} horizontal={false} />
      </View>
    </NavigationView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    marginLeft: 20,
  },
});

export default gestureHandlerRootHOC(ContentCategoryScreen);
