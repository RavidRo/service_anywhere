import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {observer} from 'mobx-react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ReviewsIcon from '@mui/icons-material/Reviews';
import {ReviewIDO} from '../../../api';
import {Button, DialogContentText, Rating} from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

type reviewProps = {
	review: ReviewIDO | undefined;
	handleOpen: () => void;
	handleClose: () => void;
	open: boolean;
};
const dialogTitle = 'Review';

function ReviewView(props: reviewProps) {
	const {review, handleOpen, handleClose, open} = props;
	return (
		<div>
			<Typography fontSize={16}>
				{review !== undefined ? (
					<IconButton
						color='primary'
						aria-label='service'
						component='span'
						size='large'
						onClick={handleOpen}>
						<ReviewsIcon />
					</IconButton>
				) : (
					`no review received yet`
				)}
			</Typography>
			<Dialog onClose={handleClose} open={open}>
				<DialogTitle>{dialogTitle}</DialogTitle>
				<Rating name='Rating' value={review?.rating || 0} readOnly />
				<DialogContent dividers sx={{pt: 0}}>
					<DialogContentText>{review?.details}</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button autoFocus onClick={handleClose}>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default observer(ReviewView);
