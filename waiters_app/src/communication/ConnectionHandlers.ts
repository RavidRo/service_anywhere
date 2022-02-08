import {DefaultEventsMap} from '@socket.io/component-emitter';
import {io, Socket} from 'socket.io-client';
import Singleton from '../Singleton';
import Notifications from './Notifications';
import configuration from '../../configuration.json';

export default class ConnectionHandler extends Singleton {
	private socket?: Socket;
	private notifications: Notifications = new Notifications();

	constructor() {
		super();
	}

	public connect(onSuccess?: () => void): void {
		const socket = io(configuration['server-url']);
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

	private registerEvents(socket: Socket<DefaultEventsMap, DefaultEventsMap>) {
		for (const event in this.notifications.eventToCallback) {
			socket.on(event, params => {
				console.info(`Notification ${event}:`, params);
				this.notifications.eventToCallback[event](params);
			});
		}
	}

	public send(event: string, ...params: any[]): void {
		if (this.socket === undefined) {
			const errorMessage =
				'A message is sent to the server before a connection is being initialized';

			console.error(errorMessage);
			throw new Error(errorMessage);
		}
		if (this.socket.connected) {
			this.socket.emit(event, params);
			console.info(`Message ${event}:`, params);
		} else {
			// The connection has disconnected from some reason that should have been specified at the "disconnect" event above
			console.warn(
				`Trying to send a message for the event ${event} but the there is no valid connection`
			);
		}
	}
}
