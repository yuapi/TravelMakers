import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const PostList = ({ navigation, route }: PostListProps) => {
  const [posts, setPosts] = useState<Post[]>([]);

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

  useEffect(() => {
    if (route.params?.refresh) {
      loadPosts(); // 새 게시글 작성 후 목록 갱신
    }
  }, [route.params?.refresh]);

  const handlePressPost = (post: Post) => {
    navigation.navigate('PostDetail', { post });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.post} onPress={() => handlePressPost(item)}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>작성자: {item.author}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('PostForm', { post: null })}>
        <Text style={styles.addButtonText}>새 게시글 작성</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7FFFF', // 배경색을 로그인 페이지와 동일하게 설정
  },
  post: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff', // 게시글 배경색
  },
  title: {
    fontSize: 20, // 글씨 크기를 크게 조정
    fontWeight: 'bold',
    fontFamily: 'Jua-Regular', // 글꼴을 Jua-Regular로 설정
    color: '#007AFF', // 텍스트 색상
  },
  author: {
    fontSize: 16, // 글씨 크기를 적절히 조정
    color: '#555',
    fontFamily: 'Jua-Regular', // 글꼴을 Jua-Regular로 설정
  },
  addButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007AFF', // 버튼 색상
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18, // 버튼 텍스트 크기 조정
    fontWeight: 'bold',
    fontFamily: 'Jua-Regular', // 글꼴을 Jua-Regular로 설정
  },
});

export default PostList;
