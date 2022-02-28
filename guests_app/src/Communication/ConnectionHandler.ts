import Singleton from '../Singeltone';
import Notifications from './Notification';

const _serverURL = 'server-url:3000';
export default class ConnectionHandler extends Singleton {
	//	private socket?: Socket;
	private notifications: Notifications = new Notifications();

	constructor() {
		super();
	}

	//	public connect(onSuccess?: () => void): void {}

	public send(_event: string, ..._params: any[]): void {}
}
