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
    concertId: string;
  };
  PastSetListScreen: {
    artistId: string;
  };
  SetListScreen: {
    concertName: string; // The name of the concert
    venueName: string; // The name of the venue
    location: string; // The location of the concert
  };
  ArtistScreen: {
    artistId?: string;
    artistName: string; // Artist's name
    artistDetail: string; // Brief description of the artist
    instagramUrl?: string; // Instagram profile URL
    spotifyUrl?: string; // Spotify profile URL
  };
}

export default AppNavigationParamList;
