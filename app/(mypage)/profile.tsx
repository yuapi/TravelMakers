import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { api } from '@/config.json';
import { fetchAuthSession } from '@aws-amplify/auth';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

interface OriginalData {
  nickname: string;
  gender: string;
  birthday: string;
}

export default function ProfileEdit() {
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState('선택하세요');
  const [birthday, setBirthday] = useState('');
  const [isBirthdayPrivate, setIsBirthdayPrivate] = useState(false);
  const [originalData, setOriginalData] = useState<OriginalData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { tokens } = await fetchAuthSession();
        const response = await axios.get('/v1/user', {
          baseURL: api.baseURL,
          headers: { Authorization: tokens?.idToken?.toString() },
        });
        const data = JSON.parse(response.data.body);

        if (data) {
          setNickname(data.nickname || '');
          setGender(data.gender || '선택하세요');
          setBirthday(data.birthday || '');
          setIsBirthdayPrivate(!data.birthday);
          setOriginalData(data);
        }
      } catch (error) {
        console.error('Error from fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      const { tokens } = await fetchAuthSession();
      const newNickname = nickname.trim() === '' ? originalData?.nickname : nickname.trim();
      const newGender = gender === '선택하세요' ? originalData?.gender : gender;
      const newBirthday = isBirthdayPrivate ? '' : (birthday.trim() === '' ? originalData?.birthday : birthday.trim());

      const response = await axios.put(
        '/v1/user',
        { nickname: newNickname, gender: newGender, birthday: newBirthday },
        {
          baseURL: api.baseURL,
          headers: { Authorization: tokens?.idToken?.toString() },
        }
      );

      if (response.status === 200) {
        Alert.alert('알림', '정보가 업데이트되었습니다.');
        router.back();
      }
    } catch (error) {
      console.error('Error updating user information:', error);
      Alert.alert('오류', '정보 업데이트에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>개인정보 수정</Text>
      <View style={styles.bar} />

      <Text style={styles.label}>닉네임</Text>
      <TextInput value={nickname} onChangeText={setNickname} style={styles.input} />

      <Text style={styles.label}>성별</Text>
      <Picker
        selectedValue={gender}
        style={styles.picker}
        onValueChange={(itemValue) => setGender(itemValue)}
      >
        <Picker.Item label="선택하세요" value="선택하세요" />
        <Picker.Item label="남" value="Male" />
        <Picker.Item label="여" value="Female" />
        <Picker.Item label="비공개" value="Private" />
      </Picker>

      <Text style={styles.label}>생년월일</Text>
      <TextInput 
        value={isBirthdayPrivate ? '' : birthday} 
        onChangeText={setBirthday} 
        style={styles.input} 
        placeholder="YYYY-MM-DD" 
        editable={!isBirthdayPrivate} 
      />

      <Text style={styles.label}>생년월일 공개 여부</Text>
      <Picker
        selectedValue={isBirthdayPrivate ? '비공개' : '공개'}
        style={styles.picker}
        onValueChange={(itemValue) => setIsBirthdayPrivate(itemValue === '비공개')}
      >
        <Picker.Item label="공개" value="공개" />
        <Picker.Item label="비공개" value="비공개" />
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>저장하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF', 
  },
  title: {
    fontSize: 30,
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',  
    fontFamily: 'Montserrat-VariableFont_wght', 
    color: '#007aff', 
  },
  bar: {
    height: 2.5, 
    width: '200%', 
    backgroundColor: '#007AFF', 
    marginBottom: 20, 
    right: '50%', 
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    fontFamily: 'NanumGothic', 
    color: '#333', 
  },
  input: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    padding: 10,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontFamily: 'NanumGothic', 
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E6E6E6', 
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007aff', 
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'NanumGothic', 
  },
});
