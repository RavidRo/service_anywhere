import { MapDAO } from 'server/Data/entities/Domain/MapDAO';
import {MapIDO} from '../../api';
import {getMaps as getPersistentMaps} from '../Data/Stores/MapStore';

function DAOToIDO(mapDAO: MapDAO): MapIDO{
    return {
        id: mapDAO.id,
        name: mapDAO.name,
        imageURL: mapDAO.imageURL,
        corners: {
            topRightGPS: {
                latitude: mapDAO.topRightLat,
                longitude: mapDAO.topRightLong
            },
            bottomRightGPS: {
                latitude: mapDAO.bottomRightLat,
                longitude: mapDAO.bottomRightLong
            },
            topLeftGPS: {
                latitude: mapDAO.topLeftLat,
                longitude: mapDAO.topLeftLong
            },
            bottomLeftGPS: {
                latitude: mapDAO.bottomLeftLat,
                longitude: mapDAO.bottomLeftLong
            }
        }
    }
}

async function getMaps(): Promise<MapIDO[]> {
    const maps = await getPersistentMaps()
	return maps.map(DAOToIDO)
}

export default {
	getMaps,
};
