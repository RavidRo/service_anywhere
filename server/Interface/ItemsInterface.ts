import {ItemIDO} from '../../api';
import {getItems as getPersistentItems} from '../Data/Stores/ItemStore';

function getItems(): Promise<ItemIDO[]> {
	return getPersistentItems();
}

export default {
	getItems,
};
