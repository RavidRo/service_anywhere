import {AppDataSource} from './data-source';
import {UserCredentials} from './entities/Authentication/UserCredentials';

export async function getDetails(
	username: string,
): Promise<UserCredentials | null> {
	return await AppDataSource.manager.findOneBy(UserCredentials, {
		username: username,
	});
}
