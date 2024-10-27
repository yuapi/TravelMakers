import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, Button, FlatList, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { api } from '@/config.json';
import { fetchAuthSession, getCurrentUser } from '@aws-amplify/auth';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface PostDetail {
  id: number;
  userid: string;
  author: string;
  title: string;
  content: string;
  created: string;
  modified: string | null;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  created: string;
}

const PostDetail = () => {
  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState<string>('');
  const [userid, setUserid] = useState<string>('');

  const router = useRouter();
  const params = useLocalSearchParams();

  useFocusEffect(
    useCallback(() => {
      loadUser();
      loadDetail();
      loadComments();
    }, [])
  );
  
  async function loadUser() {
    const currentUser = await getCurrentUser();
    setUserid(currentUser.userId);
  }

  async function loadDetail() {
    try {
      const { tokens } = await fetchAuthSession();
      const response = await axios.get(`/v1/post/${params.pid}`, {
        baseURL: api.baseURL,
        headers: { Authorization: tokens?.idToken?.toString() }
      });
      console.log(response.data)
      const data = JSON.parse(response.data.body);

      setPost(data);
    } catch (error) {
      console.error('게시글 불러오기 실패:', error);
    }
  }

  async function loadComments() {
    try {
      const { tokens } = await fetchAuthSession();
      const response = await axios.get(`/v1/comment/${params.pid}`, {
        baseURL: api.baseURL,
        headers: { Authorization: tokens?.idToken?.toString() }
      });
      console.log(response.data)
      const data = JSON.parse(response.data.body);

      setComments(data.commentList);
    } catch (error) {
      console.error('댓글 불러오기 실패:', error);
    }
  }

  const handleEdit = () => {
    router.push({ pathname: "/postform", params: { pid: post?.id }});
  };

  const handleDelete = async () => {
    Alert.alert(
      "게시글 삭제",
      "정말로 이 게시글을 삭제하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        { text: "삭제", onPress: async () => {
          try {
            const { tokens } = await fetchAuthSession();
            const response = await axios.delete(`/v1/post/${params.pid}`, {
              baseURL: api.baseURL,
              headers: { Authorization: tokens?.idToken?.toString() }
            });
            console.log(response.data)

            router.back();
          } catch (error) {
            console.error("게시글 삭제 실패:", error);
          }
        }},
      ]
    );
  };

  const handleAddComment = async () => {
    if (commentText.trim()) {
      try {
        const { tokens } = await fetchAuthSession();
        const response = await axios.post(`/v1/comment`, {
          postid: params.pid,
          content: commentText
        }, {
          baseURL: api.baseURL,
          headers: { Authorization: tokens?.idToken?.toString() }
        });
        console.log(response.data)

        setCommentText('');
        loadComments();
      } catch (error) {
        console.error("게시글 삭제 실패:", error);
      }
    } else {
      Alert.alert("댓글을 입력해주세요.");
    }
  };

  return (
    <View style={styles.container}>
      { post?.userid === userid ? 
        <View style={styles.topBar}>
          <Ionicons name="pencil" size={24} color="black" onPress={handleEdit} style={styles.icon} />
          <Ionicons name="trash" size={24} color="red" onPress={handleDelete} style={styles.icon} />
        </View>
      :
        <View style={styles.topBar}>
        </View>
      }

      <Text style={styles.title}>{post?.title}</Text>
      <Text style={styles.author}>{post?.author}</Text>
      <Text style={styles.author}>{post?.modified ? post.modified + ' (수정됨)' : post?.created}</Text>
      <Text style={styles.content}>{post?.content}</Text>

      <View style={styles.commentSection}>
        <Text style={styles.commentSectionTitle}>댓글</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="댓글을 입력하세요..."
            value={commentText}
            onChangeText={setCommentText}
          />
          <Button title="작성" onPress={handleAddComment} />
        </View> 
        { comments.length > 0 ?
          <FlatList
            data={comments}
            renderItem={({ item }) => (
              <View style={styles.commentContainer}>
                <View style={styles.topRow}>
                  <Text style={styles.commentAuthor}>{item.author}</Text>
                  <Text style={styles.commentCreated}>{item.created}</Text>
                </View>
                <Text style={styles.commentContent}>{item.content}</Text>
              </View>
            )}
          />
        : <Text></Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40, // 상단 패딩 줄임
    backgroundColor: '#F9FFFF',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 15, // 아래 여백 조정
  },
  icon: {
    marginLeft: 15,
  },
  title: {
    fontSize: 26, // 제목 크기를 약간 줄임
    fontWeight: 'bold',
    marginBottom: 15, // 아래 여백 줄임
    color: '#007aff',
    fontFamily: 'Jua-Regular',
  },
  author: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10, // 아래 여백 줄임
    fontFamily: 'Jua-Regular',
  },
  content: {
    fontSize: 18,
    marginBottom: 20,
    fontFamily: 'Jua-Regular',
  },
  commentSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 15,
  },
  commentSectionTitle: {
    fontSize: 22, // 댓글 섹션 제목 크기를 약간 키움
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Jua-Regular',
    color: '#007aff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center', // 세로 중앙 정렬
    marginBottom: 15, // 아래 여백 줄임
  },
  commentInput: {
    flex: 1, // 입력 필드가 남은 공간을 차지하도록 수정
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10, // 패딩 조정
    marginRight: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  commentContainer: {
    flexDirection: 'column',
    marginBottom: 10,
    // backgroundColor: '#555',
    borderRadius: 5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentAuthor: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingLeft: 10,
  },
  commentCreated: {
    textAlign: 'right',
    fontSize: 14,
    color: '#555',
    paddingTop: 10,
    paddingRight: 10,
  },
  commentContent: {
    fontSize: 16,
    paddingLeft: 20,
    paddingBottom: 10,
  },
  // comment: {
  //   fontSize: 16,
  //   marginVertical: 5,
  //   padding: 10, // 패딩 조정
  //   backgroundColor: '#ffffff',
  //   borderRadius: 8,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 1 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 3,
  //   elevation: 1,
  // },
});

export default PostDetail;
