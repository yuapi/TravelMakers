import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface Post {
  id: string;
  title: string;
  author: string;
  content: string;
}

interface PostDetailProps {
  route: {
    params: {
      post: Post;
    };
  };
  navigation: any;
}

const PostDetail = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const item: string = params.item; // 타입 가능성 오류로 빨간 밑줄 있을 수도 있는데, 일단 무시해도 됩니다.
  const post: Post = JSON.parse(item);
  console.log(post)
  const [comments, setComments] = useState<{ id: string; text: string }[]>([]);
  const [commentText, setCommentText] = useState<string>('');

  // const post = {
  //   id: '1',
  //   title: 'test01',
  //   author: 'tester01',
  //   content: 'testing'
  // }

  const loadComments = async () => {
    try {
      const storedComments = await AsyncStorage.getItem(`comments_${post.id}`);
      if (storedComments) {
        setComments(JSON.parse(storedComments));
      }
    } catch (error) {
      console.error("댓글 로드 실패:", error);
    }
  };

  const saveComments = async (commentsToSave: { id: string; text: string }[]) => {
    try {
      await AsyncStorage.setItem(`comments_${post.id}`, JSON.stringify(commentsToSave));
    } catch (error) {
      console.error("댓글 저장 실패:", error);
    }
  };

  // const handleEdit = () => {
  //   navigation.navigate('PostForm', { post });
  // };

  const handleDelete = async () => {
    Alert.alert(
      "게시글 삭제",
      "정말로 이 게시글을 삭제하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        { text: "삭제", onPress: async () => {
          try {
            const posts = await AsyncStorage.getItem('posts');
            const postsArray = posts ? JSON.parse(posts) : [];

            const updatedPosts = postsArray.filter((item: { id: string; }) => item.id !== post.id);
            await AsyncStorage.setItem('posts', JSON.stringify(updatedPosts));

            router.push({ pathname: "/postlist"});
          } catch (error) {
            console.error("게시글 삭제 실패:", error);
          }
        }},
      ]
    );
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      const newComment = { id: Math.random().toString(), text: commentText };
      const updatedComments = [...comments, newComment];
      setComments(updatedComments);
      saveComments(updatedComments);
      setCommentText('');
    } else {
      Alert.alert("댓글을 입력해주세요.");
    }
  };

  useEffect(() => {
    loadComments(); // 컴포넌트가 마운트될 때 댓글 로드
  }, []);

  return (
    <View style={styles.container}>
      <Text> </Text>
      <View style={styles.topBar}>
        {/* <Ionicons name="pencil" size={24} color="black" onPress={handleEdit} style={styles.icon} /> */}
        <Ionicons name="trash" size={24} color="red" onPress={handleDelete} style={styles.icon} />
      </View>

      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.author}>작성자: {post.author}</Text>
      <Text style={styles.content}>{post.content}</Text>

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
        <FlatList
          data={comments}
          renderItem={({ item }) => <Text style={styles.comment}>{item.text}</Text>}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  author: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  content: {
    fontSize: 18,
    marginBottom: 20,
  },
  commentSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 15,
  },
  commentSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  commentInput: {
    flex: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  comment: {
    fontSize: 16,
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
});

export default PostDetail;