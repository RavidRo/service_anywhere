import * as React from 'react';
import AppBarView from '../view/AppBarView';
// import { assignWaiter, getWaitersByOrder, getOrders } from "../network/api";
import OrderViewController from './OrderViewController';
import propTypes from 'prop-types';

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

OrdersViewController.propTypes = {
	ordersViewModel: propTypes.object,
	waitersViewModel: propTypes.object,
};
