import React, {useContext, useState} from 'react';
import {IDContext} from 'waiters_app/src/contexts';
import OrdersViewModel from 'waiters_app/src/ViewModel/OrdersViewModel';

import OrdersListView from '../Views/OrdersList';

type OrdersProps = {};

export default function OrdersList(_: OrdersProps) {
	const [selectedOrder, setSelectedOrder] = useState<string | undefined>();

	const id = useContext(IDContext);
	if (!id) {
		return <></>;
	}
	const ordersViewModel = new OrdersViewModel(id);
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
