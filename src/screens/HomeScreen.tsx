import { NavigationProp, useNavigation } from "@react-navigation/native";
import NavigationView from "../components/NavigationView";
import {Dimensions, Image, Text} from 'react-native';
import Sample1 from '../assets/images/sampleimg1.jpg';
import Sample2 from '../assets/images/sampleimg2.png';
import Sample3 from '../assets/images/sampleimg3.png';
import Stack from "../components/Stack";
import MenuTitle from "../components/MenuTitle";
import ConcertComponent from '../components/ConcertComponent';
import ConcertListComponent from "../components/ConcertListComponent";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import AppNavigationParamList from "../navigation/AppNavigatorParamList";

function HomeScreen () {
    const navigation = useNavigation<NavigationProp<AppNavigationParamList>>()
    const concerts = [{
        title: "concert name",
        singer: "singer",
        date: "0000.00.00",
        source: Sample1
    },{
        title: "concert name",
        singer: "singer",
        date: "0000.00.00",
        source: Sample2
    },{
        title: "concert name",
        singer: "singer",
        date: "0000.00.00",
        source: Sample3
    },{
        title: "concert name",
        singer: "singer",
        date: "0000.00.00",
        source: Sample1
    },{
        title: "concert name",
        singer: "singer",
        date: "0000.00.00",
        source: Sample2
    }]

    return (
       <NavigationView navigationViewScrollable>
        <Stack alignment="start">
            <Image
                source={Sample2}
                style={{width: Dimensions.get('window').width, height:Dimensions.get('window').width*0.6, resizeMode:"cover"}}
            />
            <Text style={{position: "absolute", 
                fontWeight:'bold', 
                fontSize: 24,
                color: 'white', 
                paddingHorizontal: 16,
                paddingTop: 170}}>카야코 아야노 내한</Text>
          </Stack>
          <MenuTitle title={"NEW"}/>
          <ConcertListComponent concerts={concerts}/>
          <MenuTitle title={"ALL"}/>
          <ConcertListComponent concerts={concerts.reverse()}/>
          <MenuTitle title={"JPOP"}/>
          <ConcertListComponent concerts={concerts}/>
        
       </NavigationView>
    )
}

export default gestureHandlerRootHOC(HomeScreen);