import {AppDataSource} from './data-source';
import {Waiter} from './entities/Domain/Worker';

export async function getWaiters(): Promise<Waiter[]> {
	const waiterRepository = AppDataSource.getRepository(Waiter);
	return await waiterRepository.find();
}
