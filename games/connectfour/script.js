const grid = document.getElementById('grid');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');

let currentPlayer = 'player1';
let board = Array(6).fill(null).map(() => Array(7).fill(null));
let gameActive = true;

createGrid();

grid.addEventListener('click', handleCellClick);
resetButton.addEventListener('click', resetGame);

function createGrid() {
    grid.innerHTML = '';
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 7; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.column = col;
            grid.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    if (!gameActive || currentPlayer === 'player2') return;

    const column = parseInt(event.target.getAttribute('data-column'));

    if (column >= 0) {
        const row = getAvailableRow(column);

        if (row !== null) {
            placeDisc(row, column);
            if (checkWin(row, column)) {
                message.textContent = `Player 1 wins!`;
                gameActive = false;
            } else if (board.every(row => row.every(cell => cell !== null))) {
                message.textContent = "It's a draw!";
                gameActive = false;
            } else {
                switchPlayer();
                setTimeout(computerMove, 300); // Faster decision-making
            }
        }
    }
}

function getAvailableRow(column) {
    for (let row = board.length - 1; row >= 0; row--) {
        if (board[row][column] === null) {
            return row;
        }
    }
    return null;
}

function placeDisc(row, column) {
    board[row][column] = currentPlayer;
    const cell = document.querySelector(`.cell[data-row='${row}'][data-column='${column}']`);
    cell.classList.add(currentPlayer, 'disc');
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
    message.textContent = `Player ${currentPlayer === 'player1' ? '1' : '2'}'s turn`;
}

function checkWin(row, column) {
    return checkDirection(row, column, 1, 0) || // Horizontal
           checkDirection(row, column, 0, 1) || // Vertical
           checkDirection(row, column, 1, 1) || // Diagonal /
           checkDirection(row, column, 1, -1);  // Diagonal \
}

function checkDirection(row, column, rowDir, colDir) {
    let count = 1;

    for (let i = 1; i <= 3; i++) {
        const r = row + i * rowDir;
        const c = column + i * colDir;
        if (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === currentPlayer) {
            count++;
        } else {
            break;
        }
    }

    for (let i = 1; i <= 3; i++) {
        const r = row - i * rowDir;
        const c = column - i * colDir;
        if (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === currentPlayer) {
            count++;
        } else {
            break;
        }
    }

    return count >= 4;
}

function resetGame() {
    board = Array(6).fill(null).map(() => Array(7).fill(null));
    gameActive = true;
    currentPlayer = 'player1';
    message.textContent = `Player 1's turn`;
    createGrid();
}

function computerMove() {
    const bestMove = findBestMove();
    if (bestMove !== null) {
        const [row, column] = bestMove;
        placeDisc(row, column);
        if (checkWin(row, column)) {
            message.textContent = `Player 2 wins!`;
            gameActive = false;
        } else if (board.every(row => row.every(cell => cell !== null))) {
            message.textContent = "It's a draw!";
            gameActive = false;
        } else {
            switchPlayer();
        }
    }
}

function findBestMove() {
    let bestVal = -Infinity;
    let bestMove = null;

    // Prioritize center columns
    const columnOrder = [3, 2, 4, 1, 5, 0, 6];

    for (let col of columnOrder) {
        const row = getAvailableRow(col);
        if (row !== null) {
            board[row][col] = 'player2';
            let moveVal = minimax(board, 0, false, -Infinity, Infinity, 5); // Limit depth to 5
            board[row][col] = null;

            if (moveVal > bestVal) {
                bestMove = [row, col];
                bestVal = moveVal;
            }
        }
    }
    return bestMove;
}

function minimax(newBoard, depth, isMaximizing, alpha, beta, maxDepth) {
    if (checkWinState('player2')) return 100 - depth;
    if (checkWinState('player1')) return depth - 100;
    if (newBoard.every(row => row.every(cell => cell !== null))) return 0;
    if (depth >= maxDepth) return 0; // Stop searching deeper

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let col = 0; col < 7; col++) {
            const row = getAvailableRow(col);
            if (row !== null) {
                newBoard[row][col] = 'player2';
                let eval = minimax(newBoard, depth + 1, false, alpha, beta, maxDepth);
                newBoard[row][col] = null;
                maxEval = Math.max(maxEval, eval);
                alpha = Math.max(alpha, eval);
                if (beta <= alpha) break;
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let col = 0; col < 7; col++) {
            const row = getAvailableRow(col);
            if (row !== null) {
                newBoard[row][col] = 'player1';
                let eval = minimax(newBoard, depth + 1, true, alpha, beta, maxDepth);
                newBoard[row][col] = null;
                minEval = Math.min(minEval, eval);
                beta = Math.min(beta, eval);
                if (beta <= alpha) break;
            }
        }
        return minEval;
    }
}

function checkWinState(player) {
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 7; col++) {
            if (board[row][col] === player &&
                (checkDirection(row, col, 1, 0) || // Horizontal
                 checkDirection(row, col, 0, 1) || // Vertical
                 checkDirection(row, col, 1, 1) || // Diagonal /
                 checkDirection(row, col, 1, -1))) { // Diagonal \
                return true;
            }
        }
    }
    return false;
}
