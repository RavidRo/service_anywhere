import * as React from 'react';
import AppBarView from '../view/AppBarView';
import propTypes from 'prop-types';
import WaiterDialogViewController from './WaiterDialogViewController';
import OrdersView from '../view/OrdersView';
import StatusViewController from './StatusViewController';
import ExpandCellGrid from '../view/ExpandCellGrid';
import OrdersViewModel from '../viewModel/ordersViewModel';
import WaiterViewModel from '../viewModel/waitersViewModel';
import {
	GridParamsApi,
	GridRenderCellParams,
	GridValueGetterParams,
	MuiEvent,
} from '@mui/x-data-grid';
import {makeStyles} from '@mui/styles';
import {observer} from 'mobx-react';

interface viewModelProps {
	ordersViewModel: OrdersViewModel;
	waitersViewModel: WaiterViewModel;
}

const useStyles = makeStyles({
	div: {
		height: '100%',
	},
});

const OrdersViewController = observer((props: viewModelProps) => {
	console.info('Starting orders view controller');
	const {ordersViewModel, waitersViewModel} = props;
	const handleRowEditStart = (_: any, event: MuiEvent) => {
		event.defaultMuiPrevented = true;
	};

	const handleRowEditStop = (_: any, event: MuiEvent) => {
		event.defaultMuiPrevented = true;
	};

	const handleCellFocusOut = (_: any, event: MuiEvent) => {
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
			valueGetter: (params: GridValueGetterParams) => {
				//(entry: (number | string)[])
				return Array.from(params.value)
					.map((entry: any) => `${entry[0]} - ${entry[1]}`)
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
			flex: 1,
			renderCell: (props: GridRenderCellParams) => {
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
	const classes = useStyles();
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
