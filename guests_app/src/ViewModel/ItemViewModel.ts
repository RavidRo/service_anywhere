import {ItemModel} from '../Model/ItemModel';
import Requests from '../Networking/requests';

export default class ItemsViewModel {
	private itemsModel: ItemModel;
	private requests: Requests;

	constructor(requests: Requests) {
		this.requests = requests;
		this.itemsModel = ItemModel.getInstance();
	}

	syncItems(): Promise<void> {
		return this.requests.getItems().then(items => {
			this.itemsModel.items = items;
		});
	}

	getItems() {
		return this.itemsModel.items;
	}
}