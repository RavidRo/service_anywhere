import React from 'react';
import {ActivityIndicator, Button, Text, View} from 'react-native';
import {OrderID, OrderStatus} from '../types';
import {observer} from 'mobx-react-lite';

type MainPageViewProps = {
	sendOrderToServer: () => void;
	cancelOrder: () => void;
	hasActiveOrder: boolean;
	orderID: OrderID;
	orderStatus: string;
};
//const OrdersListView = observer((props: OrdersViewProps) => {

export const MainPage = observer((props: MainPageViewProps) => {
	if (props.hasActiveOrder) {
		return (
			<View>
				<Text>
					{'\t Order in progress...\n \t order id ='} {props.orderID}
				</Text>
				<Text>
					{'\t Order status:'} {props.orderStatus}
				</Text>
				<ActivityIndicator size='large' color='#00ff00' />
				{props.orderStatus === 'received' ? 
				(<Button title='Cancel Order' onPress={props.cancelOrder} />) : 
				(<Text> {'\t cannot cancel order in making'} </Text>)}
			</View>
		);
	}
	return <Button title='Order' onPress={props.sendOrderToServer} />;
});
