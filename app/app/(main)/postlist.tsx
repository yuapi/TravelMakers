import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, router, useFocusEffect } from 'expo-router';
import axios from 'axios';
import { api } from '@/config.json';
import { fetchAuthSession } from '@aws-amplify/core';
import { ScrollView } from 'react-native-gesture-handler';
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
      })
      const data = JSON.parse(response.data.body);
      console.log(data)
      setPosts(data.postList)
    } catch (error) {
      console.error("게시글 로드 실패:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
          {posts.length > 0 ? <FlatList
            data={posts}
            renderItem={({ item }) => (
              <Link href={{ pathname: "/postdetail", params: { pid: item.id }}} asChild>
                <TouchableOpacity style={styles.post} >
                  <View style={styles.linkContainer}>
                    <View style={styles.topRow}>
                      <Text style={styles.title}>{item.title}</Text>
                      <Text style={styles.created}>{item.created}</Text>
                    </View>
                    <Text style={styles.author}>{item.author}</Text>
                  </View>
                </TouchableOpacity>
              </Link>
            )}
          />
          : <Text></Text>}
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
    backgroundColor: '#F7FFFF',
  },
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
  linkContainer: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
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
  created: {
    textAlign: 'right',
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
