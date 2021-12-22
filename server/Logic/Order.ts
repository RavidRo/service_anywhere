import { Status } from "./Status";
import {v4 as uuidv4} from 'uuid';
import { OrderID, Location} from "../api";

class Review{
    content: string;
    rating: number;

    constructor(cont: string, rate: number){
        this.content = cont;
        this.rating = rate;
    }
}

export class Order{
    static orderList: Order[];
    status: Status;
    id: string;
    items: string[];
    review: Review;
    guestLocation: Location;
    arrived: boolean;
    
    static createOrder(items: string[]): string{
        let order = new Order(items);
        this.orderList.push(order);
        return order.id;
    }

    static delegate(orderId: OrderID, func: (order: Order) => boolean): boolean{
        for (const element of Order.orderList) {
            if(element.id === orderId){
                return func(element);
            }
        }
        return false;
    }

    static getGuestLocation(orderID: OrderID): Location{
        for (const element of Order.orderList) {
            if(element.id === orderID){
                return element.guestLocation;
            }
        }
        return {x: -1, y: -1}
    }

    constructor(items: string[]){
        this.items = items;
        this.status = Status.RECEIVED;
        this.id = uuidv4();
        this.arrived = false;
    }

    giveFeedback(content: string, rating: number): boolean{
        this.review = new Review(content, rating);
        return true;
    }

    updateLocationGuest(location: Location): boolean{
        this.guestLocation = location;
        return true;
    }

    hasOrderArrived(): boolean{
        return this.arrived;
    }

    orderArrived(): void{
        this.arrived = true;
    }

    
}