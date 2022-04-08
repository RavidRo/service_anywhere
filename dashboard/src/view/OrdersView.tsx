import {makeStyles} from '@material-ui/core/styles';
import {toJS} from 'mobx';
import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import Box from '@mui/material/Box';
import {DataGrid, GridActionsCellItem} from '@mui/x-data-grid';

const _useStyles = makeStyles(theme => ({
	root: {
		width: 'fit-content',
		color: theme.palette.text.secondary,
		'& svg': {
			margin: theme.spacing(2),
		},
		'& hr': {
			margin: theme.spacing(0, 0.5),
		},
	},
}));

function OrdersView(props: any) {
	const {
		orders,
		columns,
		handleRowEditStart,
		handleRowEditStop,
		handleCellFocusOut,
	} = props;

	return (
		<Box
			sx={{
				height: 500,
				width: '100%',
				'& .actions': {
					color: 'text.secondary',
				},
				'& .textPrimary': {
					color: 'text.primary',
				},
			}}>
			<DataGrid
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
