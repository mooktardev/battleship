import { Gameboard, Ship } from "../src/Controllers.js";

jest.mock("../app/ship", () => ({
    Ship: jest.fn().mockImplementation((length) => ({
        length,
        hitCount: 0,
        coordinates: [],
        hit: jest.fn(function() {
            this.hitCount++;
        }),
        isSunk: jest.fn(function() {
            return this.hitCount >= this.length;
        }),
    })),
}));

describe.only('Gameboard', () => {
    const testGameboard = new Gameboard();

    beforeEach(() => {
        testGameboard.graph.forEach(row => {
            row.forEach(node => {
                node.hasShip = false;
            });
        });

        testGameboard.ships = [];
        testGameboard.hitShots = [];
        testGameboard.missedShots = [];
    });

    // placeShip()
    it('Constructor reates a 10x10 graph', () => {
        expect(testGameboard.graph[0][0]).toEqual({ hasShip: false });
        expect(testGameboard.graph[0][9]).toEqual({ hasShip: false });
        expect(testGameboard.graph[9][0]).toEqual({ hasShip: false });
        expect(testGameboard.graph[9][9]).toEqual({ hasShip: false });
    });

    it('placeShip() calls Ship class', () => {        
        testGameboard.placeShip([[0, 0]]);
        expect(Ship).toHaveBeenCalled();
    });

    it('placeShip() fills sets corresponding nodes on graph to "hasShip: true"', () => {
        testGameboard.placeShip([[0, 0], [0, 1]]);
        expect(testGameboard.graph[0][0]).toEqual({ hasShip: true });
        expect(testGameboard.graph[0][1]).toEqual({ hasShip: true });
    });

    it('placeShip() creates a new ship in the gameboard.ships property', () => {
        testGameboard.placeShip([[0, 0], [1, 0]]);
        expect(testGameboard.ships.length).toBe(1);
    });

    it('placeShip() creates a ship of the length of its coordinates passed in', () => {
        testGameboard.placeShip([[0, 0], [0, 1], [0, 2]]);
        expect(testGameboard.ships[0].length).toBe(3); 
    });

    it('placeShip() with invalid coordinates does not create a new ship', () => {
        testGameboard.placeShip([[0, 10]]);
        expect(testGameboard.ships.length).toBe(0);
    });

    // receiveAttack()
    it('receiveAttack() increments the hitCount of a specific ship', () => {
        testGameboard.placeShip([[0, 0], [0, 1], [0, 2]]);
        testGameboard.receiveAttack([0, 0]);
        expect(testGameboard.ships[0].hitCount).toBe(1);
        testGameboard.receiveAttack([0, 1]);
        expect(testGameboard.ships[0].hitCount).toBe(2);
    });

    it('receiveAttack() pushes the coordinates of a hit node onto hitShots', () => {
        testGameboard.placeShip([[0, 0], [0, 1], [0, 2]]);
        testGameboard.receiveAttack([0, 0]);
        expect(testGameboard.hitShots).toContainEqual([0, 0]);
    });

    it('receiveAttack() pushes the coordinates an empty node onto missedShots', () => {
        testGameboard.placeShip([[0, 0], [0, 1], [0, 2]]);
        testGameboard.receiveAttack([0, 3]);
        expect(testGameboard.missedShots).toContainEqual([0, 3]);
    });

    // allShipsSunk()
    it('allShipsSunk() returns true when all ships on the gameboard are sunk', () => {
        testGameboard.placeShip([[0, 0], [0, 1]]);
        testGameboard.receiveAttack([0, 0]);
        testGameboard.receiveAttack([0, 1]);
        expect(testGameboard.allShipsSunk()).toBeTruthy();
    });

    it('allShipsSunk() returns false if a ship is not yet sunk', () => {
        testGameboard.placeShip([[0, 0], [0, 1]]);
        testGameboard.placeShip([[9, 9]]);
        testGameboard.receiveAttack([0, 0]);
        testGameboard.receiveAttack([0, 1]); // sinks the first ship
        expect(testGameboard.ships[0].isSunk()).toBeTruthy(); // true; first ship is sunk
        expect(testGameboard.allShipsSunk()).toBeFalsy(); // false; not all ships are sunk
    });

    // alreadyPlayed() 
    it('alreadyPlayed() returns false if a coordinates has not been played', () => {
        testGameboard.receiveAttack([0, 0]);
        expect(testGameboard.alreadyPlayed([0, 1])).toBeFalsy();
    });

    // getRandomCoordinates()
    it('getRandomCoordinates() returns a random coordinate pair not already played', () => {
        testGameboard.receiveAttack([0, 0]);
        testGameboard.receiveAttack([0, 1]);
        expect(testGameboard.getRandomCoordinates()).not.toEqual([0, 0]);
        expect(testGameboard.getRandomCoordinates()).not.toEqual([0, 1]);
    });
    
    // getRandomShipCoordinates() 
    it('getRandomShipCoordinates returns an array of random coordinates in one direction', () => {
        expect(testGameboard.getRandomShipCoordinates(4)).toHaveLength(4);
    });

    // getRestOfCoordinates()
    it('getRestOfCoordinates returns array of coordinates in given direction', () => {
        expect(testGameboard.getRestOfCoordinates([0, 0], 3, [0, 1])).toEqual([[0, 0], [0, 1], [0, 2]]);
    });

    // getAdjacentCoordinates
    it('getAdjacenetCoordinates returns all the adjacent coordinates of a ships coordinates', () => {
        expect(testGameboard.getAdjacentCoordinates([[5, 5], [5, 4]])).toEqual([[5, 6], [5, 3], [4, 5], [6, 5], [4, 4], [6, 4]]);
    });

    it('getAdjacentCoordinates reduces to only those coordinates in the board', () => {
        expect(testGameboard.getAdjacentCoordinates([[0, 0], [1, 0]])).not.toContainEqual([-1, 0]);
        expect(testGameboard.getAdjacentCoordinates([[9, 7], [9, 8], [9, 9]])).not.toContainEqual([9, 10]);
    });
});