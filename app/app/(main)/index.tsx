import { Link } from 'expo-router';
import { View, StyleSheet, Text } from 'react-native';

const MainScreen = () => {
  return (
    <View style={styles.container}>
      <Link href='/login' style={styles.button}>
        <Text style={styles.buttonText}>로그인</Text>
      </Link>
      <Link href='/mypage' style={styles.button}>
        <Text style={styles.buttonText}>마이페이지</Text>
      </Link>
      <Link href='/question1' style={styles.button}>
        <Text style={styles.buttonText}>Question1 테스트</Text>
      </Link>
      <Link href='/PostForm' style={styles.button}>
        <Text style={styles.buttonText}>게시판</Text>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
});

export default MainScreen;
