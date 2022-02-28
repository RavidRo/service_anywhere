import {makeAutoObservable} from 'mobx';
import {ItemIdo} from '../ido';

export default class OrderModel {
	private _items: ItemIdo[];
	constructor() {
		this._items = [];
		makeAutoObservable(this);
	}

	get items() {
		return this._items;
	}

	set items(newItems: ItemIdo[]) {
		this._items = newItems;
	}
}
