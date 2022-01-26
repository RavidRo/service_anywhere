import React from 'react';
import {StyleSheet, Text} from 'react-native';
import Home from 'waiters_app/src/screens/Home';
import Orders from '../Orders';

type LoginViewProps = {
	connected: boolean;
};

export default function LoginView(props: LoginViewProps) {
	return props.connected ? (
		<Orders>
			<Home />
		</Orders>
	) : (
		<Text>Connecting to server...</Text>
	);
}

const _styles = StyleSheet.create({
	container: {},
});
