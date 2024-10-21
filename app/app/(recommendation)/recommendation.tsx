import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { fetchAuthSession } from '@aws-amplify/auth';
import axios from 'axios';
import { api } from '@/config.json';

interface Country {
  name: string;
  continent: string;
  description: string;
  imageUrl: string;
}

const RecommendDestination = () => {

  const example = [
    {
      name: '일본',
      continent: '아시아',
      description: '설명',
      imageUrl: '이미지 경로',
    },
    {
      name: '일본',
      continent: '아시아',
      description: '설명',
      imageUrl: '이미지 경로',
    },
    {
      name: '일본',
      continent: '아시아',
      description: '설명',
      imageUrl: '이미지 경로',
    },
  ]

  const [countries, setCountries] = useState<Country[]>([]);
  const params = useLocalSearchParams();

  useEffect(() => {
    getBotResponse();
  })

  const getBotResponse = async () => {
    try {
      let prompt = `당신은 해외 여행 국가를 추천하는 여행 전문가입니다. 
      사용자의 특성에 맞는 여행지를 3개 추천해주세요. 
      추천 결과는 정해진 형식에 맞춰 제공해야 하며, 다른 설명이나 추가 정보 없이 오직 요청된 형식으로만 응답해야 합니다.
      사용자 특성:
      - 함께 여행을 갈 사람: ${params.companion}
      - 여행 기간: ${params.duration}
      - 여행 예산: ${params.budget}
      - 원하는 여행 테마: ${params.theme}
      - 선호하는 여행 일정: ${params.complexity}
      응답 형식:
      - name
      - description
      - continent
      - imageUrl
      각 항목에 대해 간결하고 정확한 정보를 제공하세요. 
      설명은 2-3문장으로 제한하고, 이미지 URL은 실제 존재하는 유효한 링크여야 합니다. 
      응답에는 오직 위의 네 가지 항목만 포함되어야 하며, 다른 설명이나 추가 정보는 제외해야 합니다.`

      const { tokens } = await fetchAuthSession();
      const response = await axios.post(`/v1/chat`, {
        model: 'Gemini-1.5-flash',
        prompt: prompt,
      },
      {
        baseURL: api.baseURL,
        headers: { Authorization: tokens?.idToken?.toString() },
        
      });
      if (response.data.statusCode != 200) throw (response.data);

      const data = JSON.parse(response.data.body);
      console.log(data);
      const lines = data.content.split('\n');
      let countries: Country[] = []
      let tempCountry: Country = {
        name: '',
        continent: '',
        description: '',
        imageUrl: '',
      }
      lines.map((line: string) => {
        if (line.startsWith('- name:')) {
          const value = line.split(':')[1].trim();
          tempCountry.name = value;
        }
        else if (line.startsWith('- description:')) {
          const value = line.split(':')[1].trim();
          tempCountry.description = value;
        }
        else if (line.startsWith('- continent:')) {
          const value = line.split(':')[1].trim();
          tempCountry.continent = value;
        }
        else if (line.startsWith('- imageUrl:')) {
          const value = line.split(':')[1].trim();
          tempCountry.imageUrl = value;
          countries.push(tempCountry);
        }
      })
      console.log(countries);


    } catch (error) {
      console.log(error);
    }
  }
  // useEffect(() => {
  //   const params = useLocalSearchParams();
  //   setCountries(JSON.parse(params.countries))
  // }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>추천 여행지</Text>
      {countries.map((country) => (
        <View style={styles.card}>
          <Image source={{ uri: country.imageUrl }} style={styles.image} />
          <View style={styles.cardContent}>
            <Text style={styles.country}>{country.name}</Text>
            <Text style={styles.description}>{country.description}</Text>
            <TouchableOpacity style={styles.button}>
              <Link href={{ pathname: '/chatbot', params: { country: country.name }}} style={styles.linkText}>선택</Link>
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
