import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, router, useLocalSearchParams } from 'expo-router';

interface Post {
  id: string;
  title: string;
  author: string;
}

interface PostListProps {
  navigation: any;
  route: {
    params: {
      refresh?: boolean; // refresh가 전달될 수 있음
    };
  };
}

const { width } = Dimensions.get('window');

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([{
    id: "1",
    title: "TestPost",
    author: "Tester"
  }]);
  const { post } = useLocalSearchParams();

  const loadPosts = async () => {
    try {
      const storedPosts = await AsyncStorage.getItem('posts');
      if (storedPosts) {
        setPosts(JSON.parse(storedPosts));
      }
    } catch (error) {
      console.error("게시글 로드 실패:", error);
    }
  };

  useEffect(() => {
    loadPosts(); // 컴포넌트가 마운트될 때 게시글 로드
  }, []);

  // useEffect(() => {
  //   if (route.params?.refresh) {
  //     loadPosts(); // 새 게시글 작성 후 목록 갱신
  //   }
  // }, [route.params?.refresh]);

  // const handlePressPost = (post: Post) => {
  //   Link('PostDetail', { post });
  // };

  // 테스트용 삭제 필
  const tpost: string = JSON.stringify({
    id: '1',
    title: 'test01',
    author: 'tester01',
    content: 'testing'
  })

  return (
    <View style={styles.container}>
      {posts.length > 0 ? <FlatList
        data={posts}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.post} >
            <Link href={{ pathname: "/postdetail", params: { item: JSON.stringify(item) }}}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.author}>작성자: {item.author}</Text>
            </Link>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
      : <Text>표시할 내용이 없습니다.</Text>}
      <TouchableOpacity style={styles.addButton} onPress={() => router.navigate('/postform')}>
        <Text style={styles.addButtonText}>새 게시글 작성</Text>
      </TouchableOpacity>
      <Link href={{ pathname: "/postdetail", params: { item: tpost }}}>
        <Text>테스트</Text>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 70,
    backgroundColor: '#F9FFFF', // 배경색을 QoneScreen과 동일하게 설정
  },
  post: {
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#ffffff', // 게시글 배경색
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Jua-Regular',
    color: '#007aff',
  },
  author: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'Jua-Regular',
  },
  addButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#007aff', // 버튼 색상
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Jua-Regular',
  },
});


export default PostList;