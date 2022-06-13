import * as React from 'react';
import {observer} from 'mobx-react';
import AlertViewModel from '../viewModel/alertViewModel';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Alert from './alert';
import ListItemButton from '@mui/material/ListItemButton';
import {ListItemText} from '@mui/material';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

type alertProps = {
	alerts: string[];
	state: boolean;
	anchor: 'top' | 'left' | 'bottom' | 'right';
	toggleDrawer: (
		open: boolean
	) => (event: React.KeyboardEvent | React.MouseEvent) => void;
	onClick: (content: string) => void;
	onShowAllClick: () => void;
};

const AlertView = (props: alertProps) => {
	const {alerts, state, anchor, toggleDrawer, onClick, onShowAllClick} =
		props;

	const list = (_: Anchor) => (
		<Box sx={{width: 300}} role='presentation'>
			<List>
				<ListItem>
					<ListItemButton
						divider
						alignItems='center'
						onClick={onShowAllClick}
						sx={{
							alignItems: 'center',
						}}>
						<ListItemText
							primary='Show All'
							primaryTypographyProps={{
								color: 'primary',
							}}
						/>
					</ListItemButton>
				</ListItem>
				{alerts.map((text, index) => (
					<ListItem key={index}>
						<Alert
							severity='error'
							onClick={onClick}
							content={text}
							key={index}
						/>
					</ListItem>
				))}
			</List>
		</Box>
	);
	return (
		<div>
			<React.Fragment>
				<Button
					onClick={toggleDrawer(true)}
					color='error'
					variant='contained'>
					{`${alerts.length} alerts`}
				</Button>
				<Drawer
					anchor={anchor}
					open={state}
					onClose={toggleDrawer(false)}>
					{list(anchor)}
				</Drawer>
			</React.Fragment>
		</div>
	);
};

export default observer(AlertView);
