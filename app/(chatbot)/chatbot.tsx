import React, { useState, useRef } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Dimensions, View, Modal, Image } from 'react-native';
import { Text } from '@/components/Themed';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/config.json';

const { width, height } = Dimensions.get('window'); // 현재 기기의 화면 크기를 가져와서 width와 height 변수에 저장합니다.

interface message { // 메시지 객체의 타입을 정의하는 인터페이스입니다.
  id: number // 각 메시지는 고유한 id, 메시지 내용(content), 역할(role)을 가집니다.
  content: string
  role: string
}

async function getBotResponse(prompt: string, messages: Array<message | null>, model: string): Promise<message> { // prompt: 사용자가 입력한 메시지 messages: 현재까지의 메시지 목록 model: 사용할 AI 모델 이름
  try { // 봇의 응답을 서버에서 가져오는 비동기 함수입니다.
    const resUser: string = await AsyncStorage.getItem('user') ?? ""; // 로컬 스토리지에서 사용자 정보를 가져옵니다.
    const userdata = JSON.parse(resUser); // JSON 형식의 사용자 정보를 객체로 변환합니다.
    const idToken = userdata.tokens.idToken; // 사용자 정보에서 idToken을 추출합니다.
    console.log(idToken); // 디버깅을 위한 로그
    const response = await axios.post('/v1/chat', { // 서버에 채팅 요청을 보냅니다. 서버의 응답이 성공적인 경우, 새로운 봇 메시지를 반환합니다.
      model: model, // AI 모델 (예: GPT-3.5)
      prompt: prompt, // 사용자의 입력
      prev: messages  // 이전 메시지들
    },
    {
      baseURL: api.baseURL,
      headers: { Authorization: idToken }, // 서버에 인증을 위한 토큰 전달

    });
    if (response.data.statusCode != 200) throw (response.data); // 서버 응답이 성공적이지 않은 경우 예외를 발생시킵니다.

    console.log(response.data); // 서버 응답 데이터 출력 (디버깅용)
    const data = JSON.parse(response.data.body); // 응답 body를 JSON 객체로 변환

    const botMsg: message = { // 서버에서 받은 응답을 사용해 새로운 봇 메시지 생성
      id: messages.length + 2, // 메시지 ID는 기존 메시지 수에 2를 더한 값
      content: data.content,   // 서버에서 받은 응답의 내용
      role: "assistant"        // 역할을 "assistant"로 설정
    };
    console.log(data); // 디버깅을 위한 로그

    return botMsg; // 새로 생성된 봇 메시지를 반환
  } catch (error) {
    console.log(error); // 오류가 발생하면 콘솔에 출력

    const errorMsg: message = {  // 오류 발생 시 사용자에게 표시할 기본 메시지
      id: messages.length + 2, // 메시지 ID
      content: "서버에 연결할 수 없습니다.", // 오류 메시지 내용
      role: "assistant" // 역할은 "assistant"로 설정
    };
    return errorMsg; // 오류 메시지 반환
  }
}

