import * as React from 'react';
import {observer} from 'mobx-react';
import AlertViewModel from '../viewModel/alertViewModel';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Alert from './alert';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

type alertProps = {
	alerts: string[];
	state: boolean;
	anchor: 'top' | 'left' | 'bottom' | 'right';
	toggleDrawer: (
		open: boolean
	) => (event: React.KeyboardEvent | React.MouseEvent) => void;
};

const AlertView = (props: alertProps) => {
	const {alerts, state, anchor, toggleDrawer} = props;

	const list = (_: Anchor) => (
		<Box sx={{width: 300}} role='presentation'>
			<List>
				{alerts.map(text => (
					<ListItem key={text}>
						<Alert severity='error' content={text} />
					</ListItem>
				))}
			</List>
		</Box>
	);
	return (
		<div>
			<React.Fragment key={anchor}>
				<Button
					onClick={toggleDrawer(true)}
					color='error'
					variant='contained'>
					alerts
				</Button>
				<Drawer
					anchor={anchor}
					open={state}
					onClose={toggleDrawer(false)}>
					{[list(anchor)]}
				</Drawer>
			</React.Fragment>
		</div>
	);
};

export default observer(AlertView);
