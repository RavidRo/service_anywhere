import {OrderStatus} from "../../../api";
import * as React from 'react';
import StatusView from "../view/StatusView";
import { integerPropType } from "@mui/utils";

enum Status {
	 'received',
	 'in preparation',
	 'ready to deliver',
	 'assigned',
	 'on the way',
	 'delivered',
	 'canceled'
}

export default function StatusViewController(props){
    const {orderId, status, orderViewModel} = props;
    const [currentStep, setCurrentStep] = React.useState(status);

    console.log(`isInteger ${Number.isInteger(status)} ${Status[status]}`)
    const backable: number[] = [Status['ready to deliver'],Status['assigned'],Status['on the way']];
    const nextable: number[] = [Status['received'],Status['in preparation'],Status['ready to deliver'],Status['assigned'],Status['on the way']];

    const isStepNextable = (step: number) => {
        return step in nextable;
    }
    const isStepBackable = (step: number) => {
        return step in backable;
    }
    const isStepCancelable = (step: number) => {
        return Status[step] !== "DELIVERED"; 
    }
    const handleNext = () => {
        if(!isStepNextable(currentStep)){
            throw new Error("This step is not nextable")
        }
        if(orderViewModel.changeOrderStatus(orderId, currentStep + 1)){
            setCurrentStep(currentStep + 1);
        }
    }

    const handleBack = () => {
        if(!isStepBackable(currentStep)){
                throw new Error("This step is not backable")
        }
        if(orderViewModel.changeOrderStatus(orderId, currentStep - 1)){
            setCurrentStep(currentStep - 1);
        }
    }
    const handleCancel = () => {
        if(!isStepCancelable(currentStep)){
            throw new Error("This step is not cancelable")
        }
        if(orderViewModel.cancelOrder(orderId)){
            setCurrentStep(Status["CANCELED"]);
        }
    }
    // steps, isStepNextable, isStepBackable, isStepCancelable, currentStep, handleNext, handleBack, handleCancel

    return <StatusView 
            steps={Object.values(Status).filter((entry) => !Number.isInteger(entry))} 
            isStepNextable={isStepNextable}
            isStepBackable={isStepBackable}
            isStepCancelable={isStepCancelable}
            currentStep={currentStep}
            handleNext={handleNext}
            handleBack={handleBack}
            handleCancel={handleCancel}
            />

  };

