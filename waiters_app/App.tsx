import React, {useEffect, useState} from 'react';
import {Alert, Text} from 'react-native';

import Orders from './src/components/Orders';
import Home from './src/screens/Home';

import {IDContext} from './src/contexts';
import {useAPI} from './src/hooks/useApi';

import requests from './src/networking/requests';

type AppProps = {};

export default function App(_: AppProps) {
	const [id, setID] = useState<string>();
	const {request} = useAPI(requests.login);
	useEffect(() => {
		request()
			.then(id => setID(id))
			.catch(() => Alert.alert("Can't connect to server :("));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return id ? (
		<IDContext.Provider value={id}>
			<Orders>
				<Home />
			</Orders>
		</IDContext.Provider>
	) : (
		<Text>Connecting to server...</Text>
	);
}
