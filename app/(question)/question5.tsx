import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Dimensions, SafeAreaView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Title } from 'react-native-paper';

export default function QfiveScreen() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { companion, duration, budget, theme } = useLocalSearchParams();

  const handleItemPress = (index: number) => {
    setSelectedIndex(index);
  };

  const router = useRouter();
  const handleResult = () => {
    if (selectedIndex != null) {
      router.replace({ pathname: '/recommendation', params: { 
        companion: companion,
        duration: duration,
        budget: budget,
        theme: theme,
        complexity: items[selectedIndex].label,
      }})
    }
  }

  const items = [
    { label: "복잡한 일정", value: 0 },
    { label: "여유로운 일정", value: 1 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>어떤 여행 일정을 선호하나요?</Text>
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
        <TouchableOpacity style={[styles.nextButton, selectedIndex === null && styles.disabledButton]} onPress={handleResult} disabled={selectedIndex === null}>
          <Text style={[styles.bottomText, selectedIndex === null && styles.disabledText]}>완료</Text>
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
