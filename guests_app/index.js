/**
 * @format
 */

// Checking if transpiler is configured correctly for mobx with typescript
if (
	!new (class {
		x;
	})().hasOwnProperty('x')
)
	throw new Error('Transpiler is not configured correctly');

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
