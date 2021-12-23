import {v4 as uuidv4} from 'uuid'
import { OrderID, WaiterID } from '../api';

export class WaiterOrder{
    static waiterList: string[] = [];
    static waiterToOrders: Map<string, string[]> = new Map();
    static orderToWaiters: Map<string, string[]> = new Map();
    
    static connectWaiter(): string{
        let waiterId = uuidv4()
        this.waiterList.push(waiterId);
        this.waiterToOrders.set(waiterId, [])
        return waiterId;
    }
    
    static assignWaiter(orderId: OrderID, waiterId: WaiterID): void{
        //this.waiterToOrders.set(waiterId, this.waiterToOrders.get(waiterId).push(orderId))
    }
}