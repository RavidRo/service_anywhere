import {OrderStatus} from '../../../api';
import * as React from 'react';
import StatusView from '../view/StatusView';
import {Status, StatusToNumber} from '../Status';
import PropTypes from 'prop-types';
import OrdersViewModel from '../viewModel/ordersViewModel';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Avatar from '@mui/material/Avatar';
import {blue} from '@mui/material/colors';
import {CardHeader} from '@mui/material';

export default function StatusViewController(props: {
	orderId: number;
	status: string;
	orderViewModel: any;
	width: number;
}) {
	const {orderId, status, orderViewModel, width} = props;
	const [currentStep, setCurrentStep] = React.useState(
		StatusToNumber.get(status) || 0
	);

	const backable: number[] = [
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
		return Status[step] !== 'DELIVERED';
	};
	const handleNext = () => {
		if (!isStepNextable(currentStep)) {
			throw new Error('This step is not nextable');
		}
		if (orderViewModel.changeOrderStatus(orderId, currentStep + 1)) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handleBack = () => {
		if (!isStepBackable(currentStep)) {
			throw new Error('This step is not backable');
		}
		if (orderViewModel.changeOrderStatus(orderId, currentStep - 1)) {
			setCurrentStep(currentStep - 1);
		}
	};
	const handleCancel = () => {
		if (!isStepCancelable(currentStep)) {
			throw new Error('This step is not cancelable');
		}
		if (orderViewModel.cancelOrder(orderId)) {
			setCurrentStep(Status['CANCELED']);
		}
	};

	const wrapper = React.useRef<HTMLDivElement | null>(null);
	const cellDiv = React.useRef(null);
	const cellValue = React.useRef(null);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [showFullCell, setShowFullCell] = React.useState(false);
	const [showPopper, setShowPopper] = React.useState(false);
	const popperWidth = 1100;
	const handleMouseEnter = () => {
		setShowPopper(true);
		setAnchorEl(cellDiv.current);
		setShowFullCell(true);
	};

	const handleMouseLeave = () => {
		setShowFullCell(false);
	};

	React.useEffect(() => {
		if (!showFullCell) {
			return undefined;
		}

		function handleKeyDown(nativeEvent) {
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
				{console.log(status)}

				<CardHeader
					avatar={
						<Avatar
							sx={{width: 24, height: 24, bgcolor: blue[700]}}>
							<Typography variant='body1'>
								{StatusToNumber.get(status)! + 1}
							</Typography>
						</Avatar>
					}
					title={status}
				/>
			</Box>
			{showPopper && (
				<Popper
					open={showFullCell && anchorEl !== null}
					anchorEl={anchorEl}
					style={{width: popperWidth, marginLeft: -17}}>
					<Paper
						elevation={1}
						style={{minHeight: wrapper.current!.offsetHeight - 3}}>
						<Typography variant='body2' style={{padding: 8}}>
							<Box sx={{width: '100%'}}>
								<StatusView
									steps={Object.values(Status).filter(
										entry => !Number.isInteger(entry)
									)}
									isStepNextable={isStepNextable}
									isStepBackable={isStepBackable}
									isStepCancelable={isStepCancelable}
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

StatusViewController.propTypes = {
	orderId: PropTypes.number,
	status: PropTypes.string,
	orderViewModel: PropTypes.object,
	width: PropTypes.number,
};
