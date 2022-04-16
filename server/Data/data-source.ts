import 'reflect-metadata';

import {DataSource} from 'typeorm';
import {GuestDAO} from './entities/Domain/GuestDAO';
import {ItemDAO} from './entities/Domain/ItemDAO';
import {OrderDAO} from './entities/Domain/OrderDAO';
import {OrderToItemDAO} from './entities/Domain/OrderToItemDAO';
import {ReviewDAO} from './entities/Domain/ReviewDAO';
import {WaiterDAO} from './entities/Domain/WaiterDAO';

export const AppDataSource = new DataSource({
	type: 'sqlite',
	// host: 'localhost',
	// port: 3306,
	// username: 'test',
	// password: 'test',
	database: 'test.db',
	synchronize: true,
	logging: false,
	entities: [
		GuestDAO,
		ItemDAO,
		OrderDAO,
		ReviewDAO,
		WaiterDAO,
		OrderToItemDAO,
	],
	migrations: [],
	subscribers: [],
	// cli: {},
});
