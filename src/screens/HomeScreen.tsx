import { NavigationProp, useNavigation } from "@react-navigation/native";
import NavigationView from "../components/NavigationView";
import { Dimensions, Image, Text } from "react-native";
import Sample1 from '../assets/images/sampleimg1.jpg';
import Sample2 from '../assets/images/sampleimg2.png';
import Sample3 from '../assets/images/sampleimg3.png';
import Stack from "../components/Stack";
import MenuTitle from "../components/MenuTitle";
import ConcertListComponent from "../components/ConcertListComponent";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import AppNavigationParamList from "../navigation/AppNavigatorParamList";
import AppNavigatorParamList from "../navigation/AppNavigatorParamList";

function HomeScreen() {
  const navigation = useNavigation<NavigationProp<AppNavigatorParamList>>();
  const concert = [
    {
      source: Sample1,
      title: "concert name",
      details: "디테일",
      date: "0000.00.00",
      location: "서울 고척돔",
      ticket: "가수티켓",
      setlist: ["첫 번째 곡 : Up", "두 번째 곡 : Happy", "세 번째 곡 : How sweet"],
      singer: "singer",
    },
    {
      source: Sample2,
      title: "concert name",
      details: "디테일",
      date: "0000.00.00",
      location: "서울 고척돔",
      ticket: "가수티켓",
      setlist: ["첫 번째 곡 : Up", "두 번째 곡 : Happy", "세 번째 곡 : How sweet"],
      singer: "singer",
    },
    {
      source: Sample3,
      title: "concert name",
      details: "디테일",
      date: "0000.00.00",
      location: "서울 고척돔",
      ticket: "가수티켓",
      setlist: ["첫 번째 곡 : Up", "두 번째 곡 : Happy", "세 번째 곡 : How sweet"],
      singer: "singer",
    },
    {
      source: Sample1,
      title: "concert name",
      details: "디테일",
      date: "0000.00.00",
      location: "서울 고척돔",
      ticket: "가수티켓",
      setlist: ["첫 번째 곡 : Up", "두 번째 곡 : Happy", "세 번째 곡 : How sweet"],
      singer: "singer",
    },
    {
      source: Sample2,
      title: "concert name",
      details: "디테일",
      date: "0000.00.00",
      location: "서울 고척돔",
      ticket: "가수티켓",
      setlist: ["첫 번째 곡 : Up", "두 번째 곡 : Happy", "세 번째 곡 : How sweet"],
      singer: "singer",
    },
  ];

  return (
    <NavigationView navigationViewScrollable>
      <Stack alignment="start">
        <Image
          source={Sample2}
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").width * 0.6,
            resizeMode: "cover",
          }}
        />
        <Text
          style={{
            position: "absolute",
            fontWeight: "bold",
            fontSize: 24,
            color: "white",
            paddingHorizontal: 16,
            paddingTop: Dimensions.get("window").height * 0.2,
          }}
        >
         카야코 아야노 내한
        </Text>
      </Stack>
      <MenuTitle title={"NEW"} />
      <ConcertListComponent horizontal concerts={concert} />
      <MenuTitle title={"JPOP"} />
      <ConcertListComponent horizontal concerts={concert} />
      <MenuTitle title={"POP"} />
      <ConcertListComponent horizontal concerts={concert} />
    </NavigationView>
  );
}

export default gestureHandlerRootHOC(HomeScreen);
