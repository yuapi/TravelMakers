import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { Link } from 'expo-router';

interface Destination {
  id: number;
  continent: string;
  country: string;
  description: string;
  imageUrl: string;
}

const RecommendDestination: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);

  const fetchDestinations = async () => {
    try {
      const response = await fetch('https://example.com/api/destinations'); // 실제 서버 URL로 변경 필요
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data: Destination[] = await response.json();
      setDestinations(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>추천 여행지</Text>
      {destinations.map((destination) => (
        <View key={destination.id} style={styles.card}>
          <Image source={{ uri: destination.imageUrl }} style={styles.image} />
          <View style={styles.cardContent}>
            <Text style={styles.country}>{destination.country}</Text>
            <Text style={styles.description}>{destination.description}</Text>
            <TouchableOpacity style={styles.button}>
              <Link href='/chatbot' style={styles.linkText}>선택</Link>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e9f3f5',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#005f99',
    textAlign: 'center',
  },
  card: {
    width: width * 0.9,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 15,
  },
  country: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  linkText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default RecommendDestination;
