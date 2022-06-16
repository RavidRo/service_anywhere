import * as React from 'react';
import {observer} from 'mobx-react';
import WaitersViewModel from '../viewModel/waitersViewModel';
import OrdersViewModel from '../viewModel/ordersViewModel';
import ReviewView from '../view/ReviewView';

type reviewProps = {
	ordersViewModel: OrdersViewModel;
	orderID: string;
};
function ReviewViewController(props: reviewProps) {
	const {ordersViewModel, orderID} = props;
	const [open, setOpen] = React.useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<ReviewView
			review={ordersViewModel.getReview(orderID)}
			handleOpen={handleOpen}
			handleClose={handleClose}
			open={open}
		/>
	);
}

export default observer(ReviewViewController);
