import * as React from 'react';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {observer} from 'mobx-react';

function CustomAlert(props) {
	const [open, setOpen] = React.useState(true);
	const {content, ...rest} = props;

	return (
		<Alert
			{...rest}
			action={
				<IconButton
					aria-label='close'
					color='inherit'
					size='small'
					onClick={() => {
						setOpen(false);
					}}>
					<CloseIcon fontSize='inherit' />
				</IconButton>
			}
			sx={{mb: 2}}>
			{content}
		</Alert>
	);
}

export default observer(CustomAlert);
