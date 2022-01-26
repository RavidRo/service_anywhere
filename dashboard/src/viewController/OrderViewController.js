import * as React from 'react';
import {assignWaiter, getWaitersByOrder, getOrders} from '../network/api';
import OrderView from '../view/OrderView';
import WaiterDialogViewController from './WaiterDialogViewController';

export default function OrderViewController(props) {
	const [open, setOpen] = React.useState(false);
	const [assignedWaiter, setAssignedWaiter] = React.useState([]);
	const order = props.order;
	const waitersViewModel = props.waitersViewModel;

	React.useEffect(() => {
		let mounted = true;
		waitersViewModel.getWaitersByOrder(order.id).then(assignedWaiter => {
			if (mounted) {
				setAssignedWaiter(assignedWaiter);
			}
		});
		return () => (mounted = false);
	}, []);

	console.log(order);
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = waiter => {
		if (waiter !== '') {
			if (waitersViewModel.assignWaiter(order.id, waiter)) {
				setAssignedWaiter(waiter);
			}
		}
		setOpen(false);
	};

	return (
		<div>
			<OrderView
				assignedWaiter={assignedWaiter}
				order={order}
				handleClickOpen={handleClickOpen}
				handleClose={handleClose}
			/>
			<WaiterDialogViewController
				open={open}
				onClose={handleClose}
				order={order.name}
				waitersViewModel={waitersViewModel}
			/>
		</div>
	);
}
