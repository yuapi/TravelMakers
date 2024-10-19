import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';

export default function Profile() {
  return (
    <View style={styles.container}>
      <Title style={styles.header}>개인정보 수정</Title>
      <Text style={styles.content}>개인정보 수정 기능</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    color: '#333',
  },
});
