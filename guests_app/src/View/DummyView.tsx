import React from 'react';
import {
	ActivityIndicator,
	Button,
	SafeAreaView,
	Text,
	View,
} from 'react-native';
import {OrderID, OrderStatus} from '../types';
import {observer} from 'mobx-react-lite';

type MainPageViewProps = {
	SendOrderToServer: () => void;
	hasActiveOrder: boolean;
	orderID: OrderID;
	orderStatus: string;
};
//const OrdersListView = observer((props: OrdersViewProps) => {

export const DummyPage = observer((props: MainPageViewProps) => {
	if (props.hasActiveOrder) {
		return (
			<View>
				<Text>{" Order in progress...\n order id"} = {props.orderID} </Text>
				<Text>{"Order status: "} {props.orderStatus}</Text>
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
