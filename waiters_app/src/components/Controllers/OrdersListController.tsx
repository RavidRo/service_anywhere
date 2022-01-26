import React, {useContext, useState} from 'react';

import {OrdersContext} from '../../contexts';
import OrdersListView from '../Views/OrdersList';

type OrdersProps = {};

export default function OrdersList(_: OrdersProps) {
	const [selectedOrder, setSelectedOrder] = useState<string | undefined>();
	const orders = useContext(OrdersContext);
	const selectOrder = (orderId: string) => {
		setSelectedOrder(selectedOrder === orderId ? undefined : orderId);
	};
	return (
		<OrdersListView
			orders={orders}
			selectOrder={selectOrder}
			selectedOrderId={selectedOrder}
		/>
	);
}
