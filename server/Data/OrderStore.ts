import {AppDataSource} from './data-source';
import {Order} from './entities/Domain/Order';

export async function getOrders(): Promise<Order[]> {
	const orderRepository = AppDataSource.getRepository(Order);
	return await orderRepository.find();
}

export async function saveOrders(orders: Order[]): Promise<Order[]> {
	const orderRepository = AppDataSource.getRepository(Order);
	return await orderRepository.save(orders);
}
