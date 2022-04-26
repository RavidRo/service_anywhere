import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ConnectViewController from './viewController/ConnectViewController';

console.log('Starting Log');

ReactDOM.render(
	<React.StrictMode>
		<ConnectViewController />
	</React.StrictMode>,
	document.getElementById('root')
);
