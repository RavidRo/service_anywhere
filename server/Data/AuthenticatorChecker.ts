import {AppDataSource} from './data-source';
import {UserCredentials} from './entities/Authentication/UserCredentials';

export async function getDetails(
	password: string
): Promise<UserCredentials | null> {
	return await AppDataSource.manager.findOneBy(UserCredentials, {
		password,
	});
}
