import {makeAutoObservable} from 'mobx';
import {ItemIDO} from '../types';

export class ItemModel {
	private _items: ItemIDO[];

	private constructor() {
		makeAutoObservable(this);
	}
	static instance?: ItemModel;
	static getInstance(): ItemModel {
		if (!this.instance) {
			this.instance = new ItemModel();
		}
		return this.instance;
	}

	get items(): ItemIDO[] {
		return this._items;
	}

	set items(items: ItemIDO[]) {
		this._items = items;
	}
}
