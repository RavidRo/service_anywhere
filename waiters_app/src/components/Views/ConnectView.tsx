import React from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import MapScreenController from '../Controllers/MapScreenController';

type LoginViewProps = {
	isConnected: boolean;
	loggedIn: boolean;
	isLoading: boolean;
	password: string;
	onPasswordChange: (newPassword: string) => void;
	onSubmit: (password: string) => void;
	establishConnection: () => void;

	isReconnecting: boolean;
};

export default function LoginView(props: LoginViewProps) {
	if (props.isConnected) {
		return (
			<>
				{props.isReconnecting && (
					<Text style={styles.reconnecting}>
						Connection lost, trying to reconnect...
					</Text>
				)}
				<MapScreenController />
			</>
		);
	}
	if (props.loggedIn) {
		return (
			<>
				{props.isLoading ? (
					<Text testID='connecting'>Establishing connection...</Text>
				) : (
					<Button
						title='Retry'
						onPress={props.establishConnection}
						disabled={props.isLoading}
						testID='retry'
					/>
				)}
			</>
		);
	}

	return (
		<>
			<View style={styles.buttonContainer}>
				<TextInput
					style={styles.input}
					onChangeText={props.onPasswordChange}
					value={props.password}
					placeholder='Your Password'
					secureTextEntry
					testID='passwordInput'
				/>
				<Button
					title='Log in'
					onPress={() => props.onSubmit(props.password)}
					disabled={props.isLoading}
					testID='submit'
				/>
				{props.isLoading && <Text testID='loading'>Logging in...</Text>}
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	input: {
		height: 40,
		marginBottom: 15,
		borderWidth: 1,
		textAlign: 'center',
	},
	reconnecting: {
		fontSize: 16,
		color: '#e05555',
	},
	buttonContainer: {
		paddingHorizontal: 20,
		flex: 1,
		justifyContent: 'center',
		paddingBottom: 30,
	},
});
