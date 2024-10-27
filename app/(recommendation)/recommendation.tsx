import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions, Button, FlatList } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { fetchAuthSession } from '@aws-amplify/auth';
import axios from 'axios';
import { api } from '@/config.json';

interface Destination {
  name: string;
  continent: string;
  description: string;
  imageUrl: string;
}

const RecommendDestination = () => {

  const example = [
    {
      name: "도쿄 미식 투어",
      description: "일본 도쿄의 다채로운 미식 세계를 경험하는 당일치기 여행입니다. 전통적인 스시와 라멘에서부터 최신 트렌드 레스토랑까지 다양한 음식을 맛볼 수 있습니다.",
      continent: "아시아",
      imageUrl: "https://haveagood-holiday-com.s3.ap-northeast-1.amazonaws.com/wp-content/uploads/2024/02/15171518/263.webp",
    },
    {
      name: "파리 미슐랭 레스토랑 투어",
      description: "미슐랭 스타 셰프의 섬세한 요리와 프랑스 와인을 즐기는 고급 미식 투어입니다. 파리의 유명 레스토랑을 방문하여 잊지 못할 미식 경험을 선사합니다.",
      continent: "유럽",
      imageUrl: "https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=11288720&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNS8wMi9DTFM2OS9OVVJJXzAwMV8wMjA2X251cmltZWRpYV8yMDE1MTIwMw==&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10006",
    },
    {
      name: "뉴욕 푸드 트럭 투어",
      description: "뉴욕의 다양한 푸드 트럭을 탐험하며 다채로운 음식을 맛보는 당일치기 투어입니다.",
      continent: "북아메리카",
      imageUrl: "https://images.unsplash.com/photo-1571191007613-1b587aed0f47?q=80&w=2529&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ]

  const [destinations, setDestinations] = useState<Destination[]>([]);
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
      let dest: Destination[] = []
      let tempDest: Destination = {
        name: '',
        continent: '',
        description: '',
        imageUrl: '',
      }
      lines.map((line: string) => {
        if (line.startsWith('- name:')) {
          const value = line.split(':')[1].trim();
          tempDest.name = value;
        }
        else if (line.startsWith('- description:')) {
          const value = line.split(':')[1].trim();
          tempDest.description = value;
        }
        else if (line.startsWith('- continent:')) {
          const value = line.split(':')[1].trim();
          tempDest.continent = value;
        }
        else if (line.startsWith('- imageUrl:')) {
          const value = line.split(':')[1].trim();
          tempDest.imageUrl = value;
          dest.push(tempDest);
        }
      })
      console.log(dest);


    } catch (error) {
      console.log(error);
    }
  }

    const renderItem = ({ item }: { item: Destination }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Button title="선택" onPress={() => alert(`${item.name} 선택됨`)} />
      </View>
    </View>
  );

  return (
    <FlatList
      data={destinations}
      renderItem={renderItem}
      keyExtractor={(item) => item.name}
      contentContainerStyle={styles.list}
    />
  
//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>추천 여행지</Text>
//       {countries.map((country) => (
//         <View style={styles.card}>
//           <Image source={{ uri: country.imageUrl }} style={styles.image} />
//           <View style={styles.cardContent}>
//             <Text style={styles.country}>{country.name}</Text>
//             <Text style={styles.description}>{country.description}</Text>
//             <TouchableOpacity style={styles.button}>
//               <Link href={{ pathname: '/chatbot', params: { country: country.name }}} style={styles.linkText}>선택</Link>
//             </TouchableOpacity>
//           </View>
//         </View>
//       ))}
//     </ScrollView>
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
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
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
//     backgroundColor: '#28a745',
//     paddingVertical: 10,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   linkText: {
//     color: '#fff',
//     fontSize: 18,
//   },
});

export default RecommendDestination;
