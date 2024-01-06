import { createGameOverContainer, createGamePlayContainer, createGameSetupContainer } from "./Components";
import { eventListeners } from "./Events";

export class Player {
    constructor(name) {
        this.name = name;
        this.gameboard = new Gameboard();
    }

    attack([x, y], gameboard) {
        gameboard.receiveAttack([x, y]);
    }
}

export class Ship {
    constructor(length) {
        this.length = length;
        this.hitCount = 0;
        this.coordinates = [];
    }

    hit() {
        this.hitCount++;
    }

    isSunk() {
        return this.hitCount >= this.length;
    }
}

export class Gameboard {
    constructor() {
        this.graph = this._createGraph();
        this.ships = [];
        this.shipLengths = [5, 4, 3, 2, 1];
        this.missedShots = [];
        this.hitShots = [];
    }

    placeShip(coordinates) {
        if (this._arePlaceable(coordinates)) {
            const newShip = new Ship(coordinates.length);

            coordinates.forEach(([x, y]) => {
                const node = this.graph[x][y];
                node.hasShip = true;
                newShip.coordinates.push([x, y]);
            });

            this.ships.push(newShip);
        }  
    }

    receiveAttack([x, y]) {
        const node = this.graph[x][y];

        if (node.hasShip) {
            const targetShip = this._getShipFromCoordinates([x, y]);
            targetShip.hit();
            this.hitShots.push([x, y]);
        } else {
            this.missedShots.push([x, y]);
        }
    }

    allShipsSunk() {
        return this.ships.every(ship => ship.isSunk());       
    }

    alreadyPlayed([x, y]) {
        return this._areCoordinatesInArray([x, y], this.missedShots) || this._areCoordinatesInArray([x, y], this.hitShots);
    }

    getRandomCoordinates() {
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);
        if (this.alreadyPlayed([x, y])) {
            return this.getRandomCoordinates();
        } else {
            return [x, y];
        }
    }

    getRandomShipCoordinates(length) {
        const directions = [[1, 0], [0, -1]];
        const allCoordinates = this.getRestOfCoordinates(this.getRandomCoordinates(), length, directions[Math.floor(Math.random() * 2)]);

        if (!this._arePlaceable(allCoordinates)) {
            return this.getRandomShipCoordinates(length);
        } else {
            return allCoordinates;
        };
    }

    getRestOfCoordinates(start, shipLength, direction) {
        let allCoordinates = [start];

        while (allCoordinates.length < shipLength) {
            const temp = allCoordinates[allCoordinates.length - 1];
            const newItem = [temp[0] + direction[0], temp[1] + direction[1]];
            allCoordinates.push(newItem);
        }

        return allCoordinates;
    }

    getAdjacentCoordinates(coordinates) {
        const start = coordinates[0];
        const end = coordinates[coordinates.length - 1];
        
        let adjacentCoordinates = [];
        let offsets = [[[-1, 0], [1, 0]], [[0, 1], [0, -1]]];
        let offsetEnds = [];
        let offsetSides = [];

        if (start[1] === end[1]) {
            offsetEnds = offsets[0];
            offsetSides = offsets[1];
        } else {
            offsetEnds = offsets[1];
            offsetSides = offsets[0];
        }

        const before = [start[0] + offsetEnds[0][0], start[1] + offsetEnds[0][1]];
        const after = [end[0] + offsetEnds[1][0], end[1] + offsetEnds[1][1]];
        adjacentCoordinates.push(before, after);

        coordinates.forEach(([x, y]) => {
            const sides = [[x + offsetSides[0][0], y + offsetSides[0][1]], [x + offsetSides[1][0], y + offsetSides[1][1]]];
            adjacentCoordinates.push(...sides);
        });  
        
        adjacentCoordinates = adjacentCoordinates.filter(([x, y]) => this._isInBounds([x, y]));
        return adjacentCoordinates;
    }

    _createGraph() {
        const graph = [];
        for (let i = 0; i < 10; i++) {
            const row = [];
            for (let j = 0; j < 10; j++) {
                const node = { hasShip: false };
                row.push(node);
            }
            graph.push(row);
        }
        return graph;
    }

    _areCoordinatesInArray([x, y], array) {
        return array.some(([a, b]) => [a, b].every((value, index) => 
            value === [x, y][index]
        ));
    }

    _arePlaceable(coordinates) {
        if (coordinates.length === 0) return false;

        return coordinates.every(([x, y]) => {
            return this._isInBounds([x, y]) && !this.graph[x][y].hasShip;
        }) && this.getAdjacentCoordinates(coordinates).every(([x, y]) => !this.graph[x][y].hasShip);
    }

    _isInBounds([x, y]) {
        return (x >= 0 && x < 10) && (y >= 0 && y < 10); 
    }

    _getShipFromCoordinates([x, y]) {
        return this.ships.find(ship => 
            this._areCoordinatesInArray([x, y], ship.coordinates)
        );
    }
}

export class Game {
    constructor() {
        this.player = new Player('Player');
        this.computer = new Player('Computer');
    }

    start() {
        const computerGameboard = this.computer.gameboard;
        computerGameboard.shipLengths.forEach(length => {
            computerGameboard.placeShip(computerGameboard.getRandomShipCoordinates(length));
        });
    }

    playRound([x, y]) {
        if (!this.computer.gameboard.alreadyPlayed([x, y])) {  
            this._playerMove([x, y]);
            this._computerMove();    
            if (this.hasEnded()) {
                console.log(this.getGameResult());
            }
        }
    }

    hasEnded() {
        return this.player.gameboard.allShipsSunk() || this.computer.gameboard.allShipsSunk();
    }

