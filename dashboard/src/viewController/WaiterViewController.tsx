/* eslint-disable max-len */
import * as React from 'react';
import WaiterDialogView from '../view/WaiterView';
import {observer} from 'mobx-react';
import WaitersViewModel from '../viewModel/waitersViewModel';
import {OrderStatus} from '../../../api';

type waiterDialogViewControllerProps = {
	waitersViewModel: WaitersViewModel;
	orderId: string;
	status: OrderStatus;
};
function WaiterDialogViewController(props: waiterDialogViewControllerProps) {
	const {waitersViewModel, orderId, status} = props;
	const [open, setOpen] = React.useState(false);
	const [assignedWaiters, setAssignedWaiters] = React.useState<string[]>([]);
	const [selectedWaiters, setSelectedWaiters] = React.useState<string[]>([]);

	React.useEffect(() => {
		let mounted = true;

		waitersViewModel
			.getWaitersByOrder(orderId)
			.then((waiterIds: string[]) => {
				if (mounted) {
					setAssignedWaiters(waiterIds);
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

	const handleCheckboxChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		event.target.checked
			? setSelectedWaiters(assignedWaiters.concat(event.target.name))
			: setSelectedWaiters(
					assignedWaiters.filter(
						waiter => waiter !== event.target.name
					)
			  );
	};

	const handleOk = () => {
		waitersViewModel
			.assignWaiter(orderId, selectedWaiters)
			.then(() => {
				setAssignedWaiters(selectedWaiters);
				setOpen(false);
			})
			.catch(_ => alert('Could not assign waiters to order'));
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
			status={status}
		/>
	);
}

export default observer(WaiterDialogViewController);
