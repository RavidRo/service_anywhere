import * as React from 'react';
import WaiterDialogView from '../view/WaiterDialogView';
import propTypes from 'prop-types';

export default function WaiterDialogViewController(props) {
	const {waitersViewModel, orderId} = props;
	const [open, setOpen] = React.useState(false);
	const [assignedWaiter, setAssignedWaiter] = React.useState("");

	React.useEffect(() => {
		let mounted = true;
		console.log(orderId)
		waitersViewModel.getWaitersByOrder(orderId).then(assignedWaiter => {
			if (mounted) {
				setAssignedWaiter(assignedWaiter);
			}
		});
		return () => {(mounted = false)};
	}, []);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleListItemClick = waiter => {
		if (waiter !== '') {
			if (waitersViewModel.assignWaiter(orderId, waiter)) {
				setAssignedWaiter(waiter);
			}
		}
	};

	return (
		<WaiterDialogView
			assignedWaiter={assignedWaiter}
			waiters={waitersViewModel.waiters}
			handleOpen={handleOpen}
			handleClose={handleClose}
			handleListItemClick={handleListItemClick}
			open={open}
		/>
	);
}

WaiterDialogViewController.propTypes = {
	orderId: propTypes.number,
	onClose: propTypes.func,
	open: propTypes.bool,
	waitersViewModel: propTypes.object,
};
