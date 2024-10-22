import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Dimensions, SafeAreaView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Link } from 'expo-router';
import { Title } from 'react-native-paper';

export default function QoneScreen() {
  const [selectedIndex, setSelectedIndex] = useState<Number | null>(null);

  const handleItemPress = (index: Number) => {
    setSelectedIndex(index);
  };

  const items = [
    { label: "당일치기", value: 0 },
    { label: "1박 2일", value: 1 },
    { label: "2박 3일", value: 2 },
    { label: "3박 4일", value: 3 },
    { label: "4박 5일", value: 4 },
    { label: "5박 6일", value: 5 },
    { label: "6박 7일", value: 6 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Title style={styles.title}>여행기간</Title>
      <FlatList
        data={items}
        keyExtractor={(item) => item.value.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.item,
              selectedIndex === index ? styles.selectedItem : null,
            ]}
            onPress={() => handleItemPress(index)}
          >
            <Text style={styles.itemLabel}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.nextButton}>
          <Link href='/question3'>
            <Text style={styles.bottomText}>확인</Text>
          </Link>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 70,
    backgroundColor: '#F9FFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007aff',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Jua-Regular',
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedItem: {
    backgroundColor: "#b2ebf2",
  },
  itemLabel: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Jua-Regular',
  },
  nextButton: {
    backgroundColor: "#007aff",
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  bottomText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    fontFamily: 'Jua-Regular',
  },
  bottomContainer: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
});
