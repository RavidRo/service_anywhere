import {ItemIdo} from '../ido';
import ItemModel from '../Models/ItemModel';
import Requests from '../networking/Requests';

export class ItemsViewModel {
	private itemsModel: ItemModel;
	private requests: Requests;

	constructor(requests: Requests) {
		this.itemsModel = new ItemModel();
		this.requests = requests;
	}

	get items(): ItemIdo[] {
		return this.itemsModel.items;
	}

	syncItems(): Promise<void> {
		return this.requests.getItems().then(items => {
			this.itemsModel.items = items;
		});
	}
}
