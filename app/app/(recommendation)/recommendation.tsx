import React from 'react';
import { View, Text, FlatList, Image, Button, StyleSheet } from 'react-native';

interface Destination {
  name: string;
  description: string;
  continent: string;
  imageUrl: string;
}

const destinations: Destination[] = [
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
];

export default function RecommendationList() {
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
  );
}

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
});
