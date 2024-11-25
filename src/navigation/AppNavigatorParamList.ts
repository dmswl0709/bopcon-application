import Concert from "../constants/Concert";
import { ContentCategoryScreenProps } from "../screens/ContentCategoryScreen";

type AppNavigationParamList = {
  HomeScreen: undefined;
  MenuScreen: undefined;
  LoginScreen: undefined;
  SignUpScreen: undefined;
  ContentScreen: undefined;
  ContentCategoryScreen: { name: string; type: string };
  ConcertScreen: {
    concert: {
      image: string;
      title: string;
      details: string;
      date: string;
      location: string;
      ticket: string;
      setlist: string[];
      singer: string;
      navigateName?: string;
    };
  };
  PastSetListScreen: {
    artistName: string; // Artist name to display at the top of the screen
  };
  SetListScreen: {
    concertName: string; // The name of the concert
    venueName: string; // The name of the venue
    location: string; // The location of the concert
    setlist: string[]; // Array of setlist items
  };
  ArtistScreen: {
    artistId?: string;
    artistName: string; // Artist's name
    artistDetail: string; // Brief description of the artist
    instagramUrl?: string; // Instagram profile URL
    spotifyUrl?: string; // Spotify profile URL
  };
};

export default AppNavigationParamList;
