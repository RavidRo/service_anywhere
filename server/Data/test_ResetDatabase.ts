import bcrypt from 'bcrypt';
import config from 'server/config.json';
import {BaseEntity, EntityTarget} from 'typeorm';
import {AppDataSource} from './data-source';
import {UserCredentials} from './entities/Authentication/UserCredentials';
import {GuestDAO} from './entities/Domain/GuestDAO';
import {ItemDAO} from './entities/Domain/ItemDAO';
import {MapDAO} from './entities/Domain/MapDAO';
import {OrderDAO} from './entities/Domain/OrderDAO';
import {OrderToItemDAO} from './entities/Domain/OrderToItemDAO';
import {ReviewDAO} from './entities/Domain/ReviewDAO';
import {WaiterDAO} from './entities/Domain/WaiterDAO';

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
	item2.name = 'Cookie';
	item2.price = 5.2;
	item2.preparationTime = 25;
	return [item1, item2];
}

function getWaiters() {
	const waiter1 = new WaiterDAO();
	waiter1.username = 'Omer';
	waiter1.orders = [];

	const waiter2 = new WaiterDAO();
	waiter2.username = 'Tommer';
	waiter2.orders = [];

	return [waiter1, waiter2];
}

function getGuests() {
	const guest1 = new GuestDAO();
	guest1.username = 'aviv';
	guest1.phoneNumber = '054-7828466';
	guest1.orders = [];

	const guest2 = new GuestDAO();
	guest2.username = 'Ravid';
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
	order1.creationTime = new Date();
	order1.status = 'assigned';
	order1.waiters = waiters;

	return [order1];
}

function getMaps() {
	const map1 = new MapDAO();
	map1.name = 'Beit Ha Student';
	map1.imageURL =
		'https://res.cloudinary.com/noa-health/image/upload/v1640287601/bengurion-map_q32yck.png';
	map1.bottomLeftLat = 31.261649;
	map1.bottomLeftLong = 34.800838;
	map1.bottomRightLat = 31.261649;
	map1.bottomRightLong = 34.802516;
	map1.topLeftLat = 31.26355;
	map1.topLeftLong = 34.800838;
	map1.topRightLat = 31.26355;
	map1.topRightLong = 34.802516;

	// const map2 = new MapDAO();
	// map2.name = 'Dan Jerusalem';
	// map2.imageURL =
	// 	'https://res.cloudinary.com/noa-health/image/upload/v1654535608/Dan_Jerusalem_cijcod.png';
	// map2.bottomRightLong = 35.238558;
	// map2.bottomRightLat = 31.795908;
	// map2.bottomLeftLong = 35.232014;
	// map2.bottomLeftLat = 31.795908;
	// map2.topRightLong = 35.238558;
	// map2.topRightLat = 31.799504;
	// map2.topLeftLong = 35.232014;
	// map2.topLeftLat = 31.799504;

	const map3 = new MapDAO();
	map3.name = 'Dan Jerusalem';
	map3.imageURL =
		'https://res.cloudinary.com/noa-health/image/upload/v1655453363/Screenshot_2022-06-17_110241_ruyf2i.png';
	map3.bottomRightLong = 35.236847;
	map3.bottomRightLat = 31.796538;
	map3.bottomLeftLong = 35.234078;
	map3.bottomLeftLat = 31.796538;
	map3.topRightLong = 35.236847;
	map3.topRightLat = 31.798879;
	map3.topLeftLong = 35.234078;
	map3.topLeftLat = 31.798879;

	return [map1, map3];
}

async function getUsersCredentials() {
	const guests = await AppDataSource.manager.find(GuestDAO);
	const waiters = await AppDataSource.manager.find(WaiterDAO);

	const hashPassword = async (password: string): Promise<string> => {
		// generate salt to hash password
		const salt = await bcrypt.genSalt(10);
		// now we set user password to hashed password
		return await bcrypt.hash(password, salt);
	};

	const guestCredentials = await Promise.all(
		guests.map(async guest => {
			const credentialsGuest = new UserCredentials();
			credentialsGuest.id = guest.id;
			credentialsGuest.username = guest.username;
			credentialsGuest.password = await hashPassword('1234');
			credentialsGuest.permissionLevel = 1;
			return credentialsGuest;
		})
	);

	const waiterCredentials = await Promise.all(
		waiters.map(async waiter => {
			const credentialsWaiter = new UserCredentials();
			credentialsWaiter.id = waiter.id;
			credentialsWaiter.username = waiter.username;
			credentialsWaiter.password = await hashPassword('5678');
			credentialsWaiter.permissionLevel = 2;
			return credentialsWaiter;
		})
	);

	const adminCredentials = new UserCredentials();
	adminCredentials.id = config.admin_id;
	adminCredentials.username = config.admin_name;
	adminCredentials.password = await hashPassword('9999');
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
	const maps = getMaps();

	// ! The order here matters, dont change it (SQL FOREIGN-KEY CONSTRAINT)
	return [
		[ItemDAO, async () => items, 'ItemDAO'],
		[ReviewDAO, async () => [], 'ReviewDAO'],
		[WaiterDAO, async () => waiters, 'WaiterDAO'],
		[GuestDAO, async () => guests, 'GuestDAO'],
		[OrderDAO, async () => orders, 'OrderDAO'],
		[
			OrderToItemDAO,
			async () => getOrdersToItems(orders, items),
			'OrderToItemDAO',
		],
		[UserCredentials, getUsersCredentials, 'UserCredentials'],
		[MapDAO, async () => maps, 'MapDAO'],
	];
};

export async function clearALl() {
	for (const [entityTarget, _, entityName] of entitiesDefaults().reverse()) {
		try {
			await clearTable(entityTarget);
		} catch (e) {
			throw new Error(`Failed clearing ${entityName}'s table: ${e}`);
		}
	}
}

export async function load_data() {
	for (const [_, entitiesGetter, entityName] of entitiesDefaults()) {
		const entities = await entitiesGetter();
		try {
			await saveAll(entities);
		} catch (e) {
			throw new Error(`Failed loading ${entityName}'s table: ${e}`);
		}
	}
}

export default async function reset_all() {
	if (process.env['NODE_ENV'] !== 'production') {
		await clearALl();
		await load_data();
	}
}
