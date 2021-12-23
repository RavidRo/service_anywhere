import {v4 as uuidv4} from 'uuid'
import { OrderID, WaiterID } from '../api';

export class WaiterOrder{
    static waiterList: string[] = ["imashelTommer", "abashelTommer"];
    static waiterToOrders: Map<string, string[]> = new Map();
    static orderToWaiters: Map<string, string[]> = new Map();
    
    static connectWaiter(): string{
        let waiterId = uuidv4()
        this.waiterList.push(waiterId);
        return waiterId;
    }
    
    static assignWaiter(orderId: OrderID, waiterId: WaiterID): void{
        let orders = this.waiterToOrders.get(waiterId)
        console.log(`assigned waiter id: ${waiterId}`)
        console.log(this.waiterToOrders.get(waiterId))
        if(orders){
            orders.push(orderId)
        }
        else{
            this.waiterToOrders.set(waiterId, [orderId])
        }
        console.log(this.waiterToOrders.get(waiterId))
        let waiters = this.orderToWaiters.get(orderId)
        if(waiters){
            waiters.push(waiterId)
        }
        else{
            this.orderToWaiters.set(orderId, [waiterId])
        }
    }

    static getWaiterByOrder(orderId: OrderID): string[]{
        console.log(`order id: ${orderId}`)
        let waiters = this.orderToWaiters.get(orderId)
        if(waiters){
            return waiters; //makeGood(waiters)
        }
        return []   //makeFail('this order does not exists or it has no waiters assigned.')
    }

    static getWaiterOrder(waiterId: WaiterID): string[]{
        console.log(`waiter id: ${waiterId}`)
        let orders = this.orderToWaiters.get(waiterId)
        if(orders){
            return orders;  //makeGood(orders)
        }
        return []   //makeFail('this waiter does not exist or has no orders')
    }
}