import ItemModel from "../Model/ItemModel";
import Requests from "../Networking/requests";
import Singleton from "../Singeltone";
import { Item } from "../types";

export class ItemsViewModel extends Singleton {
	private itemsModel: ItemModel;
	private requests: Requests;

	constructor(requests: Requests) {
		super();
		this.itemsModel = new ItemModel();
		this.requests = requests;
	}

	get items(): Item[] {
		return this.itemsModel.items;
	}

	syncItems(): Promise<void> {
		return this.requests.getItems().then(items => {
			this.itemsModel.items = items;
		});
	}
}
