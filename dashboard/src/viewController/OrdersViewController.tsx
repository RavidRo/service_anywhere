import * as React from 'react';
import AppBarView from '../view/AppBarView';
import propTypes from 'prop-types';
import WaiterDialogViewController from './WaiterDialogViewController';
import OrdersView from '../view/OrdersView';
import StatusViewController from './StatusViewController';
import ExpandCellGrid from '../view/ExpandCellGrid';

function OrdersViewController(props) {
	const {ordersViewModel, waitersViewModel} = props;
	const handleRowEditStart = (params, event) => {
		event.defaultMuiPrevented = true;
	};

	const handleRowEditStop = (params, event) => {
		event.defaultMuiPrevented = true;
	};

	const handleCellFocusOut = (params, event) => {
		event.defaultMuiPrevented = true;
	};

	const columns = [
		{field: 'id', headerName: 'id', editable: false},
		{
			field: 'guestId',
			headerName: 'Guest Id',
			editable: false,
			flex: 1,
		},
		{
			field: 'creationTime',
			headerName: 'Creation Time',
			type: 'date',
			editable: false,
			flex: 1,
			// renderCell: ExpandCellGrid,
		},
		{
			field: 'terminationTime',
			headerName: 'Termination Time',
			type: 'date',
			editable: false,
			flex: 1,
			// renderCell: ExpandCellGrid,
		},
		{
			field: 'items',
			headerName: 'items',
			editable: false,
			flex: 1,
			type: 'string',
			valueGetter: params => {
				return Array.from(params.value)
					.map(
						(entry: (number | string)[]) =>
							`${entry[0]} - ${entry[1]}`
					)
					.join(' | ');
			},
			renderCell: ExpandCellGrid,
		},
		{
			field: 'status',
			align: 'left',
			headerName: 'Status',
			alignHeaderName: 'left',
			type: 'actions',
			flex: 1,
			renderCell: params => {
				const orderId = params.row.id;
				const status = params.row.status;
				return (
					<StatusViewController
						orderId={orderId}
						status={status}
						orderViewModel={ordersViewModel}
						width={params.colDef.computedWidth}
					/>
				);
			},
		},
		{
			field: 'AssignedWaiter',
			headerName: 'AssignedWaiter',
			type: 'actions',
			cellClassName: 'assignWaiter',
			flex: 1,
			renderCell: props => {
				const orderId = Number.parseInt(props.row.id);
				return (
					<WaiterDialogViewController
						waitersViewModel={waitersViewModel}
						orderId={orderId}
					/>
				);
			},
		},
	];

	return (
		<div>
			<AppBarView />
			<OrdersView
				orders={ordersViewModel.orders}
				columns={columns}
				handleRowEditStart={handleRowEditStart}
				handleRowEditStop={handleRowEditStop}
				handleCellFocusOut={handleCellFocusOut}
			/>
		</div>
	);
}

export default OrdersViewController;

OrdersViewController.propTypes = {
	ordersViewModel: propTypes.object,
	waitersViewModel: propTypes.object,
	row: propTypes.object,
};
