/* eslint-disable max-len */
import * as React from 'react';
import WaiterDialogView from '../view/WaiterView';
import {observer} from 'mobx-react';
import WaitersViewModel from '../viewModel/waitersViewModel';
import {OrderStatus} from '../../../api';
import {StatusToNumber} from '../Status';
import OrdersViewModel from '../viewModel/ordersViewModel';

type waiterDialogViewControllerProps = {
	waitersViewModel: WaitersViewModel;
	ordersViewModel: OrdersViewModel;
	orderId: string;
	status: OrderStatus;
	assignedWaiters: string[];
	// updateAssignedWaiters: (orderId: string, waiterIds: string[]) => void;
};
function WaiterDialogViewController(props: waiterDialogViewControllerProps) {
	const {
		waitersViewModel,
		ordersViewModel,
		orderId,
		status,
		assignedWaiters,
	} = props;
	const [open, setOpen] = React.useState(false);
	// const [assignedWaiters, setAssignedWaiters] = React.useState<string[]>([]);
	const [selectedWaiters, setSelectedWaiters] = React.useState<string[]>([]);

	// React.useEffect(() => {
	// 	let mounted = true;

	// 	waitersViewModel
	// 		.getWaitersByOrder(orderId)
	// 		.then((waiterIds: string[]) => {
	// 			if (mounted) {
	// 				setAssignedWaiters(waiterIds);
	// 			}
	// 		})
	// 		.catch((err: string) =>
	// 			alert('Could not find waiter by order ' + err)
	// 		);
	// 	return () => {
	// 		mounted = false;
	// 	};
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setSelectedWaiters([]);
		setOpen(false);
	};

	const handleCheckboxChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		event.target.checked
			? setSelectedWaiters(selectedWaiters.concat(event.target.name))
			: setSelectedWaiters(
					selectedWaiters.filter(
						waiter => waiter !== event.target.name
					)
			  );
	};

	const handleOk = () => {
		waitersViewModel
			.assignWaiter(orderId, selectedWaiters)
			.then(() => {
				console.log('Selected waiters ', selectedWaiters);
				ordersViewModel.updateAssignedWaiter(orderId, selectedWaiters);
				handleClose();
			})
			.catch(_ => alert('Could not assign waiters to order'));
	};

	const isDisabled = () => {
		return (StatusToNumber.get(status) || 0) >= 3;
	};
	return (
		<WaiterDialogView
			assignedWaiters={assignedWaiters}
			waiters={waitersViewModel.getWaiters()}
			handleOpen={handleOpen}
			handleClose={handleClose}
			handleCheckboxChange={handleCheckboxChange}
			handleOk={handleOk}
			open={open}
			isDisabled={isDisabled}
		/>
	);
}

export default observer(WaiterDialogViewController);
