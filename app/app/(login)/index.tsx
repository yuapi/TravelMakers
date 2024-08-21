import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Link } from 'expo-router';
import * as Linking from 'expo-linking';
import { Amplify } from 'aws-amplify';
import { Hub } from "@aws-amplify/core";
import { AuthUser, getCurrentUser, signInWithRedirect, signOut } from '@aws-amplify/auth';
import { cognito } from '@/config.json';

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
				setCustomState(payload.data); // this is the customState provided on signInWithRedirect function
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

	return (
		<View style={styles.container}>
			<View style={styles.logoContainer}>
				<Image source={require('../../assets/images/logo.jpg')} style={styles.logo} />
				<Text style={styles.title}>TravelMakers</Text>
				<Text style={styles.subtitle}>어디로 떠날지 모르겠을땐?</Text>
			</View>
			{user ? (
				<View style={styles.userInfo}>
				<Text style={styles.userName}>{user.username}</Text>
				<Text style={styles.userName}>{user.userId}</Text>
				<Button title="Sign Out" onPress={() => {signOut(); setUser(null)}}></Button>
				</View>
			) : (
				<TouchableOpacity style={styles.loginButton} onPress={() => signInWithRedirect({provider: 'Google'})}>
				<Image source={require('../../assets/images/web_light_sq_ctn.png')} resizeMode="contain" />
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
		justifyContent: 'center',
		alignItems: 'stretch',
		borderRadius: 5,
		marginBottom: 20,
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
