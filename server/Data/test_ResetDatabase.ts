import {BaseEntity, EntityTarget} from 'typeorm';
import {AppDataSource} from './data-source';
import {UserCredentials} from './entities/Authentication/UserCredentials';
import {GuestDAO} from './entities/Domain/GuestDAO';
import {ItemDAO} from './entities/Domain/ItemDAO';
import {OrderDAO} from './entities/Domain/OrderDAO';
import {OrderToItemDAO} from './entities/Domain/OrderToItemDAO';
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

const entitiesDefaults: [EntityTarget<unknown>, () => BaseEntity[], string][] =
	// ! The order here matters, dont change it (SQL FOREIGN-KEY CONSTRAINT)
	[
		[OrderToItemDAO, () => [], 'OrderToItemDAO'],
		[ItemDAO, getItems, 'ItemDAO'],
		[OrderDAO, () => [], 'OrderDAO'],
		[WaiterDAO, getWaiters, 'WaiterDAO'],
		[GuestDAO, getGuests, 'GuestDAO'],
	];

// async function cleanAll() {
// 	try {
// 		for (const entity of entitiesDefaults) {
// 			const repository = await this.databaseService.getRepository(
// 				entity.name
// 			);
// 			await repository.query(`TRUNCATE TABLE \`${entity.tableName}\`;`);
// 		}
// 	} catch (error) {
// 		throw new Error(`ERROR: Cleaning test db: ${error}`);
// 	}
// }

export async function load_data() {
	for (const [_, entitiesGetter, entityName] of entitiesDefaults) {
		const entities = entitiesGetter();
		try {
			await saveAll(entities);
		} catch (e) {
			throw new Error(`Failed loading ${entityName}'s table: ${e}`);
		}
	}
	try {
		const guests = await GuestDAO.find();
		for (const user of [...guests]) {
			const credentialsGuest = new UserCredentials();
			credentialsGuest.id = user.id;
			credentialsGuest.password = '1234';
			credentialsGuest.permissionLevel = 1;
			await credentialsGuest.save();
		}
		const waiters = await WaiterDAO.find();
		for (const user of [...waiters]) {
			const credentialsGuest = new UserCredentials();
			credentialsGuest.id = user.id;
			credentialsGuest.password = '5678';
			credentialsGuest.permissionLevel = 2;
			await credentialsGuest.save();
		}
	} catch (e) {
		throw new Error(`Failed loading UserCredentials's table: ${e}`);
	}
}

export default async function reset_all() {
	for (const [entityTarget, _, entityName] of entitiesDefaults) {
		try {
			await clearTable(entityTarget);
		} catch (e) {
			throw new Error(`Failed clearing ${entityName}'s table: ${e}`);
		}
	}

	try {
		const itemRepository = AppDataSource.getRepository(UserCredentials);
		await itemRepository.clear();
	} catch (e) {
		throw new Error(`Failed clearing UserCredentials's table: ${e}`);
	}

	await load_data();
}
