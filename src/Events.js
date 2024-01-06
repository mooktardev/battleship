import { DOMController } from "./Controllers.js";

export const eventHandlers = {
    moveMouseToDragShip: function(e) {
        const ship = document.querySelector('.game-setup__ship-container');
        ship.style.left = e.pageX - 16 + 'px';
        ship.style.top = e.pageY - 16 + 'px';
    },
    
    clickToRotateShip: function() {
        const shipContainer = document.querySelector('.game-setup__ship-container');
        if (shipContainer.offsetWidth > 32) {
            shipContainer.style.height = shipContainer.offsetWidth + 'px';
            shipContainer.style.width = '32px';
        } else {
            shipContainer.style.width = shipContainer.offsetHeight + 'px';
            shipContainer.style.height = '32px';
        }
    },

    clickToPlaceShip: function(e) {
        DOMController.displayManualPlacedShipOnBoard(e.target);
        DOMController.displayNextShipContainerOrInitGamePlay();
    },

    clickToPlaceRandomShip: function() {
        DOMController.displayRandomPlacedShipOnBoard();
        DOMController.displayNextShipContainerOrInitGamePlay();
    },
 
    clickToAttackEnemy: function(e) {
        DOMController.displayGamePlayRound(e.target);
    },

    clickToPlayAgain: function() {
        DOMController.initGameSetup();
    }
};

export const eventListeners = {
    initGameSetupEvents: function() {
        const gameSetupContainer = document.querySelector('.game-setup-container');
        gameSetupContainer.addEventListener('mousemove', eventHandlers.moveMouseToDragShip);

        const rotateBtn = document.getElementById('rotate-btn');
        rotateBtn.addEventListener('click', eventHandlers.clickToRotateShip);

        const randomBtn = document.getElementById('random-btn');
        randomBtn.addEventListener('click', eventHandlers.clickToPlaceRandomShip);

        const playerGridItems = [...document.querySelectorAll('.grid-item')];
        playerGridItems.forEach(gridItem => {
            gridItem.addEventListener('click', eventHandlers.clickToPlaceShip);
        });
    },

    initGamePlayEvents: function() {
        const enemyGridItems = [...document.querySelectorAll('.grid')[1].children];
        enemyGridItems.forEach(gridItem => {
            gridItem.addEventListener('click', eventHandlers.clickToAttackEnemy);
        });
    },

    initGameOverEvents: function() {
        const playAgainBtn = document.getElementById('play-again-btn');
        playAgainBtn.addEventListener('click', eventHandlers.clickToPlayAgain);
    },
};
