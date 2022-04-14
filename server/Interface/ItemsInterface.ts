import {ItemIDO} from '../../api';
import {getItems as getConsistentItems} from '../Data/ItemStore';

function getItems(): Promise<ItemIDO[]> {
	return getConsistentItems();
}

export default {
	getItems,
};
