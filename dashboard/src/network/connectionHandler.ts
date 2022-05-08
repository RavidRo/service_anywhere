import {io, Socket} from 'socket.io-client';
import Singleton from '../singleton';
import Notification from './notifications';
import ordersViewModel from '../viewModel/ordersViewModel';
import waitersViewModel from '../viewModel/waitersViewModel';
import ConnectModel from '../model/ConnectModel';
import {DefaultEventsMap} from 'socket.io/dist/typed-events';
import {Console} from 'console';

const config = require('./config.json');
export default class ConnectionHandler extends Singleton {
	private socket: Socket;
	private notifications: Notification;
	private connectionModel: ConnectModel;

	constructor(
		orderViewModel: ordersViewModel,
		waiterViewModel: waitersViewModel
	) {
		super();
		this.notifications = new Notification(orderViewModel, waiterViewModel);
		this.socket = io(config['host'], {autoConnect: false});
		this.connectionModel = ConnectModel.getInstance();
	}

	public connect(
		token: string,
		onSuccess?: () => void,
		onError?: () => void
	): void {
		this.socket.auth = {token};
		this.socket.connect();

		let returnedResult = false;

		this.socket.on('connect', () => {
			this.connectionModel.isReconnecting = false;
			// Connected successfully to the server
			if (!returnedResult) {
				onSuccess?.();
			}
			returnedResult = true;
			console.info(
				'A socket connection has been created successfully with the server'
			);
		});
		this.socket.on('connect_error', error => {
			if (!returnedResult) {
				onError?.();
				returnedResult = true;
			}
			console.error('Could not connect to server', error.message);
		});
		this.socket.on('disconnect', reason => {
			this.connectionModel.isReconnecting = true;
			if (reason === 'io server disconnect') {
				// the disconnection was initiated by the server, you need to reconnect manually
				console.warn(
					'The socket connection to the server has been disconnected by the server, trying to reconnect...'
				);
				this.socket.connect();
			} else {
				// else the socket will automatically try to reconnect
				// Too see the reasons for a disconnect https://socket.io/docs/v4/client-api/#event-disconnect
				console.warn(
					'The socket connection to the server has been disconnected, trying to reconnect...',
					reason
				);
			}
		});

		this.socket = this.socket;
		this.registerEvents(this.socket);
	}

	private registerEvents(socket: Socket<DefaultEventsMap, DefaultEventsMap>) {
		console.info('Registering Events');
		for (const event in this.notifications.eventCallbacks) {
			socket.on(event, params => {
				console.info(`Notification ${event}:`, params);
				this.notifications.eventCallbacks[event](params);
			});
		}
	}
}
