import * as React from 'react';
import StatusView from '../view/StatusView';
import {Status, StatusToNumber} from '../Status';
import OrdersViewModel from '../viewModel/ordersViewModel';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Avatar from '@mui/material/Avatar';
import {blue, red} from '@mui/material/colors';
import {CardHeader} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import {observer} from 'mobx-react';

function StatusViewController(props: {
	orderID: string;
	status: string;
	orderViewModel: OrdersViewModel;
	width: number;
}) {
	const {orderID, status, orderViewModel, width} = props;

	const sn = StatusToNumber.get(status);
	const currentStep: number = sn === undefined ? 0 : sn;

	const backable: number[] = [
		1,
		2, // 'ready to deliver'
		3, // 'assigned'
		4, // 'on the way'
	];
	const nextable: number[] = [
		0, // 'received'
		1, // 'in preparation'
		2, //'ready to deliver'
		3, //'assigned'
		4, //'on the way'
	];

	const isStepNextable = (step: number) => {
		return step in nextable;
	};
	const isStepBackable = (step: number) => {
		return step in backable;
	};
	const isStepCancelable = (step: number) => {
		return Status[step] !== 'delivered' && Status[step] !== 'canceled';
	};
	const isStepFailed = (step: number) => {
		return status === 'canceled' || Status[step] === 'canceled';
	};
	const handleNext = () => {
		if (!isStepNextable(currentStep)) {
			console.error('This step is not nextable');
		}
		orderViewModel
			.changeOrderStatus(orderID, Status[currentStep + 1])
			// .then(boolean => {
			// 	if (boolean) setCurrentStep(currentStep + 1);
			// })
			.catch(err => alert("Can't change order status " + err));
	};

	const handleBack = () => {
		if (!isStepBackable(currentStep)) {
			console.error('This step is not backable');
		}
		orderViewModel
			.changeOrderStatus(orderID, Status[currentStep - 1])
			// .then(boolean => {
			// 	if (boolean) setCurrentStep(currentStep - 1);
			// })
			.catch(err => alert("Can't change order status " + err));
	};
	const handleCancel = () => {
		if (!isStepCancelable(currentStep)) {
			throw new Error('This step is not cancelable');
		}

		orderViewModel
			.changeOrderStatus(orderID, 'canceled')
			// .then(boolean => {
			// 	if (boolean)
			// 		setCurrentStep(StatusToNumber.get('canceled') || 6);
			// })
			.catch(err => alert("Can't change order status " + err));
	};

	const wrapper = React.useRef<HTMLDivElement | null>(null);
	const cellDiv = React.useRef(null);
	const cellValue = React.useRef(null);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [showFullCell, setShowFullCell] = React.useState(false);
	const [showPopper, setShowPopper] = React.useState(false);
	const popperWidth = 1000;
	const handleMouseEnter = () => {
		setShowPopper(true);
		setAnchorEl(cellDiv.current);
		setShowFullCell(true);
	};

	const handleMouseLeave = () => {
		setShowFullCell(false);
	};

	const wrapperCurrent = wrapper.current;

	React.useEffect(() => {
		if (!showFullCell) {
			return undefined;
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		function handleKeyDown(nativeEvent: any) {
			// IE11, Edge (prior to using Bink?) use 'Esc'
			if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
				setShowFullCell(false);
			}
		}

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [setShowFullCell, showFullCell]);

	return (
		<Box
			ref={wrapper}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			sx={{
				alignItems: 'center',
				lineHeight: '24px',
				width: width,
				height: 1,
				position: 'relative',
				display: 'flex',
			}}>
			<Box
				ref={cellDiv}
				sx={{
					height: 1,
					width: width,
					display: 'block',
					position: 'absolute',
					top: 0,
				}}
			/>
			<Box
				ref={cellValue}
				sx={{
					whiteSpace: 'nowrap',
					overflow: 'hidden',
					textOverflow: '/ellipsis',
					width: width,
				}}>
				<CardHeader
					avatar={
						<>
							{isStepFailed(currentStep) ? (
								<WarningIcon
									sx={{
										width: 24,
										height: 24,
										color: red[700],
									}}
								/>
							) : (
								<Avatar
									sx={{
										width: 24,
										height: 24,
										bgcolor: blue[700],
									}}>
									<Typography variant='body1'>
										{currentStep + 1}
									</Typography>
								</Avatar>
							)}
						</>
					}
					title={status}
				/>
			</Box>
			{showPopper && (
				<Popper
					open={showFullCell && anchorEl !== null}
					anchorEl={anchorEl}
					style={{width: popperWidth, padding: -20, offset: -20}}>
					<Paper
						elevation={1}
						style={{
							minHeight:
								wrapperCurrent === null
									? 40
									: wrapperCurrent.offsetHeight - 5,
						}}>
						<Typography variant='body2' style={{padding: 8}}>
							<Box sx={{width: '100%'}}>
								<StatusView
									steps={Status}
									isStepNextable={isStepNextable}
									isStepBackable={isStepBackable}
									isStepCancelable={isStepCancelable}
									isStepFailed={isStepFailed}
									currentStep={currentStep}
									handleNext={handleNext}
									handleBack={handleBack}
									handleCancel={handleCancel}
								/>
							</Box>
						</Typography>
					</Paper>
				</Popper>
			)}
		</Box>
	);
}
export default observer(StatusViewController);
