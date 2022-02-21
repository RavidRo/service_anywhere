import {io} from 'socket.io-client';
import Singleton from '../Singleton';
import Notification from './notifications';
import config from './config.json';

const host = config.host;
const port = config.port;

const _host_port = `${host}:${port}`;
const base_route = `${host}`;

export default class ConnectionHandler extends Singleton {
	notifications = new Notification();

	constructor() {
		super();
	}

	connect(onSuccess) {
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

	registerEvents(socket) {
		for (const event in this.notifications.eventToCallback) {
			socket.on(event, params => {
				console.info(`Notification ${event}:`, params);
				this.notifications.eventToCallback[event](params);
			});
		}
	}
}
