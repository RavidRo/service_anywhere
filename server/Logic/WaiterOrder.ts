import {v4 as uuidv4} from 'uuid'
import { OrderID, WaiterID } from '../api';

export class WaiterOrder{
    static waiterList: string[] = ["ima shel Tommer", "aba shel Tommer"];
    static waiterToOrders: Map<string, string[]> = new Map();
    static orderToWaiters: Map<string, string[]> = new Map();
    
    static connectWaiter(): string{
        let waiterId = uuidv4()
        this.waiterList.push(waiterId);
        return waiterId;
    }
    
    static assignWaiter(orderId: OrderID, waiterId: WaiterID): void{
        let orders = this.waiterToOrders.get(waiterId)
        if(orders){
            orders.push(orderId)
        }
        else{
            this.waiterToOrders.set(waiterId, [orderId])
        }
        let waiters = this.orderToWaiters.get(orderId)
        if(waiters){
            waiters.push(waiterId)
        }
        else{
            this.orderToWaiters.set(orderId, [waiterId])
        }
    }

    static getWaiterByOrder(orderId: OrderID): string[]{
        let waiters = this.orderToWaiters.get(orderId)
        if(waiters){
            return waiters;
        }
        return []
    }

    static getWaiterOrder(waiterId: WaiterID): string[]{
        let orders = this.orderToWaiters.get(waiterId)
        if(orders){
            return orders;
        }
        return []
    }
}