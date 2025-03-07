import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';

export default function Notice() {
  return (
    <View style={styles.container}>
      <Title style={styles.header}>공지사항</Title>
      <Text style={styles.content}>공지사항 내용</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
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