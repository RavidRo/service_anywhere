export default class Singleton {
	instances = {};

	constructor() {
		if (Singleton.instances[this.constructor.name]) {
			return Singleton.instances[this.constructor.name];
		}
		Singleton.instances[this.constructor.name] = this;
	}
}
