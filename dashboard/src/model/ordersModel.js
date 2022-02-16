import {makeAutoObservable} from 'mobx';
import { CaughtException } from 'mobx/dist/internal';

export default class DashboardModel {
    _orders = []

    constructor(){
        makeAutoObservable(this);
    }
    setOrders(orders) {
        this._orders = orders
    }

    getOrders() {
        return this._orders
    }

}

