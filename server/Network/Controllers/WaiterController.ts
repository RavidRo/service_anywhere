import {Request} from 'express';
import {makeGood} from 'server/Response';

import Controller, {Method} from '../Controller';
import {authenticate} from '../Middlewares';

import WaiterInterface from 'server/Interface/WaiterInterface';

export class WaiterController extends Controller {
	path = '/waiter'; // The path on which this.routes will be mapped
	routes = [
		{
			path: '/getGuestsDetails',
			method: Method.GET,
			handler: this.getGuestsDetails,
			localMiddleware: [authenticate(2)],
		},
		{
			path: '/getWaiterOrders',
			method: Method.GET,
			handler: this.getWaiterOrders,
			localMiddleware: [authenticate(2)],
		},
		{
			path: '/orderArrived',
			method: Method.POST,
			handler: this.orderArrived,
			localMiddleware: [authenticate(2)],
		},
		{
			path: '/orderOnTheWay',
			method: Method.POST,
			handler: this.orderOnTheWay,
			localMiddleware: [authenticate(2)],
		},
		{
			path: '/getWaiterName',
			method: Method.POST,
			handler: this.getWaiterName,
			localMiddleware: [authenticate(2)],
		},
	];

	getGuestsDetails(params: any) {
		const {ids} = params;

		return this.validateArgs(
			(ids: string[]) =>
				WaiterInterface.getGuestsDetails(ids).then(makeGood),
			ids
		);
	}

	getWaiterOrders(_: any, req: Request) {
		const userID = this.getUserID(req);
		return WaiterInterface.getWaiterOrders(userID);
	}

	orderArrived(params: any, req: Request) {
		const {orderID} = params;

		const userID = this.getUserID(req);

		return this.validateArgs(WaiterInterface.orderArrived, orderID, userID);
	}

	orderOnTheWay(params: any, req: Request) {
		const {orderID} = params;

		const userID = this.getUserID(req);

		return this.validateArgs(
			WaiterInterface.orderOnTheWay,
			orderID,
			userID
		);
	}

	getWaiterName(_: any, req: Request) {
		const userID = this.getUserID(req);
		return WaiterInterface.getWaiterName(userID);
	}
}
