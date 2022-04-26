import {makeFail, makeGood, ResponseMsg} from '../../Response';
import {AppDataSource} from '../data-source';
import {OrderDAO} from '../entities/Domain/OrderDAO';
import {WaiterDAO} from '../entities/Domain/WaiterDAO';

export async function getWaiters(): Promise<WaiterDAO[]> {
	const waiterRepository = AppDataSource.getRepository(WaiterDAO);
	return await waiterRepository.find({
		relations: {
			orders: true,
		},
	});
}

export async function getWaitersByOrder(
	orderID: string
): Promise<ResponseMsg<string[]>> {
	const orderRepository = AppDataSource.getRepository(OrderDAO);
	const order = await orderRepository.findOne({
		relations: {
			waiters: true,
		},
		where: {
			id: orderID,
		},
	});
	if (order === null) {
		return makeFail('Requested order does not exist');
	}
	return makeGood(order.waiters.map(waiter => waiter.id));
}

export async function getOrdersByWaiter(
	waiterID: string
): Promise<ResponseMsg<OrderDAO[]>> {
	const waiterRepository = AppDataSource.getRepository(WaiterDAO);
	const waiter = await waiterRepository.findOne({
		relations: {
			orders: {
				orderToItems: {
					item: true,
				},
				guest: true,
			},
		},
		where: {
			id: waiterID,
		},
	});
	if (waiter === null) {
		return makeFail('Requested waiter does not exist');
	}
	return makeGood(waiter.orders);
}
export async function getWaiter(waiterID: string) {
	const waiterRepository = AppDataSource.getRepository(WaiterDAO);
	const waiter = await waiterRepository.findOne({
		where: {
			id: waiterID,
		},
	});
	return makeGood(waiter);
}

