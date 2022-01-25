import {useState} from 'react';
// import {CookieContext} from '../contexts';

export function useAPI<T extends unknown[], R = unknown>(
	// apiFunc: (cookie: string, ...args: T) => Promise<R>,
	apiFunc: (...args: T) => Promise<R>
) {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const [errorMsg, setErrorMsg] = useState<string>('');
	const [data, setData] = useState<R | null>(null);
	// const cookie = useContext(CookieContext);

	const request = (...params: T): Promise<R> => {
		setLoading(true);
		setError(false);
		setErrorMsg('');
		setData(null);

		// return apiFunc(cookie, ...params)
		return apiFunc(...params)
			.then(data => {
				setData(data);
				return data;
			})
			.catch(errorMsg => {
				setError(true);
				setErrorMsg(errorMsg);
				return Promise.reject(errorMsg);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return {request, loading, error, errorMsg, data};
}
