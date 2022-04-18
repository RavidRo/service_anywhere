import React from 'react';
import {
	ActivityIndicator,
	Button,
	SafeAreaView,
	Text,
	View,
} from 'react-native';
import {OrderID} from '../types';

type MainPageViewProps = {
	SendOrderToServer: () => void;
	cancelOrder: () => void;
	hasActiveOrder: boolean;
	orderID: OrderID;
	orderStatus: string;
};

export const DummyPage =(props: MainPageViewProps) => {
	if (props.hasActiveOrder) {
		return (
			<View>
				<Text>
					{' Order in progress...\n order id'} = {props.orderID}{' '}
				</Text>
				<Text>
					{'Order status: '} {props.orderStatus}
				</Text>
				<ActivityIndicator size='large' color='#00ff00' />

				<Button
				title='Cancel Order'
				onPress={() => {
					props.cancelOrder();
				}}
		/>
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
