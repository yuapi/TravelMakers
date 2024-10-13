import React, { useState, useRef } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Dimensions, View, Modal, Image } from 'react-native';
import { Text } from '@/components/Themed';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/config.json';

const { width, height } = Dimensions.get('window');

interface message {
  id: number
  content: string
  role: string
}

async function getBotResponse(prompt: string, messages: Array<message | null>, model: string): Promise<message> {
  try {
    const resUser: string = await AsyncStorage.getItem('user') ?? "";
    const userdata = JSON.parse(resUser);
    const idToken = userdata.tokens.idToken;
    console.log(idToken)
    const response = await axios.post(`/v1/chat`, {
      model: model,
      prompt: prompt,
      prev: messages
    },
    {
      baseURL: api.baseURL,
      headers: { Authorization: idToken },
      
    });
    if (response.data.statusCode != 200) throw (response.data);

    console.log(response.data);
    const data = JSON.parse(response.data.body);
  
    const botMsg: message = {
      id: messages.length + 2,
      content: data.content,
      role: "assistant"
    }
    console.log(data);
  
    return botMsg;
  } catch (error) {
    console.log(error);

    const errorMsg: message = {
      id: messages.length + 2,
      content: "서버에 연결할 수 없습니다.",
      role: "assistant"
    }
    return errorMsg;
  }
}

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Array<message>>([
    { 
      id: 1, 
      content: '베트남 여행 필수 정보 총정리! 🇻🇳\n\n베트남 여행, 정말 설레시죠? 흥미진진한 문화와 아름다운 자연을 동시에 만끽할 수 있는 매력적인 나라입니다.\n\n1. 환전 및 지불:\n- 달러 환전: 베트남에서 가장 통용되는 외화는 달러입니다. 한국 돈보다는 달러를 환전해 가는 것이 유리합니다.\n- 동(VND) 사용: 현지에서는 베트남 동을 사용합니다. 큰 금액은 달러로 환전하고, 소액은 현지에서 동으로 환전하는 것이 좋습니다.\n- 카드 사용: 대형 호텔이나 관광지 상점에서는 카드 사용이 가능하지만, 작은 상점이나 시장에서는 현금을 준비해야 합니다.\n\n2. 언어:\n- 베트남어: 베트남의 공식 언어는 베트남어입니다.\n- 영어: 관광지나 호텔에서는 영어 소통이 가능하지만, 일반적인 상황에서는 베트남어를 몇 마디 할 수 있으면 더욱 편리합니다.\n\n3. 교통:\n- 택시: 가장 편리한 이동 수단이지만, 미터기를 켜지 않는 경우도 있으므로 주의해야 합니다.\n- 그랩: 우버와 비슷한 앱으로, 택시보다 저렴하고 안전하게 이용할 수 있습니다.\n- 오토바이: 현지인들이 주로 이용하는 교통수단으로, 투어를 통해 체험해 볼 수 있습니다.\n- 버스: 저렴한 가격으로 이동할 수 있지만, 시간이 오래 걸릴 수 있습니다.\n\n4. 음식:\n- 쌀국수: 베트남의 대표적인 음식으로, 다양한 종류의 쌀국수를 맛볼 수 있습니다.\n- 분짜: 쌀국수와 비슷하지만, 면 대신 쌀국수를 넣어 먹는 음식입니다.\n- 반미: 바게트 빵에 다양한 재료를 넣어 만든 샌드위치입니다.\n- 과일: 망고스틴, 드래곤프루트 등 다양한 열대 과일을 저렴하게 즐길 수 있습니다.\n\n5. 기타:\n- 전압: 베트남의 전압은 220V, 50Hz입니다. 한국에서 사용하는 전자제품을 가져갈 경우 변환 플러그가 필요합니다.\n- 팁: 식당이나 호텔에서 팁을 주는 것은 선택 사항입니다.\n- 물: 생수를 구입하여 마시는 것이 좋습니다.\n- 건강: 모기 기피제, 선크림 등을 준비하는 것이 좋습니다.\n- 여행자 보험: 만약의 경우를 대비하여 여행자 보험에 가입하는 것이 좋습니다.\n\n6. 추천 여행지:\n- 하노이: 베트남의 수도로, 호안끼엠 호수, 문묘 등 다양한 볼거리가 있습니다.\n- 호이안: 아름다운 고대 도시로, 등불이 켜진 야경이 아름답습니다.\n- 다낭: 해변 휴양 도시로, 미케 해변, 바나힐 등 다양한 즐길 거리가 있습니다.\n- 하롱베이: 아름다운 자연 경관을 자랑하는 곳으로, 크루즈 여행을 통해 감상할 수 있습니다.\n\n7. 기타 팁:\n- 흥정: 시장이나 작은 상점에서는 흥정을 통해 저렴하게 물건을 구입할 수 있습니다.\n- 미소: 베트남 사람들은 친절하고 미소가 아름다운 사람들입니다.\n- 문화 존중: 베트남의 문화를 존중하고, 현지인들의 생활 방식을 이해하려는 노력이 필요합니다.\n\n더 궁금한 점이 있다면 언제든지 질문해주세요!\n\n즐거운 베트남 여행 되세요!',
      role: "assistant" 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Gemini-1.5-flash');
  const scrollViewRef = useRef<ScrollView>(null); 

  const modelIcon = {
    Gemini: <Image style={styles.modelButtonIcon} source={require('@/assets/images/gemini-icon.png')} />,
    Claude: <Image style={styles.modelButtonIcon} source={require('@/assets/images/claude-icon.png')} />,
    GPT: <Image style={styles.modelButtonIcon} source={require('@/assets/images/gpt-icon.png')} />,
    Perplexity: <Image style={styles.modelButtonIcon} source={require('@/assets/images/perplexity-icon.png')} />,
  }

  const handleSend = async () => {
    if (inputText.trim() === '') return;

    const prompt = inputText;
    setInputText('');

    const newMessage = { id: messages.length + 1, content: prompt, role: "user" };
    setMessages(prevMessages => [...prevMessages, newMessage]);

    const botResponse: message = await getBotResponse(prompt, messages, selectedModel)
    setMessages(prevMessages => [...prevMessages, botResponse]);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    setModalVisible(false);
  };  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>챗봇</Text>
      <View style={styles.bar} />
      <ScrollView 
        ref={scrollViewRef} 
        style={styles.chatContainer} 
        contentContainerStyle={{ paddingBottom: 100 }}>
        {messages.map((msg) => (
          <View key={msg.id} style={[styles.messageBubble, msg.role === 'user' ? styles.userMessage : styles.botMessage]}>
            <Text style={[styles.messageText, msg.role === 'assistant' ? styles.botMessageText : styles.userMessageText]}>
              {msg.content}
            </Text>
          </View>
        ))}
      </ScrollView>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.inputContainer}>
        <TouchableOpacity style={styles.modelButton} onPress={() => setModalVisible(true)}>
          {
            selectedModel.split('-')[0] === 'Gemini' ? modelIcon.Gemini
            : selectedModel.split('-')[0] === 'Claude' ? modelIcon.Claude
            : selectedModel.split('-')[0] === 'GPT' ? modelIcon.GPT 
            : modelIcon.Perplexity
          }
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="메시지를 입력하세요..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>전송</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>챗봇 모델 선택</Text>
            <TouchableOpacity onPress={() => handleModelSelect('Gemini-1.5-flash')}>
              <Text style={styles.modalOption}>Gemini 1.5</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleModelSelect('Claude-3-haiku')}>
              <Text style={styles.modalOption}>Claude 3</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleModelSelect('GPT-4o')}>
              <Text style={styles.modalOption}>GPT-4o (준비중)</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleModelSelect('Perplexity')}>
              <Text style={styles.modalOption}>Perplexity (준비중)</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancel}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    paddingTop: 30,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Jua-Regular',
    color: '#007AFF',
    textAlign: 'center',
    paddingVertical: 15,
  },
  bar: {
    height: 2,
    backgroundColor: '#007AFF',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageBubble: {
    borderRadius: 20,
    padding: 15,
    marginVertical: 5,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#e1e1e1',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Jua-Regular',
    color: '#fff',
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  modelButton: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginRight: 10,
  },
  modelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modelButtonIcon: {
    borderColor: '#007AFF',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 50,
    height: 40,
    width: 40,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#e1e1e1',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: 'Jua-Regular',
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    padding: 10,
    marginLeft: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Jua-Regular',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: width * 0.8,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Jua-Regular',
    marginBottom: 20,
  },
  modalOption: {
    fontSize: 18,
    fontFamily: 'Jua-Regular',
    marginVertical: 10,
    color: '#007AFF',
    textAlign: 'center',
  },
  modalCancel: {
    fontSize: 18,
    fontFamily: 'Jua-Regular',
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
