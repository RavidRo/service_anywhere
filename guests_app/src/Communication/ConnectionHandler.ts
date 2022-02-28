import Singleton from '../Singeltone';
import Notifications from './Notification';

const serverURL = 'server-url:3000';
export default class ConnectionHandler extends Singleton {
	//	private socket?: Socket;
	private notifications: Notifications = new Notifications();

	constructor() {
		super();
	}

//	public connect(onSuccess?: () => void): void {}

//	public send(event: string, ...params: any[]): void {}
}
