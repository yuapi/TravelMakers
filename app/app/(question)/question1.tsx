import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Link } from 'expo-router';

export default function QoneScreen() {
  const [selectedIndex, setSelectedIndex] = useState<Number | null>(null);

  const handleItemPress = (index: Number) => {
    setSelectedIndex(index);
  };
  
  const radioItems = [
    { label: "남자 혼자", value: 0 },
    { label: "여자 혼자", value: 1 },
    { label: "친구들과", value: 2 },
    { label: "부모님과", value: 3 },
    { label: "연인과", value: 4 },
    { label: "미정", value: 5 },
  ];

  return (
    <View style={styles.container}>      
      <Text style={styles.HomeText}>누구와 가실 예정인가요?</Text>
      <FlatList
        data={radioItems}
        keyExtractor={(item) => item.value.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.radioItem,
              selectedIndex === index ? styles.selectedRadioItem : null,
            ]}
            onPress={() => handleItemPress(index)}
          >
            <View style={styles.radioCircle}>
              {selectedIndex === index && <View style={styles.selectedCircle} />}
            </View>
            <Text style={styles.radioLabel}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.NextBottom}>
          <Link href='/question2'>
            <Text style={styles.BottomText}>확인</Text>
          </Link>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    HomeText: {
      fontSize: 30,
      textAlign: "center",
      marginBottom: 50,
      marginTop:50
    },
    radioItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    selectedRadioItem: {
      backgroundColor: "#f2f2f2",
    },
    // [radioCircle, selectedCircle]에 대한 CSS 누락
    radioCircle: {

    },
    selectedCircle: {

    },
    radioLabel: {
      margin: 15,
      fontSize: 16,
      textAlign:"center",
      flex:1,
    },
    NextBottom: {
      backgroundColor: "skyblue",
      padding: 10,
      width: "90%",
      alignSelf: "center",
      borderRadius: 10,
    },
    BottomText: {
      fontSize: 15,
      color: "white",
      textAlign: "center",
    },
    bottomContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        paddingVertical: 16,
        paddingHorizontal: 24,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
  });