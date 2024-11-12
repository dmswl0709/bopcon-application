import { useNavigation } from "@react-navigation/native";
import { View, Button } from "react-native";

function NewContentScreen () {
    const navigation = useNavigation()
    return (
        <View>
            <Button title="btn" onPress={() => {
                navigation.navigate('HomeScreen')
            }}></Button>
        </View>
    )
}

export default NewContentScreen;