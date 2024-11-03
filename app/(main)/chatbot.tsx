import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Dimensions, View, Modal, Image } from 'react-native';
import { Text } from '@/components/Themed';
import axios from 'axios';
import { api } from '@/config.json';
import { fetchAuthSession } from '@aws-amplify/core';
import { useLocalSearchParams } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface message {
  id: number
  content: string
  role: string
}

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Array<message>>([]);
  const [inputText, setInputText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Gemini-1.5-flash');
  const scrollViewRef = useRef<ScrollView>(null); 
  const params = useLocalSearchParams();

  const modelIcon = {
    Gemini: <Image style={styles.modelButtonIcon} source={require('@/assets/images/gemini-icon.png')} />,
    Claude: <Image style={styles.modelButtonIcon} source={require('@/assets/images/claude-icon.png')} />,
    GPT: <Image style={styles.modelButtonIcon} source={require('@/assets/images/gpt-icon.png')} />,
    Perplexity: <Image style={styles.modelButtonIcon} source={require('@/assets/images/perplexity-icon.png')} />,
  }

  useEffect(() => {
    if (messages.length === 0 && params.destination) {
      loadDestination()
    }
  }, []);

  async function loadDestination() {
    let prompt = `사용자의 특성 정보를 바탕으로 선택한 여행지에 대한 여행 정보와 맞춤형 여행 계획을 제공해주세요.
    단, 응답에는 사용자 특성 정보(나이, 예산, 여행 동반자, 성별 등)를 포함하지 마세요.
      
    사용자 특성:
    1. 나이: ${params.age}세
    2. 예산: ${params.budget} 원
    3. 여행 동반자: ${params.companion} 
    4. 여행 일정 복잡도: ${params.complexity} 
    5. 선택한 여행지: ${params.destination}
    6. 여행 기간: ${params.duration}
    7. 성별: ${params.gender}
    8. 여행 테마: ${params.theme}
    
    제공할 정보:
    - 선택한 여행지에 대한 주요 관광 명소
    - 추천 활동 및 체험
    - 사용자의 일정에 맞춘 추천 일정(여행 기간 동안의 세부 일정)
    - 예산에 따른 비용 분배 (숙박, 식사, 교통비 등)
    - 해당 여행지에서 유의해야 할 팁 및 조언
    
    위 정보를 바탕으로 사용자가 선택한 여행지에 맞춤형 여행 계획을 작성해주세요.
    단, 응답에는 사용자 특성 정보(나이, 예산, 여행 동반자, 성별 등)를 포함하지 마세요.`
    console.log(prompt);
    const botResponse: message = await getBotResponse(prompt, messages, messages.length)
    setMessages(prevMessages => [...prevMessages, botResponse]);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }

  async function getBotResponse(prompt: string, messages: Array<message | null>, prvId=messages.length + 1): Promise<message> {
    try {
      const { tokens } = await fetchAuthSession();

      const response = await axios.post(`/v1/chat`, {
        model: selectedModel,
        prompt: prompt,
        prev: messages
      },
      {
        baseURL: api.baseURL,
        headers: { Authorization: tokens?.idToken?.toString() },
      });
      if (response.data.statusCode != 200) throw (response.data);
  
      console.log(response.data);
      const data = JSON.parse(response.data.body);
    
      const botMsg: message = {
        id: prvId + 1,
        content: data.content,
        role: "assistant"
      }
      console.log(data);
    
      return botMsg;
    } catch (error) {
      console.log(error);
  
      const errorMsg: message = {
        id: prvId + 1,
        content: "서버에 연결할 수 없습니다.",
        role: "assistant"
      }
      return errorMsg;
    }
  }

  const handleSend = async () => {
    if (inputText.trim() === '') return;

    const prompt = inputText;
    setInputText('');

    const newMessage = { id: messages.length + 1, content: prompt, role: "user" };
    setMessages(prevMessages => [...prevMessages, newMessage]);

    const botResponse: message = await getBotResponse(prompt, messages)
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
        contentContainerStyle={{ paddingBottom: 5 }}>
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
              <Text style={styles.modalOption}>GPT-4o</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleModelSelect('Sonar')}>
              <Text style={styles.modalOption}>Perplexity Sonar</Text>
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
    backgroundColor: '#FFFF',
    paddingTop: 30,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Montserrat-VariableFont_wght',
    fontWeight: 'bold', 
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
    fontFamily: 'NanumGothic',
    color: '#fff',
  },
  userMessageText: {
    color: '#fff',
    fontFamily: 'NanumGothic',
  },
  botMessageText: {
    color: '#000',
    fontFamily: 'NanumGothic',
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
    fontFamily: 'NanumGothic',
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
    fontFamily: 'NanumGothic',
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
    fontFamily: 'NanumGothic',
    marginBottom: 20,
  },
  modalOption: {
    fontSize: 18,
    fontFamily: 'NanumGothic',
    marginVertical: 10,
    color: '#007AFF',
  },
  modalCancel: {
    fontSize: 18,
    fontFamily: 'NanumGothic',
    marginVertical: 10,
    textAlign: 'center',
    color: '#999',
  },
});