import { StyleSheet,Image,TouchableOpacity} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import Swiper from 'react-native-swiper';
export default function TabOneScreen() {
  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.menuIcon}>≡</Text>
      <Text style={styles.title}>TRAVELMAKRERS</Text>
      <Text style={styles.cartIcon}>🛒</Text>
    </View>
    <View style={styles.main}>
      <Text style={styles.hotTitle}>
        지금 <Text style={styles.hot}>HOT</Text>한 여행지
      </Text>
      </View>
      <Swiper style={styles.hotTravel} showsPagination={false} autoplay>
        <Image source={require('@/assets/images/car.jpg')} style={styles.image} />
        <Image source={require('@/assets/images/icon.png')} style={styles.image} />
        <Image source={require('@/assets/images/logo.jpg')} style={styles.image} />
        <Image source={require('@/assets/images/splash.png')} style={styles.image} />
      </Swiper>
      <TouchableOpacity style={styles.recommendButton}>
        <Text style={styles.recommendButtonText}>여행지 추천받기</Text>
      </TouchableOpacity>
      <View style={styles.boardSection}>
        <Text style={styles.boardTitle}>여행자 게시판</Text>
        
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f4f4f4',
  },
  menuIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff69b4',
  },
  cartIcon: {
    fontSize: 24,
  },
  main: {
    flex: 1,
    alignItems: 'center',
  },
  hotTitle: {
    fontSize: 20,
    marginTop: 20,
  },
  hot: {
    color: 'red',
    fontSize: 24,
  },
  hotTravel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 20,
  },
  image: {
    width: 300,
    height: 200,
    margin: 5,
    resizeMode: 'cover',
  },
  recommendButton: {
    padding: 10,
    backgroundColor: '#eee',
    marginVertical: 20,
  },
  recommendButtonText: {
    fontSize: 18,
  },
  boardSection: {
    alignItems: 'center',
  },
  boardTitle: {
    fontSize: 18,
  },
  boardImage: {
    width: '90%',
    height: 200,
    marginTop: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f4f4f4',
  },
  navIcon: {
    alignItems: 'center',
  },

});
