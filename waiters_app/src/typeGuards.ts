import {Location, OrderStatus} from './ido';

export function isLocation(location: any): location is Location {
	return (
		(location as Location).x !== undefined &&
		(location as Location).y !== undefined
	);
}

export function isString(someString: any): someString is string {
	return typeof someString === 'string';
}

export function isOrderStatus(status: any): status is OrderStatus {
	const result = ['unassigned', 'inprogress', 'completed', 'delivered'].find(
		availableStatus => availableStatus === status
	);
	return result !== undefined;
}
