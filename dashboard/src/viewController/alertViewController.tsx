import * as React from 'react';
import {observer} from 'mobx-react';
import AlertViewModel from '../viewModel/alertViewModel';
import AlertView from '../view/alertView';

type alertProps = {
	alertViewModel: AlertViewModel;
};
const AlertViewController = (props: alertProps) => {
	const {alertViewModel} = props;
	const [state, setState] = React.useState(false);
	const anchor = 'right';
	const toggleDrawer =
		(open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
			if (
				event.type === 'keydown' &&
				((event as React.KeyboardEvent).key === 'Tab' ||
					(event as React.KeyboardEvent).key === 'Shift')
			) {
				return;
			}

			setState(open);
		};

	return (
		<AlertView
			alerts={alertViewModel.getAlerts()}
			state={state}
			anchor={anchor}
			toggleDrawer={toggleDrawer}
		/>
	);
};

export default observer(AlertViewController);
