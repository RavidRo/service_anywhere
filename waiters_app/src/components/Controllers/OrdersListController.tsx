import React, {useState} from 'react';
import OrdersViewModel from 'waiters_app/src/ViewModel/OrdersViewModel';

import OrdersListView from '../Views/OrdersList';

type OrdersProps = {};

const ordersViewModel = new OrdersViewModel();

export default function OrdersList(_: OrdersProps) {
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
