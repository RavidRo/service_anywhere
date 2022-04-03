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

	const handleEditClick = id => event => {
		event.stopPropagation();
		// apiRef.current.setRowMode(id, 'edit');
	};

	const handleSaveClick = id => async event => {
		event.stopPropagation();
		// // Wait for the validation to run
		// const isValid = await apiRef.current.commitRowChange(id);
		// if (isValid) {
		// 	apiRef.current.setRowMode(id, 'view');
		// 	const row = apiRef.current.getRow(id);
		// 	apiRef.current.updateRows([{...row, isNew: false}]);
		// }
	};

	const handleDeleteClick = id => event => {
		event.stopPropagation();
		// apiRef.current.updateRows([{id, _action: 'delete'}]);
	};

	const handleCancelClick = id => event => {
		event.stopPropagation();
		// apiRef.current.setRowMode(id, 'view');
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
			valueFormatter: params => {
				return Object.keys(params.value).join(', ');
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
