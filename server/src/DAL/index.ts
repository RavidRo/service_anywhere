// import 'reflect-metadata';
// import DBManager from './DAL/dbManager';
// import {User} from './entities/User';

// let user: User = new User();
// user.firstName = 'aviv';
// user.lastName = 'almog';
// user.age = 21;

// let user2: User = new User();
// user.firstName = 'aviv2';
// user.lastName = 'almog';
// user.age = 21;

// let dbManager: DBManager = new DBManager();
// dbManager.AddNewUser(user);
// dbManager.AddNewUser(user2);

// console.log("loading users from db")
// dbManager.LoadUsers().then(users => {
//     console.log(users.length);
//     console.log(users);
// })

import {AppDataSource} from './data-source';
import {Guest} from './entities/Guest';

AppDataSource.initialize()
	.then(async () => {
		console.log('Inserting a new user into the database...');
		const user = new Guest();
		user.name = 'Bob';
		user.phoneNumber = '0527599544';
		await AppDataSource.manager.save(user);
		console.log('Saved a new user with id: ' + user.id);

		console.log('Loading users from the database...');
		const users = await AppDataSource.manager.find(Guest);
		console.log('Loaded users: ', users);

		console.log(
			'Here you can setup and run express / fastify / any other framework.'
		);
	})
	.catch(error => console.log(error));
