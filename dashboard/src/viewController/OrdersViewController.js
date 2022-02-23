import * as React from 'react';
import AppBarView from '../view/AppBarView';
// import { assignWaiter, getWaitersByOrder, getOrders } from "../network/api";
import OrderViewController from './OrderViewController';
import propTypes from 'prop-types';

function OrdersViewController(props) {
	const {ordersViewModel, waitersViewModel} = props;

	return (
		<div>
			<AppBarView />
			{ordersViewModel.orders.map((order, index) => (
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
