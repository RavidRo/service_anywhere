import {makeStyles} from '@material-ui/core/styles';
import {toJS} from 'mobx';
import Box from '@mui/material/Box';
import {DataGrid, GridColumns, MuiEvent} from '@mui/x-data-grid';
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
	handleRowEditStart: (_, event: MuiEvent) => void;
	handleRowEditStop: (_, event: MuiEvent) => void;
	handleCellFocusOut: (_, event: MuiEvent) => void;
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
			/>
		</Box>
	);
};

export default observer(OrdersView);
