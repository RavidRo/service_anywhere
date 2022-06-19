import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {observer} from 'mobx-react';

type props = {
	content: string;
	onClick: (content: string) => void;
	[x: string]: unknown;
};
function CustomAlert(props: props) {
	const {content, onClick, ...rest} = props;
	return (
		<Alert
			{...rest}
			action={
				<IconButton
					aria-label='close'
					color='inherit'
					size='small'
					onClick={() => onClick(content)}>
					<CloseIcon fontSize='inherit' />
				</IconButton>
			}
			sx={{mb: 2}}>
			{content}
		</Alert>
	);
}

export default observer(CustomAlert);
