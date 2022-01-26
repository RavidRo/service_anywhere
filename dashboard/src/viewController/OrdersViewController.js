import * as React from 'react';
import AppBarView from '../view/AppBarView';
// import { assignWaiter, getWaitersByOrder, getOrders } from "../network/api";
import OrderViewController from './OrderViewController';

function OrdersViewController(props) {
	const {ordersViewModel, waitersViewModel} = props;

	const [orders, setOrders] = React.useState([]);
	React.useEffect(() => {
		let mounted = true;
		ordersViewModel.getOrders().then(orders => {
			if (mounted) {
				setOrders(orders);
			}
		});
		return () => (mounted = false);
	}, []);

	return (
		<div>
			<AppBarView />
			{orders.map((order, index) => (
				<OrderViewController
					order={order}
					key={index}
					waitersViewModel={waitersViewModel}
				/>
			))}
		</div>
	);
}

export default OrdersViewController;
