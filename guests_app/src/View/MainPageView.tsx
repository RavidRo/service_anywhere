import React from 'react';
import {ActivityIndicator, Button, Text, View} from 'react-native';
import {OrderID} from '../types';
import {observer} from 'mobx-react-lite';

type MainPageViewProps = {
	SendOrderToServer: () => void;
	hasActiveOrder: boolean;
	orderID: OrderID;
	orderStatus: string;
};
//const OrdersListView = observer((props: OrdersViewProps) => {

export const MainPage = observer((props: MainPageViewProps) => {
	if (props.hasActiveOrder) {
		return (
			<View>
				<Text>Order in progress...\n order id = {props.orderID}</Text>
				<Text>Order status: {props.orderStatus}</Text>
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
});
