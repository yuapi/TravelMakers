import React, { useEffect, useState } from 'react'; // React 및 필요한 훅 가져오기
import { View, Text, TextInput, Button, StyleSheet } from 'react-native'; // React Native의 기본 컴포넌트 가져오기
import AsyncStorage from '@react-native-async-storage/async-storage'; // 비동기 저장소를 위한 AsyncStorage 가져오기

const Profile = () => { // Profile 컴포넌트 정의
  const [nickname, setNickname] = useState(''); // 닉네임 상태 // 상태 변수를 설정 (닉네임과 이메일)
  const [email, setEmail] = useState(''); // 이메일 상태

  useEffect(() => { // 컴포넌트가 마운트될 때 사용자 데이터를 로드하는 useEffect 훅
    const loadUserData = async () => {
      const resUser = await AsyncStorage.getItem('user'); // AsyncStorage에서 사용자 데이터를 가져옴
      if (resUser) {
        const userdata = JSON.parse(resUser); // JSON 문자열을 객체로 변환
        setNickname(userdata.nickname); // 닉네임 상태 업데이트
        setEmail(userdata.email); // 이메일 상태 업데이트
      }
    };
    loadUserData(); // 사용자 데이터 로드 함수 호출
  }, []); // 빈 배열을 의존성으로 주어, 컴포넌트가 처음 렌더링될 때만 호출됨

  const handleSave = async () => {  // 사용자 정보를 저장하는 함수
    const updatedUserData = { nickname, email }; // 현재 상태의 닉네임과 이메일로 객체 생성
    await AsyncStorage.setItem('user', JSON.stringify(updatedUserData)); // AsyncStorage에 사용자 데이터 저장
    alert('정보가 저장되었습니다!'); // 저장 완료 알림
    // 돌아가기 기능은 필요 없으니 주석 처리했습니다.
  };

  return ( // 컴포넌트의 렌더링 부분
    <View style={styles.container}> {/* 전체를 감싸는 컨테이너 */}
      <Text style={styles.label}>닉네임</Text> {/* 닉네임 레이블 */}
      <TextInput
        style={styles.input} // 입력 필드 스타일
        value={nickname} // 닉네임 상태값 설정
        onChangeText={setNickname} // 텍스트가 변경될 때 상태 업데이트
      />
      <Text style={styles.label}>이메일</Text> {/* 이메일 레이블 */}
      <TextInput
        style={styles.input} // 입력 필드 스타일
        value={email} // 이메일 상태값 설정
        onChangeText={setEmail} // 텍스트가 변경될 때 상태 업데이트
        keyboardType="email-address" // 이메일 입력을 위한 키보드 타입 설정
      />
      <Button title="저장" onPress={handleSave} /> {/* 저장 버튼, 클릭 시 handleSave 함수 호출 */}
    </View>
  );
};

const styles = StyleSheet.create({ // 스타일 정의
  container: {
    flex: 1, // 전체 화면을 차지하도록 설정 (세로 방향으로 공간을 확장)
    padding: 16, // 컨테이너 내부 여백을 16으로 설정
  },
  label: {
    marginBottom: 8, // 레이블과 다음 요소 간의 간격을 8로 설정
    fontSize: 16, // 레이블 텍스트의 글꼴 크기를 16으로 설정
    fontWeight: 'bold', // 레이블 텍스트를 굵게 설정
  },
  input: {
    marginBottom: 16, // 입력 필드와 다음 요소 간의 간격을 16으로 설정
    padding: 12, // 입력 필드 내부 여백을 12로 설정
    borderWidth: 1, // 입력 필드 테두리 두께 설정
    borderColor: '#ccc', // 입력 필드 테두리 색상을 연한 회색으로 설정
    borderRadius: 8, // 입력 필드 모서리를 둥글게 설정
  },
});

export default Profile; // Profile 컴포넌트 내보내기