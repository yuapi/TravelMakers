import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { Text, View} from '@/components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function QtwoScreen() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { companion } = useLocalSearchParams();

  const handleItemPress = (index: number) => {
    setSelectedIndex(index);
  };

  const router = useRouter();
  const handleNext = () => {
    if (selectedIndex != null) {
      router.replace({ pathname: '/question3', params: { 
        companion: companion,
        duration: items[selectedIndex].label,
      }});
    }
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
      <Text style={styles.title}>여행 기간은 어느정도인가요?</Text>
      <View style={styles.bar} />
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
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007aff',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Montserrat-VariableFont_wght', 
  },
  bar: {
    height: 2.5, 
    width: '200%', 
    backgroundColor: '#007AFF', 
    marginBottom: 20, 
    right: '50%', 
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
    fontFamily: 'NanumGothic', 
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
    fontFamily: 'NanumGothic', 
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
