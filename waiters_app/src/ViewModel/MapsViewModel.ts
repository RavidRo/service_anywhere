import Singleton from '../Singleton';

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
			imageURL:
				'https://res.cloudinary.com/noa-health/image/upload/v1640287601/bengurion-map_q32yck.png',
		};
	}
}
