import { OrderModel } from "../Model/OrderModel";
import {} from "../requests"

type Location = {
    x: number;
    y: number;
};

type Item = {
    id: String
    name: String 
    time: Number
}
type LocalizationDetailsIDO = {

}
export type Order = {
    id: OrderID;
    items: string[];
    status: OrderStatus;
};

type Arrived = boolean;
type OrderID = string;
type WaiterID = string;
type OrderStatus = "a" | "B" // what status will we be on each system?


export default class OrderViewModel{

    private order_model = OrderModel.getInstance();

    createOrder(items: String[]):Promise<OrderID>
    {
       // const location = getLocation()     need to send location on HTTP POST?
        requests.createOrder()
        res.then(())
    }


    login(password: String): Promise<void>
    {
        return new Promise<void>((resolve, reject) => {
            
        });
    }

    getItems!: () => Promise<[Item]>;
    getMaps!: () => Promise<LocalizationDetailsIDO>; // LocalizationDetailsIDO ?
    getMyOrders!: () => Promise<[Order]>;
    
    submitReview!: (deatils: String, rating: Number) => Promise<void>;
    cancelOrder!: (order_id: OrderID) => Promise<void>;
    updateGuestLocation!: (location: Location, orderID: OrderID) => void;
}