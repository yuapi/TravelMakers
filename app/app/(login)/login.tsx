import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Link } from 'expo-router';
import * as Linking from 'expo-linking';
import { Amplify } from 'aws-amplify';
import { Hub } from "@aws-amplify/core";
import { AuthUser, getCurrentUser, signInWithRedirect, signOut } from '@aws-amplify/auth';
import { cognito } from '@/config.json';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');

Amplify.configure({
	Auth: {
		Cognito: {
			userPoolClientId: cognito.userPoolClientId,
			userPoolId: cognito.userPoolId,
			loginWith: {
				oauth: {
					domain: cognito.domain,
					scopes: ['openid', 'email', 'profile'],
					redirectSignIn: [Linking.createURL('')],
					redirectSignOut: [Linking.createURL('')],
					responseType: 'code'
				}
			}
		}
	}	
})

export default function LoginScreen() {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [error, setError] = useState<unknown>(null);
	const [customState, setCustomState] = useState<string | null>(null);
	const [fontsLoaded] = useFonts({
		'Jua-Regular': require('../../assets/fonts/Jua-Regular.ttf'),
	});

	useEffect(() => {
		const unsubscribe = Hub.listen("auth", ({ payload }) => {
			switch (payload.event) {
				case "signInWithRedirect":
					getUser();
					break;
				case "signInWithRedirect_failure":
					setError("An error has occurred during the OAuth flow.");
					break;
				case "customOAuthState":
					setCustomState(payload.data);
					break;
			}
		});
		getUser();
		return unsubscribe;
	}, []);

	const getUser = async (): Promise<void> => {
		try {
			const currentUser = await getCurrentUser();
			setUser(currentUser);
		} catch (error) {
			console.error(error);
			console.log("Not signed in");
		}
	};

	if (!fontsLoaded) {
		return null;
	}

	return (
		<View style={styles.container}>
			<Image source={require('../../assets/images/logo.jpg')} style={styles.backgroundLogo} />
			<View style={styles.logoContainer}>
				<Text style={styles.title}>TravelMakers</Text>
				<Text style={styles.subtitle}>어디로 떠날지 모르겠을땐?</Text>
			</View>
			<TouchableOpacity style={styles.questionButton}>
				<Link href='/question1' style={styles.questionText}>Question1 테스트</Link>
			</TouchableOpacity>
			{user ? (
				<View style={styles.userInfo}>
					<Text style={styles.userName}>{user.username}</Text>
					<Button title="Sign Out" onPress={() => { signOut(); setUser(null) }} />
				</View>
			) : (
				<TouchableOpacity style={styles.loginButton} onPress={() => signInWithRedirect({ provider: 'Google' })}>
					<Image source={require('../../assets/images/web_light_sq_ctn.png')} resizeMode="contain" style={styles.googleLogo} />
				</TouchableOpacity>
			)}
			<Text style={styles.footerText}>
				------------------- 
				<Text style={styles.snsText}> SNS 계정으로 간편 가입 </Text>
				-------------------
			</Text>
			<Text style={styles.chatbotText}>CHAT BOT AI TRAVEL SERVICE</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F7FFFF',
		paddingBottom: 40,
	},
	backgroundLogo: {
		position: 'absolute',
		width: width,
		height: height * 0.6,
		opacity: 0.1,
		resizeMode: 'contain',
		top: 0,
	},
	logoContainer: {
		alignItems: 'center',
		marginBottom: 40,
		backgroundColor: 'transparent',
	},
	title: {
		fontSize: 55,
		fontFamily: 'Jua-Regular',
		color: '#007AFF',
		top: -60,
	},
	subtitle: {
		fontSize: 18,
		fontFamily: 'Jua-Regular',
		color: '#333',
		top: -50,
	},
	questionButton: {
		width: width * 0.6,
		height: 55,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#007AFF',
		borderRadius: 8,
		top: 20,
	},
	questionText: {
		fontSize: 23,
		color: '#fff',
		fontFamily: 'Jua-Regular',
	},
	loginButton: {
		width: width * 0.9,
		height: 100,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		bottom: -150,
	},
	googleLogo: {
		width: '60%',
		height: '60%', 
	},
	userInfo: {
		alignItems: 'center',
	},
	userName: {
		fontSize: 20,
		fontFamily: 'Jua-Regular',
		color: '#3E2723',
	},
	footerText: {
		fontSize: 16,
		color: '#747474',
		bottom: -40,
	},
	snsText: {
		fontFamily: 'Jua-Regular',
		color: '#747474',
	},
	chatbotText: {
		fontSize: 14,
		color: '#000',
		position: 'absolute',
		bottom: 10,
		fontFamily: 'Jua-Regular',
	},
});
