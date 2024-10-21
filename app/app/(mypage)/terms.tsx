import React from 'react'; // React 라이브러리 가져오기
import { View, Text, StyleSheet } from 'react-native'; // React Native의 기본 컴포넌트 가져오기
import { Title } from 'react-native-paper'; // react-native-paper 라이브러리의 Title 컴포넌트 가져오기

const Terms = () => { // Terms 컴포넌트 정의
  return (
    <View style={styles.container}> {/* 전체를 감싸는 컨테이너 */}
      <Title style={styles.header}>약관 및 정책</Title> {/* 제목을 표시하는 Title 컴포넌트 */}
      <Text style={styles.content}> {/* 약관 및 정책 내용 텍스트 */}
        이곳에 약관 및 정책 내용을 작성합니다. 
        사용자가 이 내용을 읽고 앱 사용에 필요한 정보를 얻을 수 있습니다.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({ // 스타일 정의
  container: {
    flex: 1, // 전체 화면을 차지하도록 설정 (세로 방향으로 공간을 확장)
    padding: 20, // 컨테이너 내부 여백을 20으로 설정
    backgroundColor: '#f5f5f5', // 배경색을 연한 회색으로 설정
  },
  header: {
    fontSize: 24, // 제목 텍스트의 글꼴 크기를 24로 설정
    fontWeight: 'bold', // 제목 텍스트를 굵게 설정
    marginBottom: 16, // 제목과 다음 요소 간의 간격을 16으로 설정
    color: '#007AFF', // 제목 텍스트 색상을 파란색으로 설정
  },
  content: {
    fontSize: 16, // 내용 텍스트의 글꼴 크기를 16으로 설정
    lineHeight: 24, // 내용 텍스트의 줄 높이를 24로 설정하여 가독성을 높임
    color: '#333', // 내용 텍스트 색상을 어두운 회색으로 설정
  },
});

export default Terms; // Terms 컴포넌트 내보내기
