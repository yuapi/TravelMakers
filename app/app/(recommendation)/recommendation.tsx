import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Link } from 'expo-router';

const RecommendDestination = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>추천 여행지</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>대륙</Text>
          <Text style={styles.headerText}>국가</Text>
          <Text style={styles.headerText}>선택</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.rowText}>아시아</Text>
          <Text style={styles.rowText}>베트남</Text>
          <TouchableOpacity style={styles.button}>
            <Link href='/chatbot' style={styles.linkText}>선택</Link>
          </TouchableOpacity>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.rowText}>유럽</Text>
          <Text style={styles.rowText}>스페인</Text>
          <TouchableOpacity style={styles.button}>
            <Link href='/chatbot' style={styles.linkText}>선택</Link>
          </TouchableOpacity>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.rowText}>아시아</Text>
          <Text style={styles.rowText}>일본</Text>
          <TouchableOpacity style={styles.button}>
            <Link href='/chatbot' style={styles.linkText}>선택</Link>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e9f3f5', // 은은한 하늘색 배경
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#005f99', // 차분한 파란색
    textAlign: 'center',
  },
  table: {
    width: width * 0.9, // 화면 너비의 90% 사용
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#007acc', // 더 밝은 파란색
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f7f9fa', // 조금 더 밝은 배경색
  },
  rowText: {
    fontSize: 18,
    color: '#333',
  },
  button: {
    backgroundColor: '#28a745', // 초록색 버튼
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default RecommendDestination;
