import * as React from 'react';
import WaiterDialogView from '../view/WaiterDialogView';
import propTypes from 'prop-types';

export default function WaiterDialogViewController(props) {
	const {onClose, open, waitersViewModel} = props;

	const handleClose = () => {
		onClose('');
	};

	const handleListItemClick = value => {
		onClose(value);
	};

	return (
		<WaiterDialogView
			waiters={waitersViewModel.waiters}
			handleClose={handleClose}
			handleListItemClick={handleListItemClick}
			open={open}
		/>
	);
}

WaiterDialogViewController.propTypes = {
	onClose: propTypes.func,
	open: propTypes.bool,
	waitersViewModel: propTypes.object,
};
