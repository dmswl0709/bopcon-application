import { NavigationProp, useNavigation } from "@react-navigation/native";
import { View, Button } from "react-native";
import AppNavigationParamList from "../navigation/AppNavigatorParamList";

function ContentScreen () {
    const navigation = useNavigation<NavigationProp<AppNavigationParamList>>()
    return (
        <View>
            <Button title="btn" onPress={() => {
                navigation.navigate('HomeScreen')
            }}></Button>
        </View>
    )
}

export default ContentScreen;