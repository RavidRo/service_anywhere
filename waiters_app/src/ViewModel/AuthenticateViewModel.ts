import ConnectionHandler from '../communication/ConnectionHandler';
import ConnectionModel from '../Models/ConnectionModel';
import Requests from '../networking/Requests';

export default class ConnectionViewModel {
	private requests: Requests;
	private model: ConnectionModel;
	private connection: ConnectionHandler;

	constructor(requests: Requests) {
		this.model = ConnectionModel.getInstance();
		this.requests = requests;
		this.connection = new ConnectionHandler();
	}

	login(): Promise<string> {
		return this.requests.login().then(token => {
			this.model.token = token;
			return token;
		});
	}

	get token(): string | undefined {
		return this.model.token;
	}

	get isReconnecting(): boolean {
		return this.model.reconnectingToServer;
	}

	public connect(onConnected?: () => void) {
		if (this.token) {
			this.connection.connect(this.token, onConnected);
		}
		console.error(
			'Tried to connect but an authorization token could not be found'
		);
	}
}
