import { fetchAuthSession } from '@aws-amplify/auth';
import axios from 'axios';
import { Link, useFocusEffect, usePathname } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Linking, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import Swiper from 'react-native-swiper';
import { api } from '@/config.json';

interface Slide {
  src: any;
  caption: string;
}

interface Post {
  id: number;
  title: string;
}

export default function MainScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [slides, setSlides] = useState<Slide[]>([
    { src: require('@/assets/images/banner1.png'), caption: 'Example' },
    { src: require('@/assets/images/banner2.png'), caption: 'Example' },
    { src: require('@/assets/images/banner3.png'), caption: 'Example' },
    { src: require('@/assets/images/banner4.png'), caption: 'Example' },
  ]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { tokens } = await fetchAuthSession();
      const response = await axios.get('/v1/post', {
        baseURL: api.baseURL,
        headers: { Authorization: tokens?.idToken?.toString() },
      });
      const data = JSON.parse(response.data.body);
      console.log(data);
      setPosts(data.postList);
    } catch (error) {
      console.error("게시글 로드 실패:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Travelmakers</Text>
        </View>
        <View style={styles.swiperContainer}>
          <Swiper style={styles.swiper} showsPagination={true} autoplay={true}>
            {slides.map(slide => 
              <View style={styles.slide} key={slide.caption}>
                <Image source={slide.src} style={styles.image} />
              </View>
            )}
          </Swiper>
        </View>
        <Link push href={'/question1'} asChild>
          <TouchableOpacity style={styles.recommendButton}>
            <Text style={styles.recommendButtonText}>여행지 추천받기</Text>
          </TouchableOpacity>
        </Link>

        <View style={styles.boardPreview}>
          <Text style={styles.boardTitle}>최근 게시글</Text>
            {posts.length > 0 ? (
              posts.slice(0, 5).map(post => (
                <Link push href={{ pathname: '/postdetail', params: { pid: post.id} }} asChild key={post.id}>
                  <TouchableOpacity>
                    <View style={styles.boardItem}>
                      <Text style={styles.boardItemTitle}>{post.title}</Text>
                    </View>
                  </TouchableOpacity>
                </Link>
              ))
            ) : (
            [...Array(5)].map((_, index) => (
              <View style={styles.boardItem} key={index}>
                <Text style={styles.boardItemTitle}></Text>
              </View>
            ))
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  button: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'NanumGothic', 
  },
  header: {
    marginTop: 30,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  swiperContainer: {
    height: 350,
  },
  menuIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Montserrat-VariableFont_wght', 
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  swiper: {
    height: 350,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hotTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'NanumGothic', 
    textAlign: 'center',
  },
  hot: {
    color: 'red',
    fontFamily: 'NanumGothic', 
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  boardSlide: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Montserrat-VariableFont_wght', 
    marginBottom: 10,
  },
  board: {
    width: '90%',
    height: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendButton: {
    padding: 15,
    backgroundColor: '#007AFF', 
    borderRadius: 5,
    alignItems: 'center',
  },
  recommendButtonText: {
    color: '#fff',
    fontSize: 18, 
    fontWeight: 'bold',
    fontFamily: 'NanumGothic', 
  },
  boardPreview: {
    marginHorizontal: 20,
    marginTop: 30,
  },
  boardItem: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
  boardItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'NanumGothic', 
  },
  boardItemContent: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'NanumGothic', 
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#f8f8f8',
  },
  navIcon: {
    alignItems: 'center',
  },
});
