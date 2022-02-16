import React, {useContext, useState} from 'react';
import {OrdersContext} from 'waiters_app/src/contexts';

import OrdersListView from '../Views/OrdersList';

type OrdersProps = {};

export default function OrdersList(_: OrdersProps) {
	const ordersViewModel = useContext(OrdersContext);
	const [selectedOrder, setSelectedOrder] = useState<string | undefined>();

	const selectOrder = (orderId: string) => {
		setSelectedOrder(selectedOrder === orderId ? undefined : orderId);
	};
	return (
		<OrdersListView
			orders={ordersViewModel.orders}
			selectOrder={selectOrder}
			selectedOrderId={selectedOrder}
		/>
	);
}
