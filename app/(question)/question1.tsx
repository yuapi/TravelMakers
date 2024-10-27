import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Dimensions, SafeAreaView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Link, useRouter } from 'expo-router';

export default function QoneScreen() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleItemPress = (index: number) => {
    setSelectedIndex(index);
  };

  const router = useRouter();
  const handleNext = () => {
    if (selectedIndex != null) {
      router.replace({ pathname: '/question2', params: { companion: items[selectedIndex].label }})
    }
  }

  const items = [
    { label: "남자 혼자", value: 0 },
    { label: "여자 혼자", value: 1 },
    { label: "친구들과", value: 2 },
    { label: "부모님과", value: 3 },
    { label: "연인과", value: 4 },
    { label: "미정", value: 5 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>누구와 가실 예정인가요?</Text>
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
        <TouchableOpacity style={[styles.nextButton, selectedIndex === null && styles.disabledButton]} onPress={handleNext} disabled={selectedIndex === null}>
          <Text style={[styles.bottomText, selectedIndex === null && styles.disabledText]}>다음</Text>
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
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  disabledText: {
    color: "#666666",
  },
});
