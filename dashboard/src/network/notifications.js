
export default class Notificiations{
    constructor(ordersViewModel, waitersViewModel){
        this.ordersViewModel = ordersViewModel;
        this.waitersViewModel = waitersViewModel;
    }
    
    eventCallbacks ={ 
        updateOrders: this.updateOrders, 
        updateWaiters: this.updateWaiters, 
    }

    updateOrders(params){
        console.log("not implemented yet")
    }

    updateWaiters(params){
        console.log("not implemented yet")
    }
}