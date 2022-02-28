import React from 'react';
import {Button, StyleSheet, Text, TextInput} from 'react-native';
import MapScreenController from '../Controllers/MapScreenController';

type LoginViewProps = {
	isConnected: boolean;
	loggedIn: boolean;
	isLoading: boolean;
	password: string;
	onPasswordChange: (newPassword: string) => void;
	onSubmit: () => void;
	establishConnection: () => void;

	isReconnecting: boolean;
};

export default function LoginView(props: LoginViewProps) {
	return props.isConnected ? (
		<>
			{props.isReconnecting && (
				<Text>Connection lost, trying to reconnect...</Text>
			)}
			<MapScreenController />
		</>
	) : props.loggedIn ? (
		<>
			<Button
				title='Retry'
				onPress={props.establishConnection}
				disabled={props.isLoading}
			/>
			{props.isLoading && <Text>Establishing connection...</Text>}
		</>
	) : (
		<>
			<TextInput
				style={styles.input}
				onChangeText={props.onPasswordChange}
				value={props.password}
				placeholder='Your Password'
				secureTextEntry
			/>
			<Button
				title='Log in'
				onPress={props.onSubmit}
				disabled={props.isLoading}
			/>
			{props.isLoading && <Text>Logging in...</Text>}
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
});
