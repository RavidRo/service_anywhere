import {any} from 'prop-types';
import {OrderIDO} from '../../../api';
import {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import Singleton from '../singleton';

const axios = require('axios');
const config = require('./config.json');

const host = config.host;
const port = config.port;

const _host_port = `${host}:${port}`;
const base_route = `${host}`;

export default class Api extends Singleton {
	constructor() {
		super();
	}

	getOrders(): OrderIDO[] {
		console.log('Getting orders');
		const url = `${base_route}getOrders`;
		return axios({
			method: 'GET',
			url: url,
		})
			.then((res: AxiosResponse<any, any>) => {
				if (res.data) {
					return res.data;
				} else {
					console.log('Error in getting orders');
				}
			})
			.catch((err: any) => {
				alert(`failed to get orders due to ${err}`);
				return [];
			});
	}

	getWaiters(): string[] {
		const url = `${base_route}getWaiters`;
		return axios({
			method: 'GET',
			url: url,
		})
			.then((res: AxiosResponse<any, any>) => {
				if (res.data) {
					return res.data;
				} else {
					console.log('Error in getting waiters');
				}
			})
			.catch((err: any) => alert(`failed to get waiters due to ${err}`));
	}

	assignWaiter(orderId: string, waiterId: string): boolean {
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
			.then((res: AxiosResponse<any, any>) => {
				if (res.status) {
					return res.status < 400;
				} else {
					console.log('Error in assign waiter');
					return false;
				}
			})
			.catch((err: any) =>
				alert(`failed to assign waiter due to ${err}`)
			);
	}

	getWaitersByOrder(orderId: string): string[] {
		const url = `${base_route}getWaitersByOrder`;
		return axios({
			method: 'GET',
			url: url,
			params: {
				orderID: orderId,
			},
		})
			.then((res: AxiosResponse<any, any>) => {
				if (res.data) {
					return res.data;
				} else {
					console.log('Error in get waiter by order');
					return '';
				}
			})
			.catch((err: any) => {
				console.log(`failed to get waiter by order due to ${err}`);
				return '';
			});
	}

	changeOrderStatus(orderId: string, newStatus: string): boolean {
		const url = `${base_route}changeOrderStatus`; // not implemented in server yet, make sure it fits when implemented
		return axios({
			method: 'POST',
			url: url,
			params: {
				orderID: orderId,
				newStatus: newStatus,
			},
		})
			.then((res: AxiosResponse<any, any>) => {
				if (res.status) {
					console.log('Returning ' + (res.status < 400));
					return res.status < 400;
				} else {
					console.log('Error in get change order status');
					return false;
				}
			})
			.catch((err: any) => {
				console.log(`failed to change order status due to ${err}`);
				return false;
			});
	}

	cancelOrder(orderId: string): boolean {
		const url = `${base_route}cancelOrder`; // not implemented in server yet, make sure it fits when implemented
		return axios({
			method: 'POST',
			url: url,
			params: {
				orderID: orderId,
			},
		})
			.then((res: AxiosResponse<any, any>) => {
				if (res.status) {
					return res.status < 400;
				} else {
					console.log('Error in get cancel order');
					return false;
				}
			})
			.catch((err: any) => {
				console.log(`failed to cancel order due to ${err}`);
				return false;
			});
	}
}
