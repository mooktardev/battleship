import { Player, Gameboard } from "../src/Controllers.js";

describe('Player', () => {
    const playerOne = new Player();

    it('Player constructor creates a new gameboard', () => {
        expect(playerOne.gameboard).toHaveProperty('graph');
        expect(playerOne.gameboard).toHaveProperty('ships');
    });

    it('attack() attacks an enemy gameboard', () => {
        const enemyGameboard = new Gameboard();
        playerOne.attack([0, 0], enemyGameboard);
        expect(enemyGameboard.missedShots).toContainEqual([0, 0]);
    });
});