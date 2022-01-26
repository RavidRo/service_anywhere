import React, {useEffect, useState} from 'react';
import {Alert, Text} from 'react-native';

import Orders from './src/components/Orders';
import Home from './src/screens/Home';

import {IDContext} from './src/contexts';
import {useAPI} from './src/hooks/useApi';

import LoginController from './src/components/Controllers/LoginController';

type AppProps = {};

export default function App(_: AppProps) {
	return <LoginController />;
}
