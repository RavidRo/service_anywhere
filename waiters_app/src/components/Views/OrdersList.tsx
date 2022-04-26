import {observer} from 'mobx-react-lite';
import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Order from 'waiters_app/src/Models/Order';

type OrdersViewProps = {
	orders: Order[];
	selectOrder: (string: string) => void;
	selectedOrderId: string | undefined;
};

const OrdersListView = observer((props: OrdersViewProps) => {
	return (
		<>
			{props.orders.length === 0 && (
				<View style={styles.noOrders}>
					<Text style={styles.noOrdersText}>
						{' '}
						You are not assigned to any orders
					</Text>
				</View>
			)}
			{props.orders.map((order, index) => {
				return (
					<TouchableOpacity
						key={order.id}
						onPress={() => props.selectOrder(order.id)}>
						<View
							style={[
								styles.orderContainer,
								index % 2 === 0
									? styles.background1
									: styles.background2,
							]}>
							<Text>{order.id}</Text>
							{props.selectedOrderId === order.id && (
								<Text>{order.items}</Text>
							)}
						</View>
					</TouchableOpacity>
				);
			})}
		</>
	);
});
export default OrdersListView;

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
	noOrders: {
		paddingTop: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	noOrdersText: {
		fontSize: 18,
	},
});
