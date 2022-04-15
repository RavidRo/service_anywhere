import {BaseEntity, EntityTarget} from 'typeorm';
import {AppDataSource} from './data-source';
import {Guest} from './entities/Domain/Guest';
import {Item} from './entities/Domain/Item';
import {Order} from './entities/Domain/Order';
import {Waiter} from './entities/Domain/Waiter';

function saveAll<T extends BaseEntity>(entities: T[]): Promise<void> {
	const saves = entities.map(item => item.save());
	return Promise.all(saves).then(() => {}); // I am hiding complexity and return void instead of the saved entities
}

async function clearTable<T>(entityClass: EntityTarget<T>) {
	const itemRepository = AppDataSource.getRepository(entityClass);
	await itemRepository.clear();
}

function getItems() {
	const item1 = new Item();
	item1.name = 'Bamba';
	item1.price = 8.9;
	item1.preparationTime = 5;

	const item2 = new Item();
	item2.name = 'Banana';
	item2.price = 5.2;
	item2.preparationTime = 25;

	return [item1, item2];
}

function getWaiters() {
	const waiter1 = new Waiter();
	waiter1.name = 'Omer';
	waiter1.orders = [];

	const waiter2 = new Waiter();
	waiter2.name = 'Tommer';
	waiter2.orders = [];

	return [waiter1, waiter2];
}

function getGuests() {
	const guest1 = new Guest();
	guest1.name = 'Aviv';
	guest1.phoneNumber = '054-7828466';
	guest1.orders = [];

	const guest2 = new Guest();
	guest2.name = 'Ravid';
	guest2.phoneNumber = '052-7599544';
	guest2.orders = [];

	return [guest1, guest2];
}

const entitiesDefaults: [EntityTarget<unknown>, () => BaseEntity[]][] = [
	[Item, getItems],
	[Waiter, getWaiters],
	[Order, () => []],
	[Guest, getGuests],
];

export default function reset_all() {
	const resets = entitiesDefaults.map(([entityTarget, entitiesGetter]) =>
		clearTable(entityTarget).then(() => {
			const entities = entitiesGetter();
			return saveAll(entities);
		})
	);
	return Promise.all(resets).then(() => {}); //Return void instead of void[] to not confuse the next developer
}
