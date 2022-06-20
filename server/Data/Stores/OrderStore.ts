import {makeFail, makeGood, ResponseMsg} from '../../Response';
import {AppDataSource} from '../data-source';
import {GuestDAO} from '../entities/Domain/GuestDAO';
import {ItemDAO} from '../entities/Domain/ItemDAO';
import {OrderDAO} from '../entities/Domain/OrderDAO';
import {OrderToItemDAO} from '../entities/Domain/OrderToItemDAO';
import {ReviewDAO} from '../entities/Domain/ReviewDAO';
import {WaiterDAO} from '../entities/Domain/WaiterDAO';

export async function getOrders(): Promise<OrderDAO[]> {
	const orderRepository = AppDataSource.getRepository(OrderDAO);
	return await orderRepository.find({
		relations: {
			guest: true,
			orderToItems: {
				item: true,
			},
			waiters: true,
			review: true,
		},
	});
}

export async function removeWaitersFromOrder(
	orderID: string
): Promise<ResponseMsg<void>> {
	const orderRepository = AppDataSource.getRepository(OrderDAO);
	const order = await orderRepository.findOne({where: {id: orderID}});
	if (order === null) {
		return makeFail('Requested order does not exist', 404);
	}
	order.waiters = [];
	await order.save();
	return makeGood();
}

export async function assignWaiter(
	ordersID: string,
	waiterIDs: string[]
): Promise<ResponseMsg<void>> {
	const order = await getOrder(ordersID);
	if (order === null) {
		// Orders existence should have been validated before hand
		return makeFail(
			'Something went wrong, could not find requested order',
			500
		);
	}

	const waiterRepository = AppDataSource.getRepository(WaiterDAO);
	const waiters = await Promise.all(
		waiterIDs.map(waiterID =>
			waiterRepository.findOne({where: {id: waiterID}})
		)
	);
	for (const waiter of waiters) {
		if (waiter) {
			order.waiters.push(waiter);
		} else {
			return makeFail(
				'Something went wrong, could not find requested waiter',
				500
			);
		}
	}

	await order.save();

	return makeGood();
}
export function getOrder(orderID: string) {
	const orderRepository = AppDataSource.getRepository(OrderDAO);
	return orderRepository.findOne({
		where: {id: orderID},
		relations: {
			guest: true,
			orderToItems: {
				item: true,
			},
			waiters: true,
		},
	});
}

export async function getReviews(): Promise<ReviewDAO[]> {
	const orderRepository = AppDataSource.getRepository(ReviewDAO);
	return await orderRepository.find();
}

export async function saveOrder(
	guestID: string,
	items: Map<string, number>
): Promise<ResponseMsg<OrderDAO>> {
	const guestRepository = AppDataSource.getRepository(GuestDAO);
	const itemRepository = AppDataSource.getRepository(ItemDAO);
	const orderToItemRepository = AppDataSource.getRepository(OrderToItemDAO);

	const guest = await guestRepository.findOne({where: {id: guestID}});

	if (!guest) {
		return makeFail('Could not find requested guest');
	}

	const itemsEntries = Array.from(items.entries());
	const itemIDs = itemsEntries.map(([itemID, _]) => itemID);
	const itemsDAOs = await itemRepository
		.createQueryBuilder()
		.where('ItemDAO.id IN (:...itemsIDs)', {itemsIDs: itemIDs})
		.getMany();

	if (itemsDAOs.length !== itemsEntries.length) {
		return makeFail('Some of the requested items does not exists');
	}

	const ordersToItems = itemsDAOs.map(ItemDAO => {
		const quantity = items.get(ItemDAO.id)!;
		const orderToItem = new OrderToItemDAO();
		orderToItem.item = ItemDAO;
		orderToItem.quantity = quantity;
		return orderToItem;
	});

	await orderToItemRepository.save(ordersToItems);

	const order = new OrderDAO();
	order.guest = guest;
	order.orderToItems = ordersToItems;
	order.creationTime = Date.now();
	const savedOrder = await order.save();
	savedOrder.guest = guest;

	return makeGood(savedOrder);
}
