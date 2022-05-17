import {BaseEntity, EntityTarget} from 'typeorm';
import {AppDataSource} from './data-source';
import {UserCredentials} from './entities/Authentication/UserCredentials';
import {GuestDAO} from './entities/Domain/GuestDAO';
import {ItemDAO} from './entities/Domain/ItemDAO';
import {OrderDAO} from './entities/Domain/OrderDAO';
import {OrderToItemDAO} from './entities/Domain/OrderToItemDAO';
import {WaiterDAO} from './entities/Domain/WaiterDAO';
import config from 'server/config.json';

async function saveAll<T extends BaseEntity>(entities: T[]): Promise<void> {
	const saves = entities.map(item => item.save());
	await Promise.all(saves);
}

function clearTable<T>(entityClass: EntityTarget<T>) {
	const itemRepository = AppDataSource.getRepository(entityClass);
	return itemRepository.clear();
}

function getItems() {
	const item1 = new ItemDAO();
	item1.name = 'Bamba';
	item1.price = 8.9;
	item1.preparationTime = 5;

	const item2 = new ItemDAO();
	item2.name = 'Banana';
	item2.price = 5.2;
	item2.preparationTime = 25;

	return [item1, item2];
}

function getWaiters() {
	const waiter1 = new WaiterDAO();
	waiter1.name = 'Omer';
	waiter1.orders = [];

	const waiter2 = new WaiterDAO();
	waiter2.name = 'Tommer';
	waiter2.orders = [];

	return [waiter1, waiter2];
}

function getGuests() {
	const guest1 = new GuestDAO();
	guest1.name = 'Aviv';
	guest1.phoneNumber = '054-7828466';
	guest1.orders = [];

	const guest2 = new GuestDAO();
	guest2.name = 'Ravid';
	guest2.phoneNumber = '052-7599544';
	guest2.orders = [];

	return [guest1, guest2];
}

function getOrders(guests: GuestDAO[], waiters: WaiterDAO[]) {
	if (process.env['NODE_ENV'] === 'test') {
		return [];
	}
	const order1 = new OrderDAO();
	order1.guest = guests[0];
	order1.creationTime = Date.now();
	order1.status = 'assigned';
	order1.waiters = waiters;

	return [order1];
}

async function getUsersCredentials() {
	const guests = await AppDataSource.manager.find(GuestDAO);
	const waiters = await AppDataSource.manager.find(WaiterDAO);

	const guestCredentials = guests.map(guest => {
		const credentialsGuest = new UserCredentials();
		credentialsGuest.id = guest.id;
		credentialsGuest.password = '1234';
		credentialsGuest.permissionLevel = 1;
		return credentialsGuest;
	});

	const waiterCredentials = waiters.map(waiter => {
		const credentialsWaiter = new UserCredentials();
		credentialsWaiter.id = waiter.id;
		credentialsWaiter.password = '5678';
		credentialsWaiter.permissionLevel = 2;
		return credentialsWaiter;
	});

	const adminCredentials = new UserCredentials();
	adminCredentials.id = config.admin_id;
	adminCredentials.password = '9999';
	adminCredentials.permissionLevel = 3;

	return [...guestCredentials, ...waiterCredentials, adminCredentials];
}

function getOrdersToItems(orders: OrderDAO[], items: ItemDAO[]) {
	const orderToItem1 = new OrderToItemDAO();
	orderToItem1.quantity = 2;
	orderToItem1.item = items[0];
	orderToItem1.order = orders[0];

	const orderToItem2 = new OrderToItemDAO();
	orderToItem2.quantity = 3;
	orderToItem2.item = items[1];
	orderToItem2.order = orders[0];

	return [orderToItem1, orderToItem2];
}

const entitiesDefaults: () => [
	EntityTarget<unknown>,
	() => Promise<BaseEntity[]>,
	string
][] = () => {
	const items = getItems();
	const waiters = getWaiters();
	const guests = getGuests();
	const orders = getOrders(guests, waiters);

	// ! The order here matters, dont change it (SQL FOREIGN-KEY CONSTRAINT)
	return [
		[ItemDAO, async () => items, 'ItemDAO'],
		[WaiterDAO, async () => waiters, 'WaiterDAO'],
		[GuestDAO, async () => guests, 'GuestDAO'],
		[OrderDAO, async () => orders, 'OrderDAO'],
		[
			OrderToItemDAO,
			async () => getOrdersToItems(orders, items),
			'OrderToItemDAO',
		],
		[UserCredentials, getUsersCredentials, 'UserCredentials'],
	];
};

export async function clearALl() {
	for (const [entityTarget, _, entityName] of (
		await entitiesDefaults()
	).reverse()) {
		try {
			await clearTable(entityTarget);
		} catch (e) {
			throw new Error(`Failed clearing ${entityName}'s table: ${e}`);
		}
	}
}

export async function load_data() {
	for (const [_, entitiesGetter, entityName] of await entitiesDefaults()) {
		const entities = await entitiesGetter();
		try {
			await saveAll(entities);
		} catch (e) {
			throw new Error(`Failed loading ${entityName}'s table: ${e}`);
		}
	}
}

export default async function reset_all() {
	await clearALl();
	await load_data();
}
