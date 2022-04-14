import {Waiter} from '../Logic/Waiter';
import {AppDataSource} from './data-source';
import {Waiter as WaiterDAO} from './entities/Domain/Waiter';

// Testing
let testWaiters: Waiter[] = [];
test_resetWaiters();
export function test_resetWaiters() {
	const waiter1 = new Waiter('0', '', true);
	const waiter2 = new Waiter('1', '', true);

	testWaiters = [waiter1, waiter2];
}

export async function getWaiters(): Promise<Waiter[]> {
	if (process.env['NODE_ENV'] === 'test') {
		return testWaiters;
	}
	const waiterRepository = AppDataSource.getRepository(WaiterDAO);
	const waiters = await waiterRepository.find();
	return waiters.map(
		waiter => new Waiter(waiter.id, waiter.name, waiter.orders.length === 0)
	);
}
