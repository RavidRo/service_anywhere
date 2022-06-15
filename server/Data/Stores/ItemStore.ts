import {AppDataSource} from '../data-source';
import {ItemDAO} from '../entities/Domain/ItemDAO';

export async function getItems(): Promise<ItemDAO[]> {
	const itemRepository = AppDataSource.getRepository(ItemDAO);
	return await itemRepository.find();
}
