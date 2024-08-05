import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { Text, View } from '@/components/Themed';
import { kakao_api_key } from '@/config.json';  
import { Link } from 'expo-router';

const REDIRECT_URI = AuthSession.makeRedirectUri();
const KAKAO_AUTH_URL = 'https://kauth.kakao.com/oauth/authorize';
const TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
const USER_INFO_URL = 'https://kapi.kakao.com/v2/user/me';

// Discovery Document (replace with the correct configuration if available)
const DISCOVERY_DOC = {
  authorizationEndpoint: KAKAO_AUTH_URL,
  tokenEndpoint: TOKEN_URL,
  revocationEndpoint: '', // You can leave it empty if not used
};

interface UserInfo {
  properties: {
    nickname: string;
    profile_image: string;
  };
}

export default function LoginScreen() {
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

	// Create an AuthRequest instance
	const [request, response, promptAsync] = AuthSession.useAuthRequest(
	  {
      clientId: kakao_api_key,
      scopes: ['profile_nickname', 'profile_image'],
      redirectUri: REDIRECT_URI,
      responseType: 'code',
	  },
	  DISCOVERY_DOC
	);
  
	useEffect(() => {
	  if (response?.type === 'success' && response.params.code) {
		const fetchToken = async () => {
		  const tokenResponse = await fetch(TOKEN_URL, {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: `grant_type=authorization_code&client_id=${kakao_api_key}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&code=${response.params.code}`,
		  });
  
		  const { access_token } = await tokenResponse.json();
  
		  const userResponse = await fetch(USER_INFO_URL, {
			headers: {
			  Authorization: `Bearer ${access_token}`,
			},
		  });
  
		  const user: UserInfo = await userResponse.json();
		  setUserInfo(user);
		};
  
		fetchToken();
	  }
	}, [response]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/images/logo.jpg')} style={styles.logo} />
        <Text style={styles.title}>TravelMakers</Text>
        <Text style={styles.subtitle}>어디로 떠날지 모르겠을땐?</Text>
      </View>
      {userInfo ? (
        <View style={styles.userInfo}>
          <Image source={{ uri: userInfo.properties.profile_image }} style={styles.profileImage} />
          <Text style={styles.userName}>{userInfo.properties.nickname}</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.loginButton} onPress={() => promptAsync()}>
          <Image source={require('../../assets/images/kakao-login.png')} style={styles.kakaoLogo} resizeMode="contain" />
        </TouchableOpacity>
      )}
      <Text style={styles.footerText}>SNS 계정으로 간편 가입</Text>
      <Text style={styles.chatbotText}>CHAT BOT AI TRAVEL SERVICE</Text>
	  <Link href='/question1'>Question1 테스트</Link>
    </View>
  );
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
	  },
	  logoContainer: {
		alignItems: 'center',
		marginBottom: 20,
	  },
	  logo: {
		width: 80,
		height: 80,
		marginBottom: 10,
	  },
	  title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#007AFF',
	  },
	  subtitle: {
		fontSize: 16,
		color: '#000000',
		marginBottom: 30,
	  },
	  loginButton: {
		width: 200,
		height: 50,
		justifyContent: 'center',
		alignItems: 'stretch',
		backgroundColor: '#FEE500',
		borderRadius: 5,
		marginBottom: 20,
	  },
	  kakaoLogo: {
		width: 200,  // or any desired width
		height: 40,  // or any desired height
	  },
	  userInfo: {
		alignItems: 'center',
	  },
	  profileImage: {
		width: 100,
		height: 100,
		borderRadius: 50,
		marginBottom: 20,
	  },
	  userName: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#3E2723',
	  },
	  footerText: {
		fontSize: 16,
		color: '#000000',
		marginTop: 20,
	  },
	  chatbotText: {
		fontSize: 14,
		color: '#000000',
		marginTop: 10,
	  },
});
