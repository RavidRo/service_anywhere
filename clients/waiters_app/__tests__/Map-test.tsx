import Location from '../src/data/Location';
import Map from '../src/data/Map';

describe('Translate GPS', () => {
    it('Basic map translation', () => {
        const pool = new Map(
            'www.google.org',
            {
                bottomLeftGPS: new Location(0, 0),
                bottomRightGPS: new Location(1, 0),
                topLeftGPS: new Location(0, 1),
                topRightGPS: new Location(1, 1),
            },
            [],
        );
        const result = pool.translateGps(new Location(0.5, 0.5));
        expect(result).toEqual(new Location(0.5, 0.5));
    });

    it('Advance map translation', () => {
        const pool = new Map(
            'www.google.org',
            {
                bottomLeftGPS: new Location(0, 0),
                bottomRightGPS: new Location(2, 0),
                topLeftGPS: new Location(0, 2),
                topRightGPS: new Location(2, 2),
            },
            [],
        );
        const result = pool.translateGps(new Location(1, 1));
        expect(result).toEqual(new Location(0.5, 0.5));
    });

    it('Advance point translation', () => {
        const pool = new Map(
            'www.google.org',
            {
                bottomLeftGPS: new Location(0, 0),
                bottomRightGPS: new Location(2, 0),
                topLeftGPS: new Location(0, 2),
                topRightGPS: new Location(2, 2),
            },
            [],
        );
        const result = pool.translateGps(new Location(0.4, 0.1));
        expect(result).toEqual(new Location(0.2, 0.95));
    });
});
