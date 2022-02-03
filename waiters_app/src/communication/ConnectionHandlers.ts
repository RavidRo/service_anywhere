import {io, Socket} from 'socket.io-client';
import Singleton from '../Singleton';

export default class ConnectionHandler extends Singleton {
	private socket: Socket;

	constructor() {
		super();
		this.setUpConnection();
	}

	private setUpConnection() {
		this.socket = io('server-url:3000');
	}

	public send(event: string, params: any[]) {
		this.socket.emit(event, ...params);
	}
}
