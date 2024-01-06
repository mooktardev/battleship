import { Game } from "../src/Controllers.js";

describe('Game', () => {
    // start()
    it('start() creates randomShipCoordinates on the computer gameboard', () => {
        const testGame = new Game();
        testGame.start();
        expect(testGame.computer.gameboard.ships.length).toBe(6);
    });

    // playRound()
    it('playRound() attacks both gameboards', () => {
        const testGame = new Game();
        testGame.playRound([0, 0]);
        expect(testGame.computer.gameboard.missedShots).toContainEqual([0, 0]);
        expect(testGame.player.gameboard.missedShots.length || testGame.player.gameboard.hitShots.length).toBe(1);
    });

    // hasEnded()
    it('hasEnded() returns false if both gameboards still have ships', () => {
        const testGame = new Game();
        testGame.start();
        testGame.player.gameboard.placeShip([[0, 0], [0, 1]]);
        expect(testGame.hasEnded()).toBeFalsy();
    });

    it('hasEnded() returns true if one gameboard does not have ships', () => {
        const testGame = new Game();
        testGame.start();
        testGame.player.gameboard.placeShip([[0, 0], [0, 1]]);
        testGame.player.gameboard.receiveAttack([0, 0]);
        testGame.player.gameboard.receiveAttack([0, 1]);
        expect(testGame.hasEnded()).toBeTruthy();
    });

    // getGameResult() 
    it('getGameResult() returns a string announcing the winner of the game', () => {
        const testGame = new Game();
        testGame.start();
        testGame.player.gameboard.placeShip([[0, 0], [0, 1]]);
        testGame.player.gameboard.receiveAttack([0, 0]);
        testGame.player.gameboard.receiveAttack([0, 1]);
        expect(testGame.getGameResult()).toBe('Better luck next time. Your enemy wins this game.');
    });
});