//* This is an example file

import {AppDataSource} from './data-source';
import {GuestDAO} from './entities/Domain/GuestDAO';

AppDataSource.initialize()
	.then(async () => {
		console.log('Inserting a new user into the database...');
		const user = new GuestDAO();
		user.username = 'Bob';
		user.phoneNumber = '0527599544';
		const guestRepository = AppDataSource.getRepository(GuestDAO);
		guestRepository.find();
		await guestRepository.save(user);
		console.log('Saved a new user with id: ' + user.id);

		console.log('Loading users from the database...');
		const users = await AppDataSource.manager.find(GuestDAO);
		console.log('Loaded users: ', users);

		console.log(
			'Here you can setup and run express / fastify / any other framework.'
		);
	})
	.catch(error => console.log(error));
