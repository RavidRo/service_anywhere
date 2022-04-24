import {makeStyles} from '@material-ui/core/styles';
import {toJS} from 'mobx';
import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import Box from '@mui/material/Box';
import {DataGrid, GridActionsCellItem} from '@mui/x-data-grid';

const useStyles = makeStyles({
	dataGrid: {
		height: '100%',
	},
});

function OrdersView(props: any) {
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
}

export default observer(OrdersView);
OrdersView.propTypes = {
	orders: PropTypes.array,
	columns: PropTypes.array,
	apiRef: PropTypes.object,
	handleRowEditStart: PropTypes.func,
	handleRowEditStop: PropTypes.func,
	handleCellFocusOut: PropTypes.func,
};
