import { ContentCategoryScreenProps } from "../screens/ContentCategoryScreen";

type AppNavigationParamList = {
    HomeScreen: undefined;
    MenuScreen: undefined;
    LoginScreen: undefined;
    SignUpScreen: undefined;
    NewContentScreen: undefined;
    ContentCategoryScreen: {name: String; type: String;};
};

export default AppNavigationParamList;