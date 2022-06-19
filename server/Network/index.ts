import express, {RequestHandler} from 'express';
import cors from 'cors';

import Controller from './Controller';
import {WaiterController} from './Controllers/WaiterController';
import Server from './Server';
import * as SocketServer from './SocketServer';

const PORT = 3000;

const app = express();

const server = new Server(app, PORT);

const controllers: Array<Controller> = [new WaiterController()];

const globalMiddleware: Array<RequestHandler> = [
	express.json(),
	express.static('build'),
	cors({origin: '*', credentials: true}),
];

Promise.resolve()
	.then(() => {
		server.loadGlobalMiddleware(globalMiddleware);
		server.loadControllers(controllers);
		server.loadSocketEvents(SocketServer.onConnection, SocketServer.events);
		server.initDatabase();
		server.run();
	})
	.catch(reason => {
		console.error(reason);
	});
