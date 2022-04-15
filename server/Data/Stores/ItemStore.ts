import {AppDataSource} from '../data-source';
import {Item} from '../entities/Domain/Item';

// Testing
// let testItems: Item[] = [];
// test_resetItems();
// export function test_resetItems() {
// 	const item1 = new Item();
// 	item1.id = '1';
// 	const item2 = new Item();
// 	item2.id = '2';
// 	testItems = [item1, item2];
// }

export async function getItems(): Promise<Item[]> {
	// if (process.env['NODE_ENV'] === 'test') {
	// 	return testItems;
	// }
	const itemRepository = AppDataSource.getRepository(Item);
	return await itemRepository.find();
}
