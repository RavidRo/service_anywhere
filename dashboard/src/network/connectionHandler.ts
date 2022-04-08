import {io, Socket} from 'socket.io-client';
import Singleton from '../singleton';
import Notification from './notifications';
import ordersViewModel from '../viewModel/ordersViewModel';
import waitersViewModel from '../viewModel/waitersViewModel';

const config = require('./config.json');
const host = config.host;
const port = config.port;

const _host_port = `${host}:${port}`;
const base_route = `${host}`;

export default class ConnectionHandler extends Singleton {
	private socket?: Socket;
	private notifications: Notification;

	constructor(
		orderViewModel: ordersViewModel,
		waiterViewModel: waitersViewModel
	) {
		super();
		this.notifications = new Notification(orderViewModel, waiterViewModel);
	}

	connect(onSuccess?: () => void): void {
		const socket = io(base_route);

		socket.on('connect', () => {
			// Connected successfully to the server
			onSuccess?.();
			console.info(
				'A socket connection has been created successfully with the server'
			);
		});
		socket.on('disconnect', reason => {
			if (reason === 'io server disconnect') {
				// the disconnection was initiated by the server, you need to reconnect manually
				console.warn(
					'The socket connection to the server has been disconnected by the server, trying to reconnect...'
				);
				socket.connect();
			} else {
				// else the socket will automatically try to reconnect
				// Too see the reasons for a disconnect https://socket.io/docs/v4/client-api/#event-disconnect
				console.warn(
					'The socket connection to the server has been disconnected, trying to reconnect...',
					reason
				);
			}
		});

		this.socket = socket;

		this.registerEvents(socket);
	}

	registerEvents(socket: Socket) {
		for (const event in this.notifications.eventCallbacks) {
			socket.on(event, params => {
				console.info(`Notification ${event}:`, params);
				this.notifications.eventCallbacks[
					event as keyof typeof this.notifications.eventCallbacks
				](params);
			});
		}
	}
}
