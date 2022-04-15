import {makeFail, makeGood, ResponseMsg} from '../../Response';
import {AppDataSource} from '../data-source';
import {Order} from '../entities/Domain/Order';
import {Waiter} from '../entities/Domain/Waiter';

// Testing
// let testWaiters: Waiter[] = [];
// test_resetWaiters();
// export function test_resetWaiters() {
// 	const waiter1 = new Waiter('0', '', true);
// 	const waiter2 = new Waiter('1', '', true);

// 	testWaiters = [waiter1, waiter2];
// }

export async function getWaiters(): Promise<Waiter[]> {
	// if (process.env['NODE_ENV'] === 'test') {
	// 	return testWaiters;
	// }
	const waiterRepository = AppDataSource.getRepository(Waiter);
	return await waiterRepository.find();
}

export async function getWaitersByOrder(
	orderId: string
): Promise<ResponseMsg<string[]>> {
	const waiterRepository = AppDataSource.getRepository(Order);
	const order = await waiterRepository.findOne({
		// TODO: Check if this helps
		// relations: {
		// 	waiters: true,
		// },
		where: {
			id: orderId,
		},
	});
	if (order === null) {
		return makeFail('Requested order does not exist');
	}
	return makeGood(order.waiters.map(waiter => waiter.id));
}

export async function getOrdersByWaiter(
	waiterId: string
): Promise<ResponseMsg<string[]>> {
	const waiterRepository = AppDataSource.getRepository(Waiter);
	const order = await waiterRepository.findOne({
		// TODO: Check if this helps
		// relations: {
		// 	waiters: true,
		// },
		where: {
			id: waiterId,
		},
	});
	if (order === null) {
		return makeFail('Requested order does not exist');
	}
	return makeGood(order.orders.map(order => order.id));
}
