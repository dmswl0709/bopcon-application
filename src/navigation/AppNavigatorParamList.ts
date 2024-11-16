import Concert from "../constants/Concert";
import { ContentCategoryScreenProps } from "../screens/ContentCategoryScreen";

type AppNavigationParamList = {
    HomeScreen: undefined;
    MenuScreen: undefined;
    LoginScreen: undefined;
    SignUpScreen: undefined;
    ContentScreen: undefined;
    ContentCategoryScreen: { name: string; type: string };
    ConcertScreen: { concert: { 
        image: string; 
        title: string; 
        details: string; 
        date: string; 
        location: string; 
        ticket: string; 
        setlist: string[]; 
    }};
};

export default AppNavigationParamList;