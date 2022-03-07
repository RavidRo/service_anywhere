export function makePromise<T>(value: T): Promise<T> {
	return new Promise<T>(resolve => resolve(value));
}

export function makeFail<T>(): Promise<T> {
	return new Promise((_, reject) => reject());
}
export function flushPromises() {
	return new Promise(resolve => setImmediate(resolve));
}
