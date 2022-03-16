import * as React from 'react';
import AppBarView from '../view/AppBarView';
import OrderViewController from './OrderViewController';
import propTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {useGridApiRef, GridActionsCellItem} from '@mui/x-data-grid';
import WaiterDialogViewController from './WaiterDialogViewController';
import OrdersView from '../view/OrdersView';

function OrdersViewController(props) {
	const {ordersViewModel, waitersViewModel} = props;
	const apiRef = useGridApiRef();
	console.log(apiRef);
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
		apiRef.current.setRowMode(id, 'edit');
	};

	const handleSaveClick = id => async event => {
		event.stopPropagation();
		// Wait for the validation to run
		const isValid = await apiRef.current.commitRowChange(id);
		if (isValid) {
			apiRef.current.setRowMode(id, 'view');
			const row = apiRef.current.getRow(id);
			apiRef.current.updateRows([{...row, isNew: false}]);
		}
	};

	const handleDeleteClick = id => event => {
		event.stopPropagation();
		apiRef.current.updateRows([{id, _action: 'delete'}]);
	};

	const handleCancelClick = id => event => {
		event.stopPropagation();
		apiRef.current.setRowMode(id, 'view');
	};

	const columns = [
		{field: 'Status', headerName: 'Status', width: 180, editable: true},
		{field: 'id', headerName: 'id', editable: false},
		{
			field: 'dateCreated',
			headerName: 'Date Created',
			type: 'date',
			width: 180,
			editable: false,
		},
		{
			field: 'dateDelivered',
			headerName: 'Date delivered',
			type: 'dateTime',
			width: 220,
			editable: false,
		},
		{
			field: 'items',
			headerName: 'items',
			width: 220,
			editable: false,
		},
		{
			field: 'Review',
			headerName: 'review',
			width: 220,
			editable: false,
		},
		{
			field: 'AssignedWaiter',
			headerName: 'AssignedWaiter',
			width: 220,
			editable: true,
			cellClassName: 'assignWaiter',
			getActions: ({id}) => {
				const orderId = apiRef.current.getRow(id).id;
				return (
					<WaiterDialogViewController
						waitersViewModel={waitersViewModel}
						orderId={orderId}
					/>
				);
			},
		},
		{
			field: 'actions',
			type: 'actions',
			headerName: 'Actions',
			width: 100,
			cellClassName: 'actions',
			getActions: ({id}) => {
				const isInEditMode = apiRef.current.getRowMode(id) === 'edit';

				if (isInEditMode) {
					return [
						<GridActionsCellItem
							icon={<SaveIcon />}
							label='Save'
							onClick={handleSaveClick(id)}
							color='primary'
							key='save'
						/>,
						<GridActionsCellItem
							icon={<CancelIcon />}
							label='Cancel'
							className='textPrimary'
							onClick={handleCancelClick(id)}
							color='inherit'
							key='cancel'
						/>,
					];
				}

				return [
					<GridActionsCellItem
						icon={<EditIcon />}
						label='Edit'
						className='textPrimary'
						onClick={handleEditClick(id)}
						color='inherit'
						key='edit'
					/>,
					<GridActionsCellItem
						icon={<DeleteIcon />}
						label='Delete'
						onClick={handleDeleteClick(id)}
						color='inherit'
						key='delete'
					/>,
				];
			},
		},
	];

	return (
		<div>
			<AppBarView />
			<OrdersView
				orders={ordersViewModel.orders}
				columns={columns}
				apiRef={apiRef}
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
};
