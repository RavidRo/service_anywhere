import React, {useContext} from 'react';
import OrdersViewModel from 'waiters_app/src/ViewModel/OrdersViewModel';

import {IDContext, OrdersContext} from '../../contexts';

const Orders: React.FC = ({children}) => {
	const id = useContext(IDContext);
	const orderViewModel = id !== undefined && new OrdersViewModel(id);

	return (
		<OrdersContext.Provider
			value={orderViewModel ? orderViewModel.getOrders() : []}>
			{children}
		</OrdersContext.Provider>
	);
};

export default Orders;
