const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
const playersDictionary = {};
playersDictionary[CROSS] = 'Cross';
playersDictionary[ZERO] = 'Zero';

let crossCount = 0;
let zeroCount = 0;
let isOver = false;

const container = document.getElementById('fieldWrapper');

let field = [[EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY]]

startGame();
addResetListener();

function startGame() {
    renderGrid(3);
}

function renderGrid(dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function cellClickHandler(row, col) {
    console.log(`Clicked on cell: ${row}, ${col}`);

    if (field[row][col] === EMPTY && !isOver) {
        if (crossCount <= zeroCount) {
            renderSymbolInCell(CROSS, row, col);
            field[row][col] = CROSS;
            crossCount++;
        } else {
            renderSymbolInCell(ZERO, row, col);
            field[row][col] = ZERO;
            zeroCount++;
        }
        if (crossCount + zeroCount === 9) {
            alert('Победила дружба');
            return;
        }
        let winner = tryFindWinner();
        console.log(winner);
        if (winner) {
            for (let i = 0; i < winner[1].length; i++) {
                let coordinates = winner[1][i];
                renderSymbolInCell(winner[0], coordinates[0], coordinates[1], '#FF0000');
            }

            alert(`Winner is ${playersDictionary[winner[0]]}`);
        }
    }

    /* Пользоваться методом для размещения символа в клетке так:
        renderSymbolInCell(ZERO, row, col);
     */
}

function renderSymbolInCell(symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell(row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener() {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler() {
    isOver = false;
    crossCount = 0;
    zeroCount = 0;
    field = [[EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY]]
    renderGrid(3);
}

// function tryFindWinner() {
//     const winCombinations = [
//         // Ряды
//         [[0, 0], [0, 1], [0, 2]],
//         [[1, 0], [1, 1], [1, 2]],
//         [[2, 0], [2, 1], [2, 2]],
//         // Столбцы
//         [[0, 0], [1, 0], [2, 0]],
//         [[0, 1], [1, 1], [2, 1]],
//         [[0, 2], [1, 2], [2, 2]],
//         // Диагонали
//         [[0, 0], [1, 1], [2, 2]],
//         [[0, 2], [1, 1], [2, 0]]
//     ];
//
//     for (let combination of winCombinations) {
//         const [[x1, y1], [x2, y2], [x3, y3]] = combination;
//         const cell = field[x1][y1];
//         if (cell !== EMPTY && cell === field[x2][y2] && cell === field[x3][y3]) {
//             isOver = true;
//             return [cell, combination];
//         }
//     }
//     return false;
// }

function tryFindWinner() {
    const n = field.length;
    if (n === 0) return false;

    // Проверка строк
    for (let i = 0; i < n; i++) {
        const first = field[i][0];
        if (first === EMPTY) continue;
        let win = true;
        for (let j = 1; j < field[i].length; j++) {
            if (field[i][j] !== first) {
                win = false;
                break;
            }
        }
        if (win) {
            const combination = [];
            for (let j = 0; j < field[i].length; j++) {
                combination.push([i, j]);
            }
            isOver = true;
            return [first, combination];
        }
    }

    // Проверка столбцов
    for (let j = 0; j < n; j++) {
        const first = field[0][j];
        if (first === EMPTY) continue;
        let win = true;
        for (let i = 1; i < n; i++) {
            if (field[i][j] !== first) {
                win = false;
                break;
            }
        }
        if (win) {
            const combination = [];
            for (let i = 0; i < n; i++) {
                combination.push([i, j]);
            }
            isOver = true;
            return [first, combination];
        }
    }

    // Проверка главной диагонали
    let first = field[0][0];
    if (first !== EMPTY) {
        let win = true;
        for (let i = 1; i < n; i++) {
            if (field[i][i] !== first) {
                win = false;
                break;
            }
        }
        if (win) {
            const combination = [];
            for (let i = 0; i < n; i++) {
                combination.push([i, i]);
            }
            isOver = true;
            return [first, combination];
        }
    }

    first = field[0][n - 1];
    if (first !== EMPTY) {
        let win = true;
        for (let i = 1; i < n; i++) {
            if (field[i][n - 1 - i] !== first) {
                win = false;
                break;
            }
        }
        if (win) {
            const combination = [];
            for (let i = 0; i < n; i++) {
                combination.push([i, n - 1 - i]);
            }
            return [first, combination];
        }
    }

    // Если победителя не найдено
    return false;
}


/* Test Function */

/* Победа первого игрока */
function testWin() {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw() {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell(row, col) {
    findCell(row, col).click();
}
