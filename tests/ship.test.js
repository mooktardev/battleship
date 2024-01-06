import { Ship } from "../src/Controllers.js";

describe('Ship', () => {
    const testShip = new Ship(4);

    it('New ship has length of given parameter', () => {
        expect(testShip.length).toBe(4);
    });

    it('New ship has hitCount of 0', () => {
        expect(testShip.hitCount).toBe(0);
    });

    it('Ship.hit() increments Ship.hitCount by 1', () => {
        testShip.hit();
        expect(testShip.hitCount).toBe(1);
    });

    it('Ship of length 4 is not yet sunk after 3 hits', () => {
        testShip.hit();
        testShip.hit();
        expect(testShip.isSunk()).toBe(false);

    });

    it('Ship of length 4 is sunk after 4 hits', () => {
        testShip.hit();
        expect(testShip.isSunk()).toBe(true);
    });
});