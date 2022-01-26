import React from 'react';
import {StyleSheet, Text} from 'react-native';
import MapScreenController from '../Controllers/MapScreenController';
import OrdersController from '../Controllers/OrdersController';

type LoginViewProps = {
	connected: boolean;
};

export default function LoginView(props: LoginViewProps) {
	return props.connected ? (
		<OrdersController>
			<MapScreenController />
		</OrdersController>
	) : (
		<Text>Connecting to server...</Text>
	);
}

const _styles = StyleSheet.create({
	container: {},
});
