import {OrderIDO} from '../../../api';

const axios = require('axios');
const config = require('./config.json');

const host = config.host;
const port = config.port;

const _host_port = `${host}:${port}`;
const base_route = `${host}`;

export function getOrders(): OrderIDO[] {
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

export function getWaiters(): string[] {
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

export function assignWaiter(orderId: string, waiterId: string): boolean {
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

export function getWaitersByOrder(orderId: string): string[] {
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
		.catch(err => {
			console.log(`failed to get waiter by order due to ${err}`);
			return '';
		});
}

export function changeOrderStatus(orderId: string, newStatus: string): boolean {
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
				console.log('Returning ' + (res.status < 400));
				return res.status < 400;
			} else {
				console.log('Error in get change order status');
				return false;
			}
		})
		.catch(err => {
			console.log(`failed to change order status due to ${err}`);
			return false;
		});
}

export function cancelOrder(orderId: string): string {
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
