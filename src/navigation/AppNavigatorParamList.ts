import { ContentCategoryScreenProps } from "../screens/ContentCategoryScreen";

type AppNavigationParamList = {
    HomeScreen: undefined;
    MenuScreen: undefined;
    LoginScreen: undefined;
    SignUpScreen: undefined;
    NewContentScreen: undefined;
    ContentCategoryScreen: {name: String; type: String;};
    NEW: undefined;
    ALL: undefined;
    POP: undefined;
    ROCK: undefined;
    JPOP: undefined;
    HIPHOP:undefined;
    RnB: undefined;
};

export default AppNavigationParamList;