import { ImageSourcePropType } from "react-native";

type Concert {
    title: String;
    singer: String;
    date: String;
    source: ImageSourcePropType | undefined;
    navigateName?: String;
}

export default Concert;