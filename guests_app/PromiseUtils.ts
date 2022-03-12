export function makePromise<T>(value: T): Promise<T> {
	return new Promise<T>(resolve => resolve(value));
}

export function flushPromises() {
	return new Promise(resolve => setImmediate(resolve));
}
