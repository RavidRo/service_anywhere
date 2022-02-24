import {OrderID, OrderStatus} from './types';

export type OrderIDO = {
	id: OrderID;
	guestId: string;
	items: Map<string, Number>;
	status: OrderStatus;
	creationTime: Date;
	terminationTime: Date;
};
