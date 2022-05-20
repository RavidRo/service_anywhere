import {observer} from 'mobx-react-lite';
import React from 'react';
import {View, StyleSheet, Button, Text, TouchableOpacity} from 'react-native';
import Order from 'waiters_app/src/Models/Order';

type OrderItemViewProps = {
	order: Order;
	selectedOrderID: string | undefined;
	evenItem: boolean;
	deliver: (orderID: string) => void;
	selectOrder: (string: string) => void;
	delivering: boolean;
};

export default observer(function OrderItemView(props: OrderItemViewProps) {
	return (
		<TouchableOpacity onPress={() => props.selectOrder(props.order.id)}>
			<View
				style={[
					styles.orderContainer,
					props.evenItem ? styles.background1 : styles.background2,
				]}>
				<View>
					<Text
						style={
							styles.orderText
						}>{`Order - ${props.order.id.slice(0, 5)} <${
						props.order.orderStatus
					}>`}</Text>
					<Button
						title='delivered'
						onPress={() => props.deliver(props.order.id)}
						disabled={props.delivering}
					/>
				</View>
				{props.selectedOrderID === props.order.id &&
					Object.entries(props.order.items).map(
						([name, quantity], index) => (
							<Text key={index} style={styles.itemsText}>
								{name} - {quantity}
							</Text>
						)
					)}
			</View>
		</TouchableOpacity>
	);
});

const styles = StyleSheet.create({
	background1: {
		backgroundColor: '#f5dabc',
	},
	background2: {
		backgroundColor: '#bcd8f5',
	},
	orderContainer: {
		paddingHorizontal: 20,
		paddingVertical: 7,
	},
	itemsText: {
		paddingLeft: 10,
		fontSize: 18,
	},
	orderText: {
		fontSize: 18,
	},
});
