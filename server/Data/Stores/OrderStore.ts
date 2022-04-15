import {makeFail, makeGood, ResponseMsg} from '../../Response';
import {AppDataSource} from '../data-source';
import {Order} from '../entities/Domain/Order';
import {Waiter} from '../entities/Domain/Waiter';

export async function getOrders(): Promise<Order[]> {
	const orderRepository = AppDataSource.getRepository(Order);
	return await orderRepository.find();
}

export async function saveOrders(orders: Order[]): Promise<Order[]> {
	const orderRepository = AppDataSource.getRepository(Order);
	return await orderRepository.save(orders);
}

export async function removeWaitersFromOrder(
	orderID: string
): Promise<ResponseMsg<void>> {
	const orderRepository = AppDataSource.getRepository(Order);
	const order = await orderRepository.findOne({where: {id: orderID}});
	if (order === null) {
		return makeFail('Requested order does not exist', 404);
	}
	order.waiters = [];
	await order.save();
	return makeGood();
}

export async function assignWaiter(
	ordersIDs: string[],
	waiterID: string
): Promise<ResponseMsg<void>> {
	const orderRepository = AppDataSource.getRepository(Order);
	const orders = await orderRepository
		.createQueryBuilder()
		.where('Order.id IN (:...ordersIDs)', {orderIDs: ordersIDs})
		.getMany();
	const waiterRepository = AppDataSource.getRepository(Waiter);
	const waiter = await waiterRepository.findOne({where: {id: waiterID}});
	if (!waiter) {
		// Waiter existence should have been validated before hand
		return makeFail(
			'Something went wrong, could not find requested waiter',
			500
		);
	}
	const saves = orders.map(order => {
		order.waiters.push(waiter);
		return order.save();
	});
	return Promise.all(saves).then(() => makeGood());
}
