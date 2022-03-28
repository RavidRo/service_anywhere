import {AppDataSource} from './data-source';
import {UserCredentials} from './entities/Authentication/UserCredentials';

async function getID(password: string): Promise<string | undefined> {
	const credentials = await AppDataSource.manager.findOneBy(UserCredentials, {
		password,
	});
	return credentials?.id;
}

export default {
	getID,
};
