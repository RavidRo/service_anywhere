import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {observer} from 'mobx-react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import {FormControlLabel, FormGroup, Checkbox, Button} from '@mui/material';
import {WaiterIDO} from '../../../api';

const dialogTitle = 'Choose Waiter';

type waiterProps = {
	assignedWaiters: string[];
	waiters: WaiterIDO[];
	handleOpen: () => void;
	handleClose: () => void;
	handleOk: () => void;
	handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	open: boolean;
	isDisabled: () => boolean;
};
function WaiterDialogView(props: waiterProps) {
	console.log('creating waiters view');
	const {
		assignedWaiters,
		waiters,
		handleOpen,
		handleClose,
		handleOk,
		handleCheckboxChange,
		open,
		isDisabled,
	} = props;

	return (
		<div>
			<Typography fontSize={16}>
				{assignedWaiters.length === 0 ? (
					<IconButton
						color='primary'
						aria-label='service'
						component='span'
						size='large'
						onClick={handleOpen}
						disabled={isDisabled()}>
						<RoomServiceIcon />
					</IconButton>
				) : (
					`Assigned waiter: ${assignedWaiters.map(
						id =>
							(
								waiters.find(waiter => waiter.id === id) || {
									name: 'Cannot find correct waiter',
								}
							).name
					)}`
				)}
			</Typography>
			<Dialog onClose={handleClose} open={open}>
				<DialogTitle>{dialogTitle}</DialogTitle>
				<DialogContent dividers sx={{pt: 0}}>
					<FormGroup>
						{waiters.map((waiter: WaiterIDO, index) => {
							return (
								<FormControlLabel
									key={index}
									control={
										<Checkbox
											key={waiter.id}
											onChange={handleCheckboxChange}
											name={waiter.id}
										/>
									}
									label={waiter.name}
								/>
							);
						})}
					</FormGroup>
				</DialogContent>
				<DialogActions>
					<Button autoFocus onClick={handleClose}>
						Cancel
					</Button>
					<Button onClick={handleOk}>Ok</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default observer(WaiterDialogView);
