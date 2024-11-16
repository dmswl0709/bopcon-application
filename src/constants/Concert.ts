import { ImageSourcePropType } from "react-native";

type Concert = {
  source: ImageSourcePropType | undefined;
  title: String;
  details: string;
  date: string;
  location: string;
  ticket: string;
  setlist: string[];
  singer: String;
  navigateName?: String;
};

export default Concert;
