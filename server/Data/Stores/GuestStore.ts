import {AppDataSource} from '../data-source';
import {GuestDAO} from '../entities/Domain/GuestDAO';

export async function getGuests(): Promise<GuestDAO[]> {
	const guestRepository = AppDataSource.getRepository(GuestDAO);
	return await guestRepository.find();
}
