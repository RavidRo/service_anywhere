import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import {observer} from 'mobx-react';
import {OrderStatus} from '../../../api';

type statusProps = {
	steps: OrderStatus[];
	isStepNextable: (step: number) => boolean;
	isStepBackable: (step: number) => boolean;
	isStepCancelable: (step: number) => boolean;
	isStepFailed: (step: number) => boolean;
	currentStep: number;
	handleNext: () => void;
	handleBack: () => void;
	handleCancel: () => void;
};
function StatusView(props: statusProps) {
	console.log('creating status view');
	const {
		steps,
		isStepNextable,
		isStepBackable,
		isStepCancelable,
		isStepFailed,
		currentStep,
		handleNext,
		handleBack,
		handleCancel,
	} = props;
	return (
		<Box sx={{width: '100%'}}>
			<Stepper activeStep={currentStep}>
				{steps.map((label: string, index: number) => {
					const labelProps: {
						optional?: React.ReactNode;
						error?: boolean;
					} = {};
					if (isStepFailed(index)) {
						labelProps.error = true;
					}

					return (
						<Step key={label}>
							<StepLabel {...labelProps}>{label}</StepLabel>
						</Step>
					);
				})}
			</Stepper>
			{
				<React.Fragment>
					<Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
						{isStepBackable(currentStep) && (
							<Button
								disabled={currentStep === 0}
								onClick={handleBack}
								sx={{mr: 1}}>
								Back
							</Button>
						)}
						<Box sx={{flex: '1 1 auto'}} />
						{isStepCancelable(currentStep) && (
							<Button
								color='warning'
								onClick={handleCancel}
								sx={{mr: 1}}>
								Cancel
							</Button>
						)}

						{isStepNextable(currentStep) && (
							<Button onClick={handleNext}>{'Next'}</Button>
						)}
					</Box>
				</React.Fragment>
			}
		</Box>
	);
}

export default observer(StatusView);
