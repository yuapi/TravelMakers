import { getCurrentUser, fetchAuthSession } from '@aws-amplify/auth';
import { Link } from 'expo-router';
import { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { api } from '@/config.json';

interface UserData { // 사용자 데이터 인터페이스 정의
  uid: string; // 사용자 ID
  username: string; // 사용자 이름
  nickname: string; // 닉네임
  email: string; // 이메일
  gender: string; // 성별
  birthday: string; // 생일
  locale: string; // 지역
  regdate: string; // 등록일
  tokens: {
    accessToken: string; // 액세스 토큰
    idToken: string; // ID 토큰
  };
}

async function getUser(): Promise<void> { // 사용자 정보를 가져오는 비동기 함수
  try {
    const { userId, username } = await getCurrentUser(); // 현재 사용자 정보 가져오기
    const { tokens } = await fetchAuthSession({ forceRefresh: true }); // 인증 세션 가져오기
    const accessToken = tokens?.accessToken.toString() ?? ""; // 액세스 토큰
    const idToken = tokens?.idToken?.toString() ?? ""; // ID 토큰

    const response = await axios.get(`/v1/user/${username.split("_")[1]}`, {  // 사용자 데이터 가져오기
      baseURL: api.baseURL, // API 기본 URL 설정
      headers: { Authorization: idToken }, // 인증 헤더 추가
    });
    const data = JSON.parse(response.data.body); // JSON 형식으로 응답 데이터 파싱

    const resUser: UserData = { // 사용자 데이터 구조화
      uid: userId,
      username: username,
      nickname: data.nickname,
      email: data.email,
      gender: data.gender ?? '', // 성별 기본값 설정
      birthday: data.birthday ?? '', // 생일 기본값 설정
      locale: data.locale ?? '', // 지역 기본값 설정
      regdate: data.regdate,
      tokens: {
        accessToken: accessToken,
        idToken: idToken
      }
    };
    await AsyncStorage.setItem("user", JSON.stringify(resUser)); // AsyncStorage에 사용자 정보 저장

  } catch (error) {
    console.error(error);
    console.log("Not signed in"); // 로그인 안 되어 있는 경우 로그 출력
  }
}

exports.getUser = getUser

const MainScreen = () => {
  useEffect(() => {
    getUser(); // 컴포넌트 마운트 시 사용자 정보 가져오기
  }, []);

  return (
    <View style={styles.container}>
      <Link href='/' style={styles.button}>  {/* 로그인 페이지로 이동하는 링크 */}
        <Text style={styles.buttonText}>로그인</Text>
      </Link>
      <Link href='/mypage' style={styles.button}> {/* 마이 페이지로 이동하는 링크 */}
        <Text style={styles.buttonText}>마이페이지</Text>
      </Link>
      <Link href='/question1' style={styles.button}> {/* 질문 1 페이지로 이동하는 링크 */}
        <Text style={styles.buttonText}>Question1 테스트</Text>
      </Link>
      <Link href='/postlist' style={styles.button}> {/* 게시판 페이지로 이동하는 링크 */}
        <Text style={styles.buttonText}>게시판</Text>
      </Link>
      <Link href='/chatbot' style={styles.button}> {/* 챗봇 페이지로 이동하는 링크 */}
        <Text style={styles.buttonText}>챗봇</Text>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({ // 스타일 정의
  container: {
    flex: 1,
    justifyContent: 'center', // 세로 가운데 정렬
    alignItems: 'center', // 가로 가운데 정렬
  },
  button: {
    padding: 10,
    backgroundColor: '#007BFF', // 버튼 배경색
    borderRadius: 5, // 버튼 모서리 둥글게
    margin: 10, // 버튼 간격
  },
  buttonText: {
    color: '#FFFFFF', // 버튼 텍스트 색상
    fontSize: 16, // 버튼 텍스트 크기
  },
});

export default MainScreen; // 컴포넌트 내보내기
