import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import FavoriteButton from '../components/FavoriteButton';
import SetlistItem from '../components/SetlistItem';
import { selectSetlist } from '../store/utils/selectors';

const SetListScreen = ({ route, navigation }) => {
  const { concertName, venueName, location } = route.params;

  // Redux 상태에서 setlist를 가져옵니다.
  const setlistFromRedux = useSelector(selectSetlist);

  // Redux 데이터가 없는 경우 임시 데이터를 사용합니다.
  const setlist = setlistFromRedux.length > 0
    ? setlistFromRedux
    : [
        " Song 1",
        " Song 2",
        " Song 3",
        " Song 4",
        " Song 5",
        " Song 6",
        " Song 7",
        " Song 8",
        " Song 9",
        " Song 10",
      ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Setlist" onBackPress={() => navigation.goBack()} />

      {/* Concert Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/images/sampleimg4.png')}
          style={styles.concertImage}
        />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.concertInfoRow}>
          {/* Concert Info */}
          <Text style={styles.concertName}>{concertName || 'Concert Name'}</Text>
          {/* Favorite Button */}
          <FavoriteButton />
        </View>
        <Text style={styles.venueName}>{venueName || 'Venue Name'}</Text>
        <Text style={styles.location}>{location || 'Location'}</Text>
      </View>

      {/* Setlist Title */}
      <Text style={styles.setlistTitle}>셋리스트</Text>
      <View style={styles.divider} />

      {/* Display Setlist Items */}
      {setlist.length > 0 ? (
        <FlatList
          data={setlist}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <SetlistItem key={index} index={index + 1} songName={item} />
          )}
        />
      ) : (
        <Text style={styles.noSetlist}>셋리스트 정보 없음</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  concertImage: {
    width: '80%',
    height: undefined,
    aspectRatio: 16 / 9,
    resizeMode: 'contain',
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  concertInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  concertName: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Pretendard-Bold',
    flex: 1,
  },
  venueName: {
    fontSize: 15,
    fontFamily: 'Pretendard-Regular',
    marginTop: 4,
    textAlign: 'left',
  },
  location: {
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
    marginTop: 4,
    textAlign: 'left',
  },
  setlistTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Pretendard-Bold',
    marginHorizontal: 16,
    marginTop: 24,
  },
  divider: {
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    width: '92%',
    alignSelf: 'center',
    marginVertical: 8,
  },
  noSetlist: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginTop: 16,
    fontFamily: 'Pretendard-Regular',
  },
});

export default SetListScreen;