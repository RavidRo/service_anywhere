import {Order, OrderID, WaiterID} from '../Types';

const axios = require('axios');
const config = require('./config.json');

const host = config.host;
const port = config.port;

const _host_port = `${host}:${port}`;
const base_route = `${host}`;

export function getOrders(): Order[] {
	console.log('Getting orders');
	const url = `${base_route}getOrders`;
	return axios({
		method: 'GET',
		url: url,
	})
		.then(res => {
			if (res.data) {
				return res.data;
			} else {
				console.log('Error in getting orders');
			}
		})
		.catch(err => {
			alert(`failed to get orders due to ${err}`);
			return [];
		});
}

export function getWaiters(): WaiterID[] {
	const url = `${base_route}getWaiters`;
	return axios({
		method: 'GET',
		url: url,
	})
		.then(res => {
			if (res.data) {
				return res.data;
			} else {
				console.log('Error in getting waiters');
			}
		})
		.catch(err => alert(`failed to get waiters due to ${err}`));
}

export function assignWaiter(orderId: OrderID, waiterId: WaiterID): boolean {
	const url = `${base_route}assignWaiter`;
	console.log(`${orderId}, ${waiterId}`);
	return axios({
		method: 'POST',
		url: url,
		data: {
			orderID: orderId,
			waiterID: waiterId,
		},
	})
		.then(res => {
			if (res.status) {
				return res.status < 400;
			} else {
				console.log('Error in assign waiter');
				return false;
			}
		})
		.catch(err => alert(`failed to assign waiter due to ${err}`));
}

export function getWaitersByOrder(orderId: OrderID): WaiterID[] {
	const url = `${base_route}getWaitersByOrder`;
	return axios({
		method: 'GET',
		url: url,
		params: {
			orderID: orderId,
		},
	})
		.then(res => {
			if (res.data) {
				return res.data;
			} else {
				console.log('Error in get waiter by order');
				return '';
			}
		})
		.catch(err =>
			{console.log(`failed to get waiter by order due to ${err}`);
			return '';}
		);
}

export function changeOrderStatus(
	orderId: OrderID,
	newStatus: string
): boolean {
	const url = `${base_route}changeOrderStatus`; // not implemented in server yet, make sure it fits when implemented
	return axios({
		method: 'POST',
		url: url,
		params: {
			orderID: orderId,
			newStatus: newStatus,
		},
	})
		.then(res => {
			if (res.status) {
				return res.status < 400;
			} else {
				console.log('Error in get change order status');
			}
		})
		.catch(err =>
			console.log(`failed to change order status due to ${err}`)
		);
}

export function cancelOrder(orderId: OrderID): string {
	const url = `${base_route}cancelOrder`; // not implemented in server yet, make sure it fits when implemented
	return axios({
		method: 'POST',
		url: url,
		params: {
			orderID: orderId,
		},
	})
		.then(res => {
			if (res.status) {
				return res.status < 400;
			} else {
				console.log('Error in get cancel order');
			}
		})
		.catch(err => console.log(`failed to cancel order due to ${err}`));
}
