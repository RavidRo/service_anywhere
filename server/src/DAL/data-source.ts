import 'reflect-metadata';

import {DataSource} from 'typeorm';
import {Guest} from './entities/Domain/Guest';
import {Item} from './entities/Domain/Item';
import {Order} from './entities/Domain/Order';
import {OrderToItem} from './entities/Domain/OrderToItem';
import {Review} from './entities/Domain/Review';
import {Waiter} from './entities/Domain/Worker';

export const AppDataSource = new DataSource({
	type: 'sqlite',
	// host: 'localhost',
	// port: 3306,
	// username: 'test',
	// password: 'test',
	database: 'test.db',
	synchronize: true,
	logging: false,
	entities: [Guest, Item, Order, Review, Waiter, OrderToItem],
	migrations: [],
	subscribers: [],
	// cli: {},
});
