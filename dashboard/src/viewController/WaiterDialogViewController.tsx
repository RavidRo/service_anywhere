import * as React from 'react';
import WaiterDialogView from '../view/WaiterDialogView';
import {observer} from 'mobx-react';

// type waiterDialogViewControllerProps = {
// 	waitersViewModel: WaitersViewModel;
// 	orderId: string;
// };
function WaiterDialogViewController(props) {
	const {waitersViewModel, orderId} = props;
	const [open, setOpen] = React.useState(false);
	const [assignedWaiter, setAssignedWaiter] = React.useState('');

	React.useEffect(() => {
		let mounted = true;
		waitersViewModel
			.getWaitersByOrder(orderId)
			.then((waiter: string) => {
				if (mounted) {
					setAssignedWaiter(waiter);
				}
			})
			.catch((err: string) =>
				alert('Could not find waiter by order ' + err)
			);
		return () => {
			mounted = false;
		};
	});

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
				.catch(_ => alert('Could not assign waiter to order'));
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
