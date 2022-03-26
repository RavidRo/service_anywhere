import {AppDataSource} from './data-source';
import {Item} from './entities/Domain/Item';

export async function getItems(): Promise<Item[]> {
	const itemRepository = AppDataSource.getRepository(Item);
	return await itemRepository.find();
}
