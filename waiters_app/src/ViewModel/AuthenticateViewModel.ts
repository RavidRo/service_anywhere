import AuthenticationModel from '../Models/Authentication';
import Requests from '../networking/Requests';
import Singleton from '../Singleton';

export default class AuthenticateViewModel extends Singleton {
	private requests: Requests;
	private model: AuthenticationModel;

	constructor(requests: Requests) {
		super();
		this.requests = requests;
	}

	login(): Promise<string> {
		return this.requests.login().then(id => {
			this.model.id = id;
			return id;
		});
	}

	get id(): string | undefined {
		return this.model.id;
	}
}
