import configuration from '../../configuration.json';

type MapDetails = {
	id: string;
	name: string;
	imageURL: string;
};
export default class MapViewModel {
	getMapDetails(): MapDetails {
		return {
			id: '',
			name: '',
			imageURL: configuration['map-image-url'],
		};
	}
}
