const cellElements = document.querySelectorAll('[data-cell]');
const board = document.querySelector('.game-board');
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const restartButton = document.getElementById('restartButton');

const JEEPAO_CLASS = 'jeepao';
const ARRIERO_CLASS = 'arriero';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let arrieroTurn;

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
    arrieroTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(JEEPAO_CLASS);
        cell.classList.remove(ARRIERO_CLASS);
        cell.classList.remove('win-line');
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    winningMessageElement.style.display = 'none';
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = arrieroTurn ? ARRIERO_CLASS : JEEPAO_CLASS;
    placeMark(cell, currentClass);
    const winningCombination = checkWin(currentClass);
    if (winningCombination) {
        endGame(false, winningCombination);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
    }
}

function endGame(draw, winningCombination = null) {
    if (draw) {
        winningMessageTextElement.innerText = '¡Empate!';
    } else {
        winningMessageTextElement.innerText = `${arrieroTurn ? "Arriero Cafetero" : "Jeepao"} Gana!`;
        if (winningCombination) {
            winningCombination.forEach(index => {
                cellElements[index].classList.add('win-line');
            });
        }
    }
    winningMessageElement.style.display = 'flex';
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(JEEPAO_CLASS) || cell.classList.contains(ARRIERO_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    arrieroTurn = !arrieroTurn;
}

function setBoardHoverClass() {
    board.classList.remove(JEEPAO_CLASS);
    board.classList.remove(ARRIERO_CLASS);
    if (arrieroTurn) {
        board.classList.add(ARRIERO_CLASS);
    } else {
        board.classList.add(JEEPAO_CLASS);
    }
}

function checkWin(currentClass) {
    let winningCombination = null;
    const isWin = WINNING_COMBINATIONS.some(combination => {
        const hasWon = combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
        if (hasWon) {
            winningCombination = combination;
        }
        return hasWon;
    });
    return isWin ? winningCombination : null;
}
