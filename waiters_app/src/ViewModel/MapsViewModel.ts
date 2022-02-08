import Singleton from '../Singleton';
import configuration from '../../configuration.json';

type MapDetails = {
	id: string;
	name: string;
	imageURL: string;
};
export default class MapsViewModel extends Singleton {
	constructor() {
		super();
	}

	getMapDetails(): MapDetails {
		return {
			id: '',
			name: '',
			imageURL: configuration['map-image-url'],
		};
	}
}
