import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';

function StatusView(props: any) {
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
					const stepProps = {};
					const labelProps: {
						optional?: React.ReactNode;
						error?: boolean;
					} = {};
					if (isStepFailed(index)) {
						// labelProps.optional = (
						// 	<Typography variant='caption' color='error'>
						// 		Canceled
						// 	</Typography>
						// );
						labelProps.error = true;
					}

					return (
						<Step key={label} {...stepProps}>
							<StepLabel {...labelProps}>{label}</StepLabel>
						</Step>
					);
				})}
			</Stepper>
			{
				<React.Fragment>
					{/* <Typography sx={{ mt: 2, mb: 1 }}>Step {currentStep + 1}</Typography> */}
					<Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
						{isStepBackable(currentStep) && (
							<Button
								color='inherit'
								disabled={currentStep === 0}
								onClick={handleBack}
								sx={{mr: 1}}>
								Back
							</Button>
						)}
						<Box sx={{flex: '1 1 auto'}} />
						{isStepCancelable(currentStep) && (
							<Button
								color='inherit'
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

StatusView.propTypes = {
	steps: PropTypes.array,
	isStepNextable: PropTypes.func,
	isStepBackable: PropTypes.func,
	isStepCancelable: PropTypes.func,
	isStepFailed: PropTypes.func,
	currentStep: PropTypes.number,
	handleNext: PropTypes.func,
	handleBack: PropTypes.func,
	handleCancel: PropTypes.func,
};
