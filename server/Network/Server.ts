import * as http from 'http';

import {Application, RequestHandler} from 'express';
import * as socketIO from 'socket.io';
import {DefaultEventsMap} from 'socket.io/dist/typed-events';

import {AppDataSource} from 'server/Data/data-source';
import reset_all from 'server/Data/test_ResetDatabase';
import Controller from './Controller';
import {SocketEvent} from './SocketServer';

// I used the design pattern from here:
// https://dev.to/thedenisnikulin/express-js-on-steroids-an-oop-way-for-organizing-node-js-project-starring-typescript-388p

export default class Server {
	private readonly app: Application;
	private readonly httpServer: http.Server;
	private readonly port: number;
	private readonly io: socketIO.Server<
		DefaultEventsMap,
		DefaultEventsMap,
		DefaultEventsMap,
		any
	>;

	constructor(app: Application, port: number) {
		this.app = app;
		this.port = port;
		this.httpServer = new http.Server(app);
		this.io = new socketIO.Server(this.httpServer, {
			cors: {
				origin: '*',
			},
		});
	}

	public run(): http.Server {
		return this.httpServer.listen(this.port, () => {
			console.log(`Up and running on port ${this.port}`);
		});
	}

	public loadGlobalMiddleware(middleware: Array<RequestHandler>): void {
		// global stuff like cors, body-parser, etc
		middleware.forEach(mw => {
			this.app.use(mw);
		});
	}

	public loadControllers(controllers: Array<Controller>): void {
		controllers.forEach(controller => {
			// use setRoutes method that maps routes and returns Router object
			this.app.use(controller.path, controller.setRoutes());
		});
	}

	public loadSocketEvents(
		onConnection: (socket: socketIO.Socket) => void,
		events: SocketEvent[]
	) {
		this.io.on('connection', function (socket: socketIO.Socket) {
			onConnection(socket);
			events.forEach(event => {
				socket.on(event.eventName, message =>
					event.listener(socket, message)
				);
			});
		});
	}

	public async initDatabase(): Promise<void> {
		return AppDataSource.initialize().then(() => reset_all());
	}
}
