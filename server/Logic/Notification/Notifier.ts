type emitOperation = (event: string, params: object) => boolean;

export class Notifier {
	private static instance: Notifier;
	public static getInstance() {
		if (!this.instance) {
			this.instance = new Notifier();
		}
		return this.instance;
	}

	private subscribers: Record<string, emitOperation[]> = {};

	private constructor() {}

	/**
	 * @param id The subscriberID
	 * @param event The functions that is called when the subscriber is notified
	 * @param params The parameters are used when calling action
	 *
	 * If id is not a subscriber no notification is sent
	 */
	public notify(id: string, event: string, params: object): void {
		const emits = this.subscribers[id];
		if (emits) {
			// Removes subscribers if they did not receive a notifications
			const newEmits = emits.filter(emit => {
				const received = emit(event, params);
				return received;
			});
			this.subscribers[id] = newEmits;
		}
	}

	public addSubscriber(id: string, emit: emitOperation): void {
		if (this.subscribers[id] === undefined) this.subscribers[id] = [];
		this.subscribers[id].push(emit);
	}
}
