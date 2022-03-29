import * as React from 'react';
import AppBarView from '../view/AppBarView';
import propTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {useGridApiRef, GridActionsCellItem} from '@mui/x-data-grid';
import WaiterDialogViewController from './WaiterDialogViewController';
import OrdersView from '../view/OrdersView';
import StatusViewController from './StatusViewController';

function OrdersViewController(props) {
	const {ordersViewModel, waitersViewModel} = props;
	// const apiRef = useGridApiRef();
	// console.log(apiRef);
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
		},
		{
			field: 'creationTime',
			headerName: 'Creation Time',
			type: 'date',
			editable: false,
			flex: 1
		},
		{
			field: 'terminationTime',
			headerName: 'Termination Time',
			type: 'date',
			editable: false,
			flex: 1
		},
		{
			field: 'items',
			headerName: 'items',
			editable: false,
			flex: 1.5,
			type: "string", 
			valueFormatter: (params) => {
				console.log(params.value);
				return params.value.join(', ');
			}
		},
		{
			field: 'status', 
			align: 'left',
			headerName: 'Status', 
			alignHeaderName:'left',
			editable: true, 
			type: "actions",
			flex: 1.5,
			renderCell: (params) => {
				const orderId = params.row.orderId;
				const status = params.row.status;
				return(<StatusViewController 
					orderId={orderId} 
					status={status} 
					orderViewModel={ordersViewModel}/>);
			}
		},
		{
			field: 'AssignedWaiter',
			headerName: 'AssignedWaiter',
			width: 220,
			type: 'actions',
			editable: true,
			cellClassName: 'assignWaiter',
<<<<<<< HEAD:dashboard/src/viewController/OrdersViewController.tsx
			flex: 1,
			renderCell: (params) => {
				const orderId = Number.parseInt(params.row.id);
				return (
					<WaiterDialogViewController
						waitersViewModel={waitersViewModel}
						orderId={orderId}
					/>
				);
			},
		},
=======
			renderCell: params => {
				const orderId = params.row.id;
				<WaiterDialogViewController
					waitersViewModel={waitersViewModel}
					orderId={orderId}
				/>;
			},
		},
		{
			field: 'actions',
			type: 'actions',
			headerName: 'Actions',
			width: 100,
			cellClassName: 'actions',
			renderCell: params => {
				const id = params.row.id;
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
>>>>>>> d4079a17f4dd2aa8482686c17d9a6496559fbfaf:dashboard/src/viewController/OrdersViewController.jsx
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
};
