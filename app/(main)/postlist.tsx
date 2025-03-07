import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, router, useFocusEffect } from 'expo-router';
import axios from 'axios';
import { api } from '@/config.json';
import { fetchAuthSession } from '@aws-amplify/core';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Post {
  id: number;
  userid: string;
  author: string;
  title: string;
  created: string;
}

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, [])
  );

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
        <Text style={styles.title}>커뮤니티</Text>
        <View style={styles.bar} />
        {posts.length > 0 ? (
          <FlatList
            data={posts}
            renderItem={({ item }) => (
              <Link href={{ pathname: "/postdetail", params: { pid: item.id }}} asChild>
                <TouchableOpacity style={styles.post}>
                  <View style={styles.linkContainer}>
                    <View style={styles.topRow}>
                      <Text style={styles.titleText}>{item.title}</Text>
                      <Text style={styles.created}>{item.created}</Text>
                    </View>
                    <Text style={styles.author}>{item.author}</Text>
                  </View>
                </TouchableOpacity>
              </Link>
            )}
          />
        ) : (
          <Text style={styles.noPostsText}>게시글이 없습니다.</Text>
        )}
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/postform')}>
          <Text style={styles.addButtonText}>새 게시글 작성</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Montserrat-VariableFont_wght', 
    color: '#007aff',
  },
  bar: {
    height: 2.5, 
    width: '200%', 
    backgroundColor: '#007AFF', 
    marginBottom: 20, 
    right: '50%', 
  },
  
  post: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  linkContainer: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Montserrat-VariableFont_wght', 
    color: '#333',
  },
  author: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'NanumGothic', 
  },
  created: {
    textAlign: 'right',
    fontSize: 16,
    color: '#555',
    fontFamily: 'NanumGothic', 
  },
  noPostsText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
    color: '#555',
    fontFamily: 'NanumGothic', 
  },
  addButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007aff',
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'NanumGothic', 
  },
});

export default PostList;
