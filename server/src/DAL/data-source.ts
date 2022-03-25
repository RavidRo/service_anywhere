import 'reflect-metadata';

import {DataSource} from 'typeorm';
import {Guest} from './entities/Guest';
import {Item} from './entities/Item';
import {Order} from './entities/Order';
import {Review} from './entities/Review';
import {Worker} from './entities/Worker';

export const AppDataSource = new DataSource({
	type: 'sqlite',
	// host: 'localhost',
	// port: 3306,
	// username: 'test',
	// password: 'test',
	database: 'test.db',
	synchronize: true,
	logging: false,
	entities: [Guest, Item, Order, Review, Worker],
	migrations: [],
	subscribers: [],
	// cli: {},
});
