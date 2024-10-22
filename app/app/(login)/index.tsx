import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';

import { Link, router } from 'expo-router';
import * as Linking from 'expo-linking';
import { Amplify } from 'aws-amplify';
import { Hub } from "@aws-amplify/core";
import { AuthUser, getCurrentUser, signInWithRedirect, signOut } from '@aws-amplify/auth';
import { cognito } from '@/config.json';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window'); // 화면 크기 가져오기

Amplify.configure({ // AWS Amplify 설정
	Auth: {
		Cognito: {
			userPoolClientId: cognito.userPoolClientId,
			userPoolId: cognito.userPoolId,
			loginWith: {
				oauth: {
					domain: cognito.domain,
					scopes: ['openid', 'email', 'profile'],
					redirectSignIn: [Linking.createURL('main')], // 로그인 후 리디렉션 URL
					redirectSignOut: [Linking.createURL('index')], // 로그아웃 후 리디렉션 URL
					responseType: 'code' // OAuth 응답 유형
				}
			}
		}
	}	
})

export default function LoginScreen() {
	const [fontsLoaded] = useFonts({
		'Jua-Regular': require('../../assets/fonts/Jua-Regular.ttf'), // 사용할 폰트 로드
	});

	useEffect(() => {
		getUser(); // 컴포넌트가 마운트될 때 사용자 정보를 가져옴
	}, []);

	const getUser = async (): Promise<void> => {
		try {
			const currentUser = await getCurrentUser(); // 현재 로그인한 사용자 정보 가져오기
			router.replace('/main') // 로그인한 사용자일 경우 메인 페이지로 이동
		} catch (error) {
			console.error(error); // 오류 로그
			console.log("Not signed in"); // 로그인하지 않은 경우 메시지 출력
		}
	};

	if (!fontsLoaded) {
		return null; // 폰트가 로드되지 않은 경우 아무것도 렌더링하지 않음
	}

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<View style={styles.logoContainer}>
			    <Image source={require('../../assets/images/logo.jpg')} resizeMode="contain" style={styles.backgroundLogo} />
				<Text style={styles.title}>TravelMakers</Text>
				<Text style={styles.subtitle}>어디로 떠날지 모르겠을땐?</Text>
			</View>
			<TouchableOpacity style={styles.questionButton}>
				<Link href='/main' style={styles.questionText}>Question1</Link>
			</TouchableOpacity>
			<TouchableOpacity style={styles.loginButton} onPress={() => signInWithRedirect({ provider: 'Google' })}>
				<Image source={require('../../assets/images/web_light_sq_ctn.png')} resizeMode="contain" style={styles.googleLogo} />
			</TouchableOpacity>
			<Text style={styles.footerText}>
				---------------------- 
				<Text style={styles.snsText}> SNS 계정으로 간편 가입 </Text>
				----------------------
			</Text>
			<Text style={styles.chatbotText}>CHAT BOT AI TRAVEL SERVICE</Text>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1, 
		justifyContent: 'center', 
		alignItems: 'center', 
		backgroundColor: '#F9FFFF', 
		paddingBottom: 40, 
	},
	backgroundLogo: {
		width: width * 2, // 너비를 줄여서 배치 조정
		height: 430, // 높이를 줄여서 조정
		top: 110, // 약간만 위로 이동
	},
	logoContainer: {
		alignItems: 'center', 
		marginBottom: 20, 
		backgroundColor: 'transparent', 
	},
	title: {
		fontSize: 60, // 글씨 크기를 줄임
		fontWeight: 'bold', 
		fontFamily: 'Tenada', 
		color: '#007AFF', 
		top: -360, // 위쪽으로 조금 이동
	},
	subtitle: {
		fontSize: 16, // 크기 조정
		fontFamily: 'Jua-Regular', 
		color: '#333', 
		top: -350, // 제목과 간격을 조정
	},
	questionButton: {
		width: width * 0.6, 
		height: 50, 
		justifyContent: 'center', 
		alignItems: 'center', 
		backgroundColor: '#007AFF', 
		borderRadius: 8, 
		top: 70, // 버튼 위치를 아래로 조금 조정
	},
	questionText: {
		fontSize: 20, // 글씨 크기 조정
		fontWeight: 'bold', 
		color: '#fff', 
		fontFamily: 'UhBee JJIBBABBA Bold',
	},
	loginButton: {
		width: width * 0.9, 
		height: 70, // 버튼 높이를 줄임
		justifyContent: 'center', 
		alignItems: 'center', 
		borderRadius: 5, 
		bottom: 120, // 약간 위로 조정
	},
	googleLogo: {
		width: '100%', // 이미지 크기 줄임
		height: '60%', 
	},
	footerText: {
		fontSize: 14, // 글씨 크기 조정
		color: '#747474', 
		bottom: 100, 
	},
	snsText: {
		fontFamily: 'Jua-Regular', 
		color: '#747474',
	},
	chatbotText: {
		fontSize: 12, 
		color: '#000', 
		position: 'absolute', 
		bottom: 10, 
		fontFamily: 'Jua-Regular', 
	},
});
