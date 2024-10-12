import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';

const Terms = () => {
  return (
    <View style={styles.container}>
      <Title style={styles.header}>약관 및 정책</Title>
      <Text style={styles.content}>
        이곳에 약관 및 정책 내용을 작성합니다. 
        사용자가 이 내용을 읽고 앱 사용에 필요한 정보를 얻을 수 있습니다.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#007AFF',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});

export default Terms;
