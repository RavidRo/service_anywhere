import * as React from 'react';
import AppBarView from '../view/AppBarView';
import WaiterDialogViewController from './WaiterViewController';
import OrdersView from '../view/OrdersView';
import StatusViewController from './StatusViewController';
import ExpandCellGrid from '../view/ExpandCellGrid';
import OrdersViewModel from '../viewModel/ordersViewModel';
import WaiterViewModel from '../viewModel/waitersViewModel';
import {
	GridCallbackDetails,
	GridCellParams,
	GridRenderCellParams,
	GridRowParams,
	GridValueGetterParams,
	MuiEvent,
} from '@mui/x-data-grid';
import {observer} from 'mobx-react';
import {Divider} from '@mui/material';
import ReviewViewController from './reviewViewController';

interface viewModelProps {
	ordersViewModel: OrdersViewModel;
	waitersViewModel: WaiterViewModel;
}
const OrdersViewController = (props: viewModelProps) => {
	console.info('Starting orders view controller');
	const {ordersViewModel, waitersViewModel} = props;
	const handleRowEditStart = (_params: GridRowParams, event: MuiEvent) => {
		event.defaultMuiPrevented = true;
	};

	const handleRowEditStop = (_params: GridRowParams, event: MuiEvent) => {
		event.defaultMuiPrevented = true;
	};

	const handleCellFocusOut = (
		_params: GridCellParams,
		event: MuiEvent,
		_details: GridCallbackDetails
	) => {
		event.defaultMuiPrevented = true;
	};

	const columns = [
		{
			field: 'id',
			headerName: 'id',
			editable: false,
			renderCell: ExpandCellGrid,
		},
		{
			field: 'guestID',
			headerName: 'Guest Id',
			editable: false,
			flex: 1,
			renderCell: ExpandCellGrid,
		},
		{
			field: 'creationTime',
			headerName: 'Creation Time',
			type: 'date',
			editable: false,
			flex: 1,
			valueGetter: (params: GridValueGetterParams) => {
				// console.log(typeof new Date(params.value));
				return new Date(params.value).toLocaleTimeString();
			},
			renderCell: ExpandCellGrid,
		},
		{
			field: 'completionTime',
			headerName: 'Completion Time',
			type: 'date',
			editable: false,
			flex: 1,
			valueGetter: (params: GridValueGetterParams) => {
				// (entry: (number | string)[])
				if (params.value !== undefined)
					return new Date(params.value).toLocaleTimeString();
				return '';
				// return params.value?.toLocaleTimeString();
			},
			renderCell: ExpandCellGrid,
		},
		{
			field: 'items',
			headerName: 'items',
			editable: false,
			flex: 1,
			type: 'string',
			valueGetter: (params: GridValueGetterParams) => {
				//(entry: (number | string)[])
				return Object.keys(params.value).map((key: string) => {
					return (
						<React.Fragment key={key}>
							{`${ordersViewModel.getItemName(key)} - ${
								params.value[key]
							}`}
							<Divider variant='fullWidth' />
						</React.Fragment>
					);
				});
			},
			renderCell: ExpandCellGrid,
		},
		{
			field: 'status',
			headerName: 'Status',
			alignHeaderName: 'left',
			type: 'actions',
			flex: 1,
			renderCell: (params: GridRenderCellParams) => {
				const orderID = params.row.id;
				const status = params.row.status;
				return (
					<StatusViewController
						orderID={orderID}
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
			flex: 1.5,
			renderCell: (renderProps: GridRenderCellParams) => {
				const orderID = renderProps.row.id;
				return renderProps.row.status !== 'delivered' ? (
					<WaiterDialogViewController
						waitersViewModel={waitersViewModel}
						ordersViewModel={ordersViewModel}
						orderID={orderID}
						status={renderProps.row.status}
						assignedWaiters={ordersViewModel.getAssignedWaiters(
							orderID
						)}
					/>
				) : (
					<ReviewViewController
						ordersViewModel={ordersViewModel}
						orderID={orderID}
					/>
				);
			},
		},
	];
	return (
		<div>
			<AppBarView />
			<OrdersView
				orders={ordersViewModel.getOrders()}
				columns={columns}
				handleRowEditStart={handleRowEditStart}
				handleRowEditStop={handleRowEditStop}
				handleCellFocusOut={handleCellFocusOut}
			/>
		</div>
	);
};

export default observer(OrdersViewController);
