import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import RoomServiceIcon from '@mui/icons-material/RoomService';

const dialogTitle = 'Choose Waiter';

function WaiterDialogView(props) {
	const {
		assignedWaiter,
		waiters,
		handleOpen,
		handleClose,
		handleListItemClick,
		open,
	} = props;
	return (
		<div>
			<Typography variant='h6'>
				{assignedWaiter.length === 0 ? (
					<IconButton
						color='primary'
						aria-label='service'
						component='span'
						size='large'
						onClick={handleOpen}>
						<RoomServiceIcon />
					</IconButton>
				) : (
					`Assigned waiter: ${assignedWaiter}`
				)}
			</Typography>
			<Dialog onClose={handleClose} open={open}>
				<DialogTitle>{dialogTitle}</DialogTitle>
				<List sx={{pt: 0}}>
					{waiters.map(waiter => (
						<ListItem
							button
							onClick={() => handleListItemClick(waiter)}
							key={waiter}>
							<ListItemText primary={waiter} />
						</ListItem>
					))}
				</List>
			</Dialog>
		</div>
	);
}

export default observer(WaiterDialogView);

WaiterDialogView.propTypes = {
	assignedWaiter: PropTypes.string,
	waiters: PropTypes.array,
	handleOpen: PropTypes.func,
	handleClose: PropTypes.func,
	handleListItemClick: PropTypes.func,
	open: PropTypes.bool,
};
