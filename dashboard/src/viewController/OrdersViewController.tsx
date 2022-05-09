import * as React from 'react';
import AppBarView from '../view/AppBarView';
import WaiterDialogViewController from './WaiterDialogViewController';
import OrdersView from '../view/OrdersView';
import StatusViewController from './StatusViewController';
import ExpandCellGrid from '../view/ExpandCellGrid';
import OrdersViewModel from '../viewModel/ordersViewModel';
import WaiterViewModel from '../viewModel/waitersViewModel';
import {
	GridRenderCellParams,
	GridValueGetterParams,
	MuiEvent,
} from '@mui/x-data-grid';
import {observer} from 'mobx-react';
import {Divider} from '@mui/material';

interface viewModelProps {
	ordersViewModel: OrdersViewModel;
	waitersViewModel: WaiterViewModel;
}
const OrdersViewController = observer((props: viewModelProps) => {
	console.info('Starting orders view controller');
	const {ordersViewModel, waitersViewModel} = props;
	const handleRowEditStart = (_, event: MuiEvent) => {
		event.defaultMuiPrevented = true;
	};

	const handleRowEditStop = (_, event: MuiEvent) => {
		event.defaultMuiPrevented = true;
	};

	const handleCellFocusOut = (_, event: MuiEvent) => {
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
			field: 'guestId',
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
			renderCell: ExpandCellGrid,
		},
		{
			field: 'completionTime',
			headerName: 'Completion Time',
			type: 'date',
			editable: false,
			flex: 1,
			renderCell: ExpandCellGrid,
		},
		{
			field: 'items',
			headerName: 'items',
			editable: false,
			flex: 1.5,
			type: 'string',
			valueGetter: (params: GridValueGetterParams) => {
				//(entry: (number | string)[])
				return Object.keys(params.value).map((key: string) => {
					return (
						<React.Fragment key={key}>
							{`${key} - ${params.value[key]}`}
							<Divider variant='fullWidth' />
						</React.Fragment>
					);
				});
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
			renderCell: (params: GridRenderCellParams) => {
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
			flex: 1.5,
			renderCell: (renderProps: GridRenderCellParams) => {
				const orderId = renderProps.row.id;
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
				orders={ordersViewModel.getOrders()}
				columns={columns}
				handleRowEditStart={handleRowEditStart}
				handleRowEditStop={handleRowEditStop}
				handleCellFocusOut={handleCellFocusOut}
			/>
		</div>
	);
});

export default OrdersViewController;
