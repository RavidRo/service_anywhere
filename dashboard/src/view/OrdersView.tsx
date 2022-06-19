import {makeStyles} from '@material-ui/core/styles';
import {toJS} from 'mobx';
import Box from '@mui/material/Box';
import {
	DataGrid,
	GridCallbackDetails,
	GridCellParams,
	GridColumns,
	GridRowParams,
	MuiEvent,
} from '@mui/x-data-grid';
import {observer} from 'mobx-react';
import {OrderIDO} from '../../../api';

const useStyles = makeStyles({
	dataGrid: {
		height: '100%',
	},
});

type orderProps = {
	orders: OrderIDO[];
	columns: GridColumns;
	handleRowEditStart: (_params: GridRowParams, event: MuiEvent) => void;
	handleRowEditStop: (_params: GridRowParams, event: MuiEvent) => void;
	handleCellFocusOut: (
		_params: GridCellParams,
		event: MuiEvent,
		_details: GridCallbackDetails
	) => void;
};
const OrdersView = (props: orderProps) => {
	console.log('Starting the orders view');
	const {
		orders,
		columns,
		handleRowEditStart,
		handleRowEditStop,
		handleCellFocusOut,
	} = props;
	const classes = useStyles();
	console.log(toJS(orders));
	return (
		<Box
			sx={{
				height: '90vh',
				width: '100%',
				'& .actions': {
					color: 'text.secondary',
				},
				'& .textPrimary': {
					color: 'text.primary',
				},
				'& .ongoing': {
					backgroundColor: '#89e0c3',
					color: '#1a3e72',
				},
				'& .done': {
					backgroundColor: '#d6d6d6',
					// color: '#1a3e72',
				},
			}}>
			<DataGrid
				className={classes.dataGrid}
				rows={toJS(orders)}
				columns={columns}
				editMode='row'
				onRowEditStart={handleRowEditStart}
				onRowEditStop={handleRowEditStop}
				onCellFocusOut={handleCellFocusOut}
				rowHeight={100}
				autoPageSize
				getCellClassName={(params: GridCellParams<string>) => {
					return params.row.status === 'canceled' ||
						params.row.status === 'delivered'
						? 'done'
						: 'ongoing';
				}}
			/>
		</Box>
	);
};

export default observer(OrdersView);
