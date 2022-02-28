//import {makeAutoObservable} from 'mobx';
import Singleton from '../Singeltone';
import {Item} from '../types';

export class ItemModel extends Singleton {
	private _items: Item[];

	public constructor() {
		super();
		//		makeAutoObservable(this);
	}

	get items(): Item[] {
		return this._items;
	}

	set items(items: Item[]) {
		this._items = items;
	}
}
