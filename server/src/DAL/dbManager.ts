// import 'reflect-metadata';
// import Singleton from '../../Singeltone';
// import {createConnection} from 'typeorm';
// import {User} from '../entities/User';

// export default class DBManager extends Singleton {
// 	private db: any;

// 	public constructor() {
// 		super();
// 	}
// 	async AddNewUser(user: User) {
// 		createConnection()
// 			.then(async _ => {
// 				console.log('Inserting a new user into the database...');
// 				await user.save();

// 				console.log('Saved a new user with id: ' + user.id);
// 			})
// 			.catch(error => console.log(error));
// 	}
// 	LoadUsers() {
// 		return createConnection()
// 			.then(async connection => {
// 				console.log('Loading users from the database...');
// 				const users = await connection.manager.find(User);
// 				console.log('Loaded users: ', users);
// 				return users;
// 			})
// 			.catch(err => {
// 				console.log(err);
// 				return [];
// 			});
// 	}
// }
