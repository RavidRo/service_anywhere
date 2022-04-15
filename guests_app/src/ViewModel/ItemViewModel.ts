import {ItemModel} from '../Model/ItemModel';
import Requests from '../Networking/requests';
import { ItemIDO } from '../signatures';

export default class ItemsViewModel {
	private itemsModel;
	private requests: Requests;

	constructor(requests: Requests) {
		this.requests = requests;
		this.itemsModel = new ItemModel();
	}

	get items(): ItemIDO[] {
		return this.itemsModel.items;
	}

	/**
   @todo: Need to add the process of making the Item[] objects from the server's response data ?
	**/
	syncItems(): Promise<void> {
		return this.requests.getItemsGuest().then(items => {
			this.itemsModel.items = items;
		});
	}

	getItems() {
		return this.itemsModel.items;
	}
}
