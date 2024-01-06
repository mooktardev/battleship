import Swal from "sweetalert2";
import { DOMController } from "./Controllers";
import Logo from './images/logo.png'

export const createMainContainer = () => {
    const mainContainer = document.createElement('div');
    mainContainer.className = 'main-container';

    const nav = document.createElement('nav');
    nav.className = 'nav';

    const logoImage = document.createElement('img')
    logoImage.className = 'nav__game-logo'
    logoImage.src = Logo

    const gameTitle = document.createElement('h1');
    gameTitle.className = 'nav__game-title';
    gameTitle.textContent = 'Battleship';

    nav.append(logoImage, gameTitle)

    const contentSection = document.createElement('section');
    contentSection.className = 'content-section';

    const contentFooter = document.createElement('footer')
    contentFooter.className = 'footer'

    const contentFooterText = contentFooter.appendChild(document.createElement('p'))
    contentFooterText.className = 'content-footer__text'
    contentFooterText.innerHTML = `&copy; ${new Date().getFullYear()} - Created with 💗 by Mooktar`

    mainContainer.appendChild(nav);
    mainContainer.appendChild(contentSection);
    mainContainer.appendChild(contentFooter);

    return mainContainer;
};

export const createGrid = () => {
    const grid = document.createElement('div');
    grid.className = 'grid';

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const gridItem = grid.appendChild(document.createElement('div'));
            gridItem.className = 'grid-item';
        }
    }

    return grid;
}

export const createGameOverContainer = (winner) => {
    const title = winner === "You" ? "Good job!" : "Oops..."
    const text = winner === "You" ? "You're the winner!" : "The Computer is the winner!"
    const icon = winner === "You" ? "success" : "warning"
    console.log(title, text, icon)
    
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: 'Play Again',
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then(result => {
        if (result.isConfirmed) {
            DOMController.initGameSetup()
        }
    });
}

export const createGamePlayContainer = () => {
    const gamePlayContainer = document.createElement('div');
    gamePlayContainer.className = 'game-play-container';

    const createGridContainer = () => {
        const gridContainer = document.createElement('div');
        gridContainer.className = 'grid-container';

        const gridTitle = document.createElement('h3');
        gridTitle.className = 'grid-container__title';
            
        const createAxis = (type) => {
            const axis = document.createElement('div');
            axis.className = `grid-container__${type}-axis-container`;

            let array = [];
            if (type === 'x') {
                array = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
            } else {
                array = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
            }

            array.forEach(item => {
                const axisItem = axis.appendChild(document.createElement('div'));
                axisItem.className = 'grid-container__axis-item';
                axisItem.textContent = item;
            });
            
            return axis;
        };

        gridContainer.appendChild(gridTitle);
        gridContainer.appendChild(createAxis('x'));
        gridContainer.appendChild(createAxis('y'));
        gridContainer.appendChild(createGrid());

        return gridContainer;
    };

    gamePlayContainer.appendChild(createGridContainer());
    gamePlayContainer.appendChild(createGridContainer());

    return gamePlayContainer;
};


export const createGameSetupContainer = () => {
    const gameSetupContainer = document.createElement('div');
    gameSetupContainer.className = 'game-setup-container';

    const createWelcomeContainer = () => {
        const welcomeContainer = document.createElement('div');
        welcomeContainer.className = 'game-setup__welcome-container';

        const placeShipsText = welcomeContainer.appendChild(document.createElement('p'));
        placeShipsText.className = 'game-setup__place-ships-text';
        placeShipsText.textContent = 'Place your ships on the board';

        const btnContainer = welcomeContainer.appendChild(document.createElement('div'));
        btnContainer.className = 'game-setup__btn-container';
        
            const rotateBtn = btnContainer.appendChild(document.createElement('button'));
            rotateBtn.id = 'rotate-btn';
            rotateBtn.textContent = 'Rotate';
            
            const randomBtn = btnContainer.appendChild(document.createElement('button'));
            randomBtn.id = 'random-btn';
            randomBtn.textContent = 'Random';

        return welcomeContainer;
    };

    gameSetupContainer.appendChild(createWelcomeContainer());

    const gameSetupShipGridContainer = gameSetupContainer.appendChild(document.createElement('div'))
    gameSetupShipGridContainer.className = 'game-setup__ship-grid-container'

    const shipContainer = gameSetupShipGridContainer.appendChild(document.createElement('div'));
    shipContainer.className = 'game-setup__ship-container';

    gameSetupShipGridContainer.appendChild(createGrid());
    
    return gameSetupContainer;
};