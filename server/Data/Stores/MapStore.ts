import {AppDataSource} from '../data-source';
import {MapDAO} from '../entities/Domain/MapDAO';

export async function getMaps(): Promise<MapDAO[]> {
	const itemRepository = AppDataSource.getRepository(MapDAO);
	return await itemRepository.find();
}
