import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions, Button, FlatList, Animated } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { fetchAuthSession } from '@aws-amplify/auth';
import axios from 'axios';
import { Asset } from 'expo-asset';
import { api } from '@/config.json';
import { imageMap } from '@/scripts/imageMap.js';
const typedImageMap = imageMap as ImageMap;

interface User {
  gender: string;
  age: string;
}

interface ImageMap {
  [key: string]: any;
}

interface Destination {
  name: string;
  continent: string;
  description: string;
  imageUrl: string;
}

const RecommendDestination = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [user, setUser] = useState<User>({ gender: "비공개", age: "비공개" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useLocalSearchParams();
  const router = useRouter();

  const dotOpacities = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;

  const startLoadingAnimation = () => {
    const animations = dotOpacities.map((dot, index) =>
      Animated.sequence([
        Animated.delay(index * 150),
        Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true })
      ])
    );

    Animated.loop(
      Animated.stagger(150, animations)
    ).start();
  };

  const loadUser = async (): Promise<User> => {
    try {
      const { tokens } = await fetchAuthSession();
      const response = await axios.get('/v1/user', {
        baseURL: api.baseURL,
        headers: { Authorization: tokens?.idToken?.toString() }
      })
      const data = JSON.parse(response.data.body);

      const currentYear = new Date().getFullYear();
      const currentUser = {
        gender: data.gender === "Male" ? "남자" : data.gender === "Female" ? "여자" : "비공개",
        age: data.birthday ? (currentYear - parseInt(data.birthday.split('.')[0])).toString() : "비공개"
      };
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      console.error('Error from fetching MyData:', error);
      return user;
    }
  }

  const getImages = async (query: string[]) => {
    const imageResults: { q: string; imagePath: string }[] = [];

    try {
      const localImages = await Promise.all(
        query.map(async (q) => {
          const imageFile = typedImageMap[q];
          if (imageFile) {
            try {
              const localImage = await Asset.loadAsync(imageFile);
              return { q, imagePath: localImage[0].localUri ?? '' };
            } catch (error) {
              console.error(`로컬 이미지 로드 실패: ${q}`, error);
              return { q, imagePath: null };
            }
          }
          return { q, imagePath: null };
        })
      );

      const apiQueries = localImages.filter(img => img.imagePath === null).map(img => img.q);
      imageResults.push(...localImages.filter(img => img.imagePath !== null));

      if (apiQueries.length > 0) {
        const { tokens } = await fetchAuthSession();
        const response = await axios.post(`/v1/images`, {
          query: apiQueries
        },
        {
          baseURL: api.baseURL,
          headers: { Authorization: tokens?.idToken?.toString() },
        });

        if (response.data.statusCode != 200) throw new Error('API 응답 오류');

        const data = JSON.parse(response.data.body);
        data.forEach((image: string, index: number) => {
          imageResults.push({ q: apiQueries[index], imagePath: image });
        });
      }
      return imageResults;
    } catch (error) {
      console.log(error);
      throw new Error("이미지를 불러오는데 실패했습니다");
    }
  }

  const getBotResponse = async (retryCount = 0) => {
    try {
      let userData: User = await loadUser();
      console.log('userdata', userData);
      let prompt = `당신은 해외 여행 국가를 추천하는 여행 전문가입니다. 
      사용자의 특성에 맞는 여행지를 3개 추천해주세요. 
      추천 결과는 정해진 형식에 맞춰 제공해야 하며, 다른 설명이나 추가 정보 없이 오직 요청된 형식으로만 응답해야 합니다.
      
      중요: 추천하는 여행지는 반드시 국가 단위여야 합니다. 도시, 지역, 산, 섬 등은 허용되지 않습니다. 예를 들어, '일본'은 가능하지만 '도쿄', '홋카이도', '후지산' 등은 불가능합니다.
      
      사용자 특성:
      - 성별: ${userData.gender}
      - 나이: ${userData.age}
      - 함께 여행을 갈 사람: ${params.companion}
      - 여행 기간: ${params.duration}
      - 여행 예산: ${params.budget}
      - 원하는 여행 테마: ${params.theme}
      - 선호하는 여행 일정: ${params.complexity}
      
      응답 형식:
      - name: [국가 이름만 입력]
      - description: [국가에 대한 간단한 설명, 2-3문장으로 제한]
      - continent: [대륙 이름]
      - imageUrl: [이 필드는 비워두세요. 'no_image' 라고만 입력하세요.]
      
      각 항목에 대해 간결하고 정확한 정보를 제공하세요. 
      설명은 2-3문장으로 제한합니다.
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
      if (response.data.statusCode != 200) throw new Error('API 응답 오류');

      const data = JSON.parse(response.data.body);
      let results = await parseDestinations(data.content);

      if (results.length === 0) throw new Error("파싱된 결과 없음")

      const query = results.map(destination => destination.name);
      const images = await getImages(query);
      console.log(images[0])
      results = results.map((dest, index) => ({
        ...dest,
        imageUrl: images[index].imagePath
      }));

      console.log(results);

      setDestinations(results);
      setIsLoading(false);
      setError(null)
    } catch (error) {
      console.log(error);
      if (retryCount < 2) {
        setTimeout(() => getBotResponse(retryCount + 1), 1000);
      } else {
        setIsLoading(false);
        setError("추천 서버에 연결할 수 없습니다");
      }
    }
  }

  useEffect(() => {
    console.log(destinations)
    if (destinations.length === 0 && !error) {
      getBotResponse();
    }
    startLoadingAnimation();
  }, []);

  const parseDestinations = (text: string): Destination[] => {
    const destinations: Destination[] = [];
    const destinationTexts = text.trim().split('\n\n');

    for (const destText of destinationTexts) {
      const lines = destText.split('\n');
      const destination: Partial<Destination> = {};
  
      for (const line of lines) {
        const [key, ...valueParts] = line.split(': ');
        const value = valueParts.join(': ').trim();
  
        switch (key.trim()) {
          case '- name':
            destination.name = value;
            break;
          case '- continent':
            destination.continent = value;
            break;
          case '- description':
            destination.description = value;
            break;
          case '- imageUrl':
            destination.imageUrl = value;
            break;
        }
      }
  
      if (
        destination.name &&
        destination.continent &&
        destination.description &&
        destination.imageUrl
      ) {
        destinations.push(destination as Destination);
      }
    }
    
    if (destinations.length === 0) {
      throw new Error('유효한 여행지 정보를 찾을 수 없습니다.');
    }
  
    return destinations;
  };

  const handleSelect = (destination: string) => {
    router.replace({ pathname: '/chatbot', params: {
      ...params,
      ...user,
      destination
    }})
  }

  const renderItem = ({ item }: { item: Destination }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Button title="선택" onPress={() => handleSelect(item.name)} />
      </View>
    </View>
  );

  const renderLoadingText = () => {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>추천 결과를 불러오는 중</Text>
        <View style={styles.dotContainer}>
          {dotOpacities.map((dot, index) => (
            <Animated.Text key={index} style={[styles.dot, { opacity: dot }]}>.</Animated.Text>
          ))}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return renderLoadingText();
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={destinations}
      renderItem={renderItem}
      keyExtractor={(item) => item.name}
      contentContainerStyle={styles.list}
    />
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    padding: 15,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  textContainer: {
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Montserrat-VariableFont_wght',
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
    fontFamily: 'NanumGothic', 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    marginBottom: 10,
  },
  dotContainer: {
    flexDirection: 'row',
  },
  dot: {
    fontSize: 40,
    marginHorizontal: 2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
  },
//   container: {
//     flexGrow: 1,
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#e9f3f5',
//   },
//   title: {
//     fontSize: 30,
//     fontWeight: 'bold',
//     marginVertical: 20,
//     color: '#005f99',
//     textAlign: 'center',
//   },
//   card: {
//     width: width * 0.9,
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     overflow: 'hidden',
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 8,
//   },
//   image: {
//     width: '100%',
//     height: 200,
//   },
//   cardContent: {
//     padding: 15,
//   },
//   country: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     color: '#333',
//   },
//   description: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 15,
//   },
//   button: {
//     backgroundColor: '#007bff',
//     borderRadius: 5,
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//   },
//   linkText: {
//     color: '#ffffff',
//     textAlign: 'center',
//   },
});

export default RecommendDestination;
