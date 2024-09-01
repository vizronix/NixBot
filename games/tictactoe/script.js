const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[clickedIndex] !== '' || !gameActive || currentPlayer !== 'X') {
        return;
    }

    playMove(clickedIndex, currentPlayer);
    if (gameActive) {
        setTimeout(computerMove, 500); // Delay the computer's move for a better experience
    }
}

function playMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;

    if (checkWin()) {
        message.textContent = `Player ${player} wins!`;
        gameActive = false;
    } else if (board.every(cell => cell !== '')) {
        message.textContent = "It's a draw!";
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        message.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function checkWin() {
    return winningConditions.some(condition => {
        return condition.every(index => {
            return board[index] === currentPlayer;
        });
    });
}

function computerMove() {
    let bestMove = findBestMove();
    if (bestMove !== null) {
        playMove(bestMove, 'O');
    }
}

function findBestMove() {
    let bestVal = -Infinity;
    let bestMove = null;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let moveVal = minimax(board, 0, false);
            board[i] = '';

            if (moveVal > bestVal) {
                bestMove = i;
                bestVal = moveVal;
            }
        }
    }
    return bestMove;
}

function minimax(newBoard, depth, isMaximizing) {
    let score = evaluate(newBoard);

    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (newBoard.every(cell => cell !== '')) return 0;

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === '') {
                newBoard[i] = 'O';
                best = Math.max(best, minimax(newBoard, depth + 1, false));
                newBoard[i] = '';
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === '') {
                newBoard[i] = 'X';
                best = Math.min(best, minimax(newBoard, depth + 1, true));
                newBoard[i] = '';
            }
        }
        return best;
    }
}

function evaluate(b) {
    for (let condition of winningConditions) {
        const [a, b1, c] = condition;

        if (b[a] === b[b1] && b[b1] === b[c]) {
            if (b[a] === 'O') return 10;
            else if (b[a] === 'X') return -10;
        }
    }
    return 0;
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    message.textContent = `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = '');
}
