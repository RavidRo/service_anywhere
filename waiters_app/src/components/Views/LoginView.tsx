import React from 'react';
import {StyleSheet, Text} from 'react-native';
import Home from 'waiters_app/src/screens/Home';
import OrdersController from '../Controllers/OrdersController';

type LoginViewProps = {
	connected: boolean;
};

export default function LoginView(props: LoginViewProps) {
	return props.connected ? (
		<OrdersController>
			<Home />
		</OrdersController>
	) : (
		<Text>Connecting to server...</Text>
	);
}

const _styles = StyleSheet.create({
	container: {},
});
