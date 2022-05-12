import React from 'react';
import {Button, StyleSheet, Text, TextInput} from 'react-native';
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
		</>
	);
}

const styles = StyleSheet.create({
	input: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10,
	},
	reconnecting: {
		fontSize: 16,
		color: '#e05555',
	},
});
