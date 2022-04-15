//import {makeAutoObservable} from 'mobx';
import { ItemIDO } from '../signatures';
import Singleton from '../Singeltone';

export class ItemModel extends Singleton {
	private _items: ItemIDO[];

	public constructor() {
		super();
		//		makeAutoObservable(this);
	}

	get items(): ItemIDO[] {
		return this._items;
	}

	set items(items: ItemIDO[]) {
		this._items = items;
	}
}
