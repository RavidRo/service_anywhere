import {AppDataSource} from './data-source';
import {Guest} from './entities/Domain/Guest';

export async function getGuests(): Promise<Guest[]> {
	const guestRepository = AppDataSource.getRepository(Guest);
	return await guestRepository.find();
}
