/**
 * @format
 */

import Location from '../src/data/Location';

describe('Location.add', () => {
    it('Added correctly with equal values', () => {
        const location = new Location(0, 0);
        expect(location.add(2, 2)).toEqual(new Location(2, 2));
    });

    it('Add with different values', () => {
        const location = new Location(19, -24);
        expect(location.add(2, 5)).toEqual(new Location(21, -19));
    });

    it('Add with negative values', () => {
        const location = new Location(19, -24);
        expect(location.add(-2, -5)).toEqual(new Location(17, -29));
    });
});

describe('Location.subtract', () => {
    it('Subtracted correctly with equal values', () => {
        const location1 = new Location(2, 5);
        const location2 = new Location(2, 2);
        expect(location1.subtract(location2)).toEqual(new Location(0, 3));
    });

    it('Subtracted correctly with different values', () => {
        const location1 = new Location(19, -24);
        const location2 = new Location(2, 6);
        expect(location1.subtract(location2)).toEqual(new Location(17, -30));
    });

    it('Subtracted correctly with negative values', () => {
        const location1 = new Location(19, -24);
        const location2 = new Location(-2, -6);
        expect(location1.subtract(location2)).toEqual(new Location(21, -18));
    });
});