export default function ChatbotScreen() { // ChatbotScreen 컴포넌트를 정의합니다.
  const [messages, setMessages] = useState<Array<message>>([ // 상태 관리  messages: 현재까지의 메시지 목록 (사용자와 봇의 대화 기록) text: 사용자가 입력한 텍스트 메시지
    { // modalVisible: 모달 창의 표시 여부를 관리 model: 사용할 AI 모델 이름을 저장
      id: 1, 
      content: '베트남 여행 필수 정보 총정리! 🇻🇳\n\n베트남 여행, 정말 설레시죠? 흥미진진한 문화와 아름다운 자연을 동시에 만끽할 수 있는 매력적인 나라입니다.\n\n1. 환전 및 지불:\n- 달러 환전: 베트남에서 가장 통용되는 외화는 달러입니다. 한국 돈보다는 달러를 환전해 가는 것이 유리합니다.\n- 동(VND) 사용: 현지에서는 베트남 동을 사용합니다. 큰 금액은 달러로 환전하고, 소액은 현지에서 동으로 환전하는 것이 좋습니다.\n- 카드 사용: 대형 호텔이나 관광지 상점에서는 카드 사용이 가능하지만, 작은 상점이나 시장에서는 현금을 준비해야 합니다.\n\n2. 언어:\n- 베트남어: 베트남의 공식 언어는 베트남어입니다.\n- 영어: 관광지나 호텔에서는 영어 소통이 가능하지만, 일반적인 상황에서는 베트남어를 몇 마디 할 수 있으면 더욱 편리합니다.\n\n3. 교통:\n- 택시: 가장 편리한 이동 수단이지만, 미터기를 켜지 않는 경우도 있으므로 주의해야 합니다.\n- 그랩: 우버와 비슷한 앱으로, 택시보다 저렴하고 안전하게 이용할 수 있습니다.\n- 오토바이: 현지인들이 주로 이용하는 교통수단으로, 투어를 통해 체험해 볼 수 있습니다.\n- 버스: 저렴한 가격으로 이동할 수 있지만, 시간이 오래 걸릴 수 있습니다.\n\n4. 음식:\n- 쌀국수: 베트남의 대표적인 음식으로, 다양한 종류의 쌀국수를 맛볼 수 있습니다.\n- 분짜: 쌀국수와 비슷하지만, 면 대신 쌀국수를 넣어 먹는 음식입니다.\n- 반미: 바게트 빵에 다양한 재료를 넣어 만든 샌드위치입니다.\n- 과일: 망고스틴, 드래곤프루트 등 다양한 열대 과일을 저렴하게 즐길 수 있습니다.\n\n5. 기타:\n- 전압: 베트남의 전압은 220V, 50Hz입니다. 한국에서 사용하는 전자제품을 가져갈 경우 변환 플러그가 필요합니다.\n- 팁: 식당이나 호텔에서 팁을 주는 것은 선택 사항입니다.\n- 물: 생수를 구입하여 마시는 것이 좋습니다.\n- 건강: 모기 기피제, 선크림 등을 준비하는 것이 좋습니다.\n- 여행자 보험: 만약의 경우를 대비하여 여행자 보험에 가입하는 것이 좋습니다.\n\n6. 추천 여행지:\n- 하노이: 베트남의 수도로, 호안끼엠 호수, 문묘 등 다양한 볼거리가 있습니다.\n- 호이안: 아름다운 고대 도시로, 등불이 켜진 야경이 아름답습니다.\n- 다낭: 해변 휴양 도시로, 미케 해변, 바나힐 등 다양한 즐길 거리가 있습니다.\n- 하롱베이: 아름다운 자연 경관을 자랑하는 곳으로, 크루즈 여행을 통해 감상할 수 있습니다.\n\n7. 기타 팁:\n- 흥정: 시장이나 작은 상점에서는 흥정을 통해 저렴하게 물건을 구입할 수 있습니다.\n- 미소: 베트남 사람들은 친절하고 미소가 아름다운 사람들입니다.\n- 문화 존중: 베트남의 문화를 존중하고, 현지인들의 생활 방식을 이해하려는 노력이 필요합니다.\n\n더 궁금한 점이 있다면 언제든지 질문해주세요!\n\n즐거운 베트남 여행 되세요!',
      role: "assistant" // 초기 메시지는 봇의 응답으로 설정
    }
  ]);
const [inputText, setInputText] = useState(''); // 사용자 입력 상태 변수 inputText는 사용자 입력을 저장 상태를 관리하기 위한 useState 훅 사용
const [modalVisible, setModalVisible] = useState(false); // 모달 표시 여부 상태 변수 modalVisible은 모달의 가시성을 관리
const [selectedModel, setSelectedModel] = useState('Gemini-1.5-flash'); // 선택된 챗봇 모델 상태 변수 selectedModel은 선택된 챗봇 모델을 저장
const scrollViewRef = useRef<ScrollView>(null); // ScrollView 참조를 생성해 자동 스크롤 구현 ScrollView 참조를 사용해 스크롤 기능 제어

const modelIcon = { // 모델별 아이콘을 미리 정의해 쉽게 접근할 수 있도록 설정
  Gemini: <Image style={styles.modelButtonIcon} source={require('@/assets/images/gemini-icon.png')} />,
  Claude: <Image style={styles.modelButtonIcon} source={require('@/assets/images/claude-icon.png')} />,
  GPT: <Image style={styles.modelButtonIcon} source={require('@/assets/images/gpt-icon.png')} />,
  Perplexity: <Image style={styles.modelButtonIcon} source={require('@/assets/images/perplexity-icon.png')} />,
};

const handleSend = async () => { // 메시지 전송을 처리하는 함수
  if (inputText.trim() === '') return; // 입력된 텍스트가 공백인 경우 전송하지 않음

  const prompt = inputText; // 입력된 텍스트를 저장
  setInputText(''); // 입력 필드를 비움

  const newMessage = { id: messages.length + 1, content: prompt, role: "user" }; // 새로운 사용자 메시지 객체 생성
  setMessages(prevMessages => [...prevMessages, newMessage]); // 메시지 리스트에 추가

  const botResponse: message = await getBotResponse(prompt, messages, selectedModel);  // 챗봇 모델의 응답을 요청하고 응답 메시지를 받아옴
  setMessages(prevMessages => [...prevMessages, botResponse]); // 받은 챗봇 응답을 메시지 리스트에 추가

  setTimeout(() => { // 새 메시지가 화면에 보이도록 자동 스크롤
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, 100);
};

const handleModelSelect = (model: string) => { // 모델 선택 시 호출되는 함수로, 선택된 모델을 변경하고 모달을 닫음
  setSelectedModel(model); // 선택된 모델을 설정
  setModalVisible(false); // 모달을 닫음
};

return ( // 화면 구성 JSX 반환
  <View style={styles.container}>
    <Text style={styles.title}>챗봇</Text> {/* 타이틀 텍스트 */}
    <View style={styles.bar} /> {/* 화면 상단의 분리선 */}
    <ScrollView 
      ref={scrollViewRef} 
      style={styles.chatContainer} 
      contentContainerStyle={{ paddingBottom: 100 }}>
      {messages.map((msg) => ( // 메시지 배열을 반복하여 각각의 메시지를 렌더링
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
        } {/* 현재 선택된 모델의 아이콘을 렌더링 */}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        value={inputText}
        onChangeText={setInputText}
        placeholder="메시지를 입력하세요..."
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Text style={styles.sendButtonText}>전송</Text> {/* 전송 버튼 */}
      </TouchableOpacity>
    </KeyboardAvoidingView>
    <Modal visible={modalVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>챗봇 모델 선택</Text> {/* 모달 타이틀 */}
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
            <Text style={styles.modalCancel}>취소</Text> {/* 모달 취소 버튼 */}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  </View>
);
}

const styles = StyleSheet.create({ // 스타일 정의
  container: {
    flex: 1, // 화면을 채우도록 설정
    backgroundColor: '#F9FFFF', // 배경색
    paddingTop: 30, // 위쪽 여백
  },
  title: {
    fontSize: 30, // 글씨 크기
    fontFamily: 'Jua-Regular', // 글씨체
    color: '#007AFF', // 파란색 텍스트 색상
    textAlign: 'center', // 가운데 정렬
    paddingVertical: 15, // 위아래 여백
  },
  bar: {
    height: 2, // 분리선의 높이
    backgroundColor: '#007AFF', // 분리선의 색상
  },
  chatContainer: {
    flex: 1, // 남은 공간을 차지하도록 설정
    paddingHorizontal: 10, // 좌우 여백
  },
  messageBubble: {
    borderRadius: 20, // 모서리를 둥글게
    padding: 15, // 안쪽 여백
    marginVertical: 5, // 위아래 여백
    maxWidth: '80%', // 최대 너비 설정
  },
  userMessage: {
    backgroundColor: '#007AFF', // 사용자 메시지 배경색
    alignSelf: 'flex-end', // 오른쪽에 정렬
  },
  botMessage: {
    backgroundColor: '#e1e1e1', // 챗봇 메시지 배경색
    alignSelf: 'flex-start', // 왼쪽에 정렬
  },
  messageText: {
    fontSize: 16, // 글씨 크기
    fontFamily: 'Jua-Regular', // 글씨체 설정
    color: '#fff',
  },
  userMessageText: {
    color: '#fff', // 사용자 메시지 텍스트 색상 (흰색)
  },
  botMessageText: {
    color: '#000', // 챗봇 메시지 텍스트 색상 (검정색)
  },
  inputContainer: {
    flexDirection: 'row', // 가로 방향으로 정렬
    alignItems: 'center', // 세로 정렬
    padding: 10, // 여백 설정
    backgroundColor: '#fff', // 배경색 설정
  },
  modelButton: {
    backgroundColor: '#FFF',
    borderRadius: 20, // 둥근 모서리
    marginRight: 10, // 오른쪽 여백
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
    height: 40, // 아이콘의 높이
    width: 40, // 아이콘의 너비
  },
  input: {
    flex: 1, // 가능한 공간을 차지
    height: 50, // 높이 설정
    backgroundColor: '#e1e1e1',
    borderRadius: 25, // 둥근 모서리
    paddingHorizontal: 20, // 좌우 여백
    fontSize: 16, // 글씨 크기
    fontFamily: 'Jua-Regular', // 글씨체 설정
    color: '#333', // 텍스트 색상
  },
  sendButton: {
    backgroundColor: '#007AFF', // 버튼 배경색
    borderRadius: 25, // 둥근 모서리
    padding: 15, // 안쪽 여백
    marginLeft: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Jua-Regular',
  },
  modalContainer: {
    flex: 1, // 전체 화면을 채움
    justifyContent: 'center', // 중앙 정렬
    alignItems: 'center', // 중앙 정렬
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 검정색 배경
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