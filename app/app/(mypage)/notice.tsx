import React from 'react'; // React 라이브러리 가져오기
import { View, Text, StyleSheet } from 'react-native'; // React Native의 View, Text, StyleSheet 컴포넌트 가져오기
import { Title } from 'react-native-paper'; // React Native Paper의 Title 컴포넌트 가져오기

export default function Notice() { // Notice 컴포넌트 정의
  return (
    <View style={styles.container}> {/* 전체 화면을 차지하는 컨테이너 */}
      <Title style={styles.header}>공지사항</Title> {/* 제목을 표시하는 Title 컴포넌트 */}
      <Text style={styles.content}>공지사항 내용</Text> {/* 공지사항 내용을 표시하는 Text 컴포넌트 */}
    </View>
  );
}

const styles = StyleSheet.create({ // 스타일 정의
  container: {
    flex: 1, // 전체 화면을 차지하도록 설정 (세로 방향으로 공간을 확장)
    padding: 20, // 컨테이너 내부 여백을 20으로 설정
    backgroundColor: '#f5f5f5', // 전체 배경색을 연한 회색으로 설정
  },
  header: {
    fontSize: 24, // 헤더 텍스트의 글꼴 크기를 24로 설정
    fontWeight: 'bold', // 헤더 텍스트를 굵게 설정
    marginBottom: 20, // 헤더와 아래 콘텐츠 간의 간격을 20으로 설정
  },
  content: {
    fontSize: 16, // 콘텐츠 텍스트의 글꼴 크기를 16으로 설정
    color: '#333', // 콘텐츠 텍스트의 색상을 어두운 회색으로 설정
  },
});
