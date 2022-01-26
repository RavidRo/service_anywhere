import { Order } from "../types";

export class OrderModel {
    private static instance: OrderModel;
    private order: Order | undefined;
    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() {
        this.order = undefined;
    }

    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    public static getInstance(): OrderModel {
        if (!OrderModel.instance) {
            OrderModel.instance = new OrderModel();
        }

        return OrderModel.instance;
    }

    /**
     * Finally, any singleton should define some business logic, which can be
     * executed on its instance.
     */
    public someBusinessLogic() {
        // ...
    }

    public setOrder(order: Order): void
    {
        this.order = order
    }
    public getOrder(): Order | undefined
    {
        return this.order;
    }
}
