import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

interface Post {
  id: string;
  title: string;
  author: string;
}

interface PostListProps {
  navigation: any;
  route: {
    params: {
      refresh?: boolean;
    };
  };
}

const PostList: React.FC<PostListProps> = ({ navigation, route }) => {
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
      <Text></Text>
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
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('PostForm')}>
        <Text style={styles.addButtonText}>새 게시글 작성</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  post: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  author: {
    fontSize: 14,
    color: '#555',
  },
  addButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PostList;
