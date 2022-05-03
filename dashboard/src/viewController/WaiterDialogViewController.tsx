import * as React from 'react';
import WaiterDialogView from '../view/WaiterDialogView';
import propTypes from 'prop-types';
import {observer} from 'mobx-react';

function WaiterDialogViewController(props: any) {
	const {waitersViewModel, orderId} = props;
	const [open, setOpen] = React.useState(false);
	const [assignedWaiter, setAssignedWaiter] = React.useState('');

	React.useEffect(() => {
		let mounted = true;
		waitersViewModel
			.getWaitersByOrder(orderId)
			.then((assignedWaiter: string) => {
				if (mounted) {
					setAssignedWaiter(assignedWaiter);
				}
			})
			.catch((err: string) =>
				alert('Could not find waiter by order ' + err)
			);
		return () => {
			mounted = false;
		};
	}, []);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleListItemClick = (waiter: string) => {
		if (waiter !== '') {
			waitersViewModel
				.assignWaiter(orderId, waiter)
				.then(() => setAssignedWaiter(waiter))
				.catch((_: any) => alert('Could not assign waiter to order'));
		}
	};

	return (
		<WaiterDialogView
			assignedWaiter={assignedWaiter}
			waiters={waitersViewModel.getWaiters()}
			handleOpen={handleOpen}
			handleClose={handleClose}
			handleListItemClick={handleListItemClick}
			open={open}
		/>
	);
}

export default observer(WaiterDialogViewController);
