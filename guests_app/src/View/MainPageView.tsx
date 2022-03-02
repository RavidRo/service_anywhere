import React from 'react';
import {
	ActivityIndicator,
	Button,
	SafeAreaView,
	Text,
	View,
} from 'react-native';
import { OrderID, OrderStatus } from '../types';

type MainPageViewProps = {
	SendOrderToServer: () => void;
	hasActiveOrder: boolean;
	orderStatus: string;
	orderID: OrderID;
};

export const MainPage = (props: MainPageViewProps) => {

	if (props.hasActiveOrder) {
		return (
			<View>
					<Text>
						Order in progress...\n order id = {props.orderID}
					</Text>
					<Text>
						Order status: {props.orderStatus}
					</Text>
					<ActivityIndicator size='large' color='#00ff00' />
			</View>
		);
	}
	return (
		<Button
				title='Order'
				onPress={() => {
					props.SendOrderToServer();
				}}
		/>
	);
};
