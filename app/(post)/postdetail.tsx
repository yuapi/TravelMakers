import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, Button, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { api } from '@/config.json';
import { fetchAuthSession, getCurrentUser } from '@aws-amplify/auth';

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
      const data = JSON.parse(response.data.body);
      setComments(data.commentList);
    } catch (error) {
      console.error('댓글 불러오기 실패:', error);
    }
  }

  const handleEdit = () => {
    router.push({ pathname: "/postform", params: { pid: post?.id } });
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
            await axios.delete(`/v1/post/${params.pid}`, {
              baseURL: api.baseURL,
              headers: { Authorization: tokens?.idToken?.toString() }
            });
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
        await axios.post(`/v1/comment`, {
          postid: params.pid,
          content: commentText
        }, {
          baseURL: api.baseURL,
          headers: { Authorization: tokens?.idToken?.toString() }
        });
        setCommentText('');
        loadComments();
      } catch (error) {
        console.error("댓글 작성 실패:", error);
      }
    } else {
      Alert.alert("댓글을 입력해주세요.");
    }
  };

  return (
    <View style={styles.container}>
      {/* 커뮤니티 타이틀 추가 */}
      <Text style={styles.communityTitle}>커뮤니티</Text>
      <View style={styles.bar} />

      { post?.userid === userid ? 
        <View style={styles.topBar}>
          <Ionicons name="pencil" size={24} color="#007AFF" onPress={handleEdit} style={styles.icon} />
          <Ionicons name="trash" size={24} color="red" onPress={handleDelete} style={styles.icon} />
        </View>
      :
        <View style={styles.topBar} />
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
        { comments.length > 0 ? (
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
        ) : <Text style={styles.noCommentsText}>댓글이 없습니다.</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  communityTitle: {
    fontSize: 30,
    marginTop:20,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Montserrat-VariableFont_wght', 
    color: '#007aff',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  icon: {
    marginLeft: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'Montserrat-VariableFont_wght', 
    marginBottom: 8,
  },
  bar: {
    height: 2.5, 
    width: '200%', 
    backgroundColor: '#007AFF', 
    marginBottom: 20, 
    right: '50%', 
  },
  author: {
    fontSize: 15,
    color: '#555555',
    fontFamily: 'NanumGothic', 
    marginBottom: 5,
  },
  content: {
    fontSize: 18,
    color: '#444444',
    fontFamily: 'NanumGothic', 
    marginBottom: 15,
  },
  commentSection: {
    marginTop: 25,
    borderTopWidth: 1,
    borderTopColor: '#C0C0C0',
    paddingTop: 15,
  },
  commentSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#C0C0C0',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  commentContainer: {
    marginVertical: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#C0C0C0',
    borderRadius: 5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentAuthor: {
    fontWeight: 'bold',
    fontFamily: 'NanumGothic', 
  },
  commentCreated: {
    color: '#888',
    fontFamily: 'NanumGothic', 
  },
  commentContent: {
    marginTop: 5,
    fontFamily: 'NanumGothic', 
  },
  noCommentsText: {
    fontStyle: 'italic',
    color: '#888',
    fontFamily: 'NanumGothic', 
  },
});

export default PostDetail;
