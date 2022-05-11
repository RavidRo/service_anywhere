import {AppDataSource} from '../data-source';
import {GuestDAO} from '../entities/Domain/GuestDAO';

export async function getGuests(): Promise<GuestDAO[]> {
	const guestRepository = AppDataSource.getRepository(GuestDAO);
	return await guestRepository.find();
}

export async function getGuestsDetails(ids: string[]): Promise<GuestDAO[]> {
	const guestRepository = AppDataSource.getRepository(GuestDAO);
	return  await guestRepository
		.createQueryBuilder()
		.where('GuestDAO.id IN (:...itemsIDs)', {itemsIDs: ids})
		.getMany();
}