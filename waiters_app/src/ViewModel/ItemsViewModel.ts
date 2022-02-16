import {ItemIdo} from '../ido';
import ItemModel from '../Models/ItemModel';
import Requests from '../networking/Requests';
import Singleton from '../Singleton';

export class ItemsViewModel extends Singleton {
	private itemsModel: ItemModel;
	private requests: Requests;

	constructor(requests: Requests) {
		super();
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