    getGameResult() {
        return this._getWinnerName() === 'Computer' ? 'Computer' : 'You';
    }

    _getWinnerName() {
        return this.player.gameboard.allShipsSunk() ? this.computer.name : this.player.name;
    }

    _playerMove([x, y]) {
        this.player.attack([x, y], this.computer.gameboard);
    }

    _computerMove([x, y] = this.player.gameboard.getRandomCoordinates()) {
        this.computer.attack([x, y], this.player.gameboard);
    }
}

export const DOMController = {
    initGameSetup: function() {
        this.game = new Game();
        this._updatePageContent(createGameSetupContainer());
        this.displayNextShipContainerOrInitGamePlay();
        eventListeners.initGameSetupEvents();
    },

    initGamePlay: function() {
        this.game.start();
        this._updatePageContent(createGamePlayContainer());
        this._updateBoards();
        this._displayGridTitles();
        eventListeners.initGamePlayEvents();
    },

    initGameOver: function() {
        createGameOverContainer(this.game.getGameResult())
    },

    displayGamePlayRound: function(gridItem) {
        const [x, y] = this._getCoordinatesOfGridItem(gridItem);
        this.game.playRound([x, y]);
        this._updateBoards();
        if (this.game.hasEnded()) this.initGameOver();
    },

    displayManualPlacedShipOnBoard: function(gridItem) {
        const [x, y] = this._getCoordinatesOfGridItem(gridItem);
        const shipContainer = document.querySelector('.game-setup__ship-container');
        const playerGameboard = this.game.player.gameboard;

        let shipLength = 0;
        let allCoordinates = [];
        let direction = [];

        if (shipContainer.offsetWidth !== 32) { // horizontal placement
            shipLength = shipContainer.offsetWidth / 32;
            direction = [1, 0];    
        } else { // vertical placement    
            shipLength = shipContainer.offsetHeight / 32;
            direction = [0, -1];
        }

        allCoordinates = playerGameboard.getRestOfCoordinates([x, y], shipLength, direction);
        playerGameboard.placeShip(allCoordinates);
        this._updateBoards();
    },

    displayRandomPlacedShipOnBoard: function() {
        const playerGameboard = this.game.player.gameboard;
        playerGameboard.placeShip(playerGameboard.getRandomShipCoordinates(this._moveToNextShipLength()));
        this._updateBoards();
    },

    displayNextShipContainerOrInitGamePlay: function() {
        const shipLength = this._moveToNextShipLength();
        if (shipLength === 0) {
            this.initGamePlay();
        } else {
            this._displayShipSetupContainer(shipLength);
        }
    },

    _displayShipSetupContainer: function(shipLength) {   
        const shipContainer = document.querySelector('.game-setup__ship-container');
        shipContainer.style.width = shipLength * 32 + 'px';
        shipContainer.style.height = '32px';
    },
    
    _moveToNextShipLength: function() {
        const shipLengths = this.game.player.gameboard.shipLengths;
        const alreadyPlacedShips = this.game.player.gameboard.ships;
        if (alreadyPlacedShips.length < shipLengths.length) {
            return shipLengths[alreadyPlacedShips.length];
        } else {
            return 0;
        }
    },

    _updatePageContent: function(newContentFunc) {
        const contentSection = document.querySelector('.content-section');
        contentSection.innerHTML = '';
        contentSection.appendChild(newContentFunc);  
    },

    _updateBoards: function() {
        const grids = document.querySelectorAll('.grid');
        const gameboards = grids.length > 1 ? [this.game.player.gameboard, this.game.computer.gameboard] : [this.game.player.gameboard];

        gameboards[0].ships.forEach(ship => {
            ship.coordinates.forEach(([x, y]) => {
                const gridItem = this._getGridItemFromCoordinates([x, y], grids[0]);
                gridItem.classList.add('grid-item__ship');
            });
        });

        for (let i = 0; i < grids.length; i++) {
            gameboards[i].hitShots.forEach(([x, y]) => {
                const gridItem = this._getGridItemFromCoordinates([x, y], grids[i]);
                if (!gridItem.classList.contains('grid-item__hit')) {
                    gridItem.classList.add('grid-item__hit');
                }
            });

            gameboards[i].missedShots.forEach(([x, y]) => {
                const gridItem = this._getGridItemFromCoordinates([x, y], grids[i]);
                if (!gridItem.classList.contains('grid-item__miss')) {
                    gridItem.classList.add('grid-item__miss');
                }
            });
        }
    },

    _displayGridTitles: function() {
        const titles = document.querySelectorAll('.grid-container__title');
        titles[0].textContent = 'You';
        titles[1].textContent = 'Computer';
    },

    _getCoordinatesOfGridItem(gridItem) {
        const allGridItems = [...gridItem.parentElement.children]; 
        const gridItemIndex = allGridItems.indexOf(gridItem);
    
        let numberOfSquaresBefore = allGridItems.slice(0, gridItemIndex).length;
        let iterations = 0;
    
        while (numberOfSquaresBefore >= 10) {
            numberOfSquaresBefore -= 10;
            iterations++;
        }
    
        const x = numberOfSquaresBefore;
        const y = 9 - iterations;
    
        return [x, y];
    },

    _getGridItemFromCoordinates([x, y], grid) {
        const allGridItems = [...grid.querySelectorAll('.grid-item')];
        const numberOfSquaresBefore = x + ((9 - y) * 10);
        
        const targetGridItem = allGridItems.find(gridItem => allGridItems.indexOf(gridItem) === numberOfSquaresBefore);
    
        return targetGridItem;
    }
};