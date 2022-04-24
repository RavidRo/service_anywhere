import 'reflect-metadata';

import {DataSource} from 'typeorm';
import {UserCredentials} from './entities/Authentication/UserCredentials';
import {GuestDAO} from './entities/Domain/GuestDAO';
import {ItemDAO} from './entities/Domain/ItemDAO';
import {OrderDAO} from './entities/Domain/OrderDAO';
import {OrderToItemDAO} from './entities/Domain/OrderToItemDAO';
import {ReviewDAO} from './entities/Domain/ReviewDAO';
import {WaiterDAO} from './entities/Domain/WaiterDAO';

const entities = [
	GuestDAO,
	ItemDAO,
	OrderDAO,
	ReviewDAO,
	WaiterDAO,
	OrderToItemDAO,
	UserCredentials,
];

function makeDevelopmentSource() {
	return new DataSource({
		type: 'sqlite',
		database: 'test.db',
		synchronize: true,
		logging: false,
		entities: entities,
		migrations: [],
		subscribers: [],
	});
}

function makeProductionSource() {
	return new DataSource({
		type: 'postgres',
		host: process.env['DB_HOST']!,
		port: Number.parseInt(process.env['DB_PORT']!),
		username: process.env['DB_USERNAME']!,
		password: process.env['DB_PASSWORD']!,
		database: process.env['DB_DATABASE']!,
		entities: entities,
		synchronize: true,
		ssl: {
			rejectUnauthorized: false,
		},
	});
}

export const AppDataSource =
	process.env['NODE_ENV'] === 'development'
		? makeDevelopmentSource()
		: makeProductionSource();
