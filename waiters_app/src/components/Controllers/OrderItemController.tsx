import {observer} from 'mobx-react-lite';
import React, {useContext, useState} from 'react';
import {Alert} from 'react-native';
import {OrdersContext} from 'waiters_app/src/contexts';
import Order from 'waiters_app/src/Models/Order';
import OrderItemView from '../Views/OrderItemView';

type OrderItemControllerProps = {
	order: Order;
	selectedOrderID: string | undefined;
	evenItem: boolean;
	selectOrder: (string: string) => void;
};

export default observer(function OrderItemController(
	props: OrderItemControllerProps
) {
	const ordersViewModel = useContext(OrdersContext);
	const [delivering, setDelivering] = useState(false);
	const deliver = (orderID: string) => {
		setDelivering(true);
		ordersViewModel
			.deliver(orderID)
			.finally(() => {
				setDelivering(false);
			})
			.catch(e => {
				Alert.alert(e);
			});
	};
	return (
		<OrderItemView deliver={deliver} delivering={delivering} {...props} />
	);
});
