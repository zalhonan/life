const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');
const playButton = document.getElementById('playButton');
const stopButton = document.getElementById('stopButton');
const random30Button = document.getElementById('random30Button');
const random10Button = document.getElementById('random10Button');
const randomShapesButton = document.getElementById('randomShapesButton');
const clearButton = document.getElementById('clearButton');
const liveCounter = document.getElementById('liveCounter');

let rows, cols, cellSize;
let board = createEmptyBoard();
let intervalId;
let isDrawing = false;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cellSize = 10;
    rows = Math.floor(canvas.height / cellSize);
    cols = Math.floor(canvas.width / cellSize);
    board = createEmptyBoard();
    drawBoard();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createEmptyBoard() {
    const board = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push(0);
        }
        board.push(row);
    }
    return board;
}

function createRandomBoard(probability) {
    const board = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push(Math.random() < probability ? 1 : 0);
        }
        board.push(row);
    }
    return board;
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let liveCells = 0;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (board[i][j]) {
                liveCells++;
                ctx.fillStyle = 'green';
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(j * cellSize + cellSize / 2, i * cellSize + cellSize / 2, cellSize / 2 - 1, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
        }
    }
    liveCounter.textContent = `Live Cells: ${liveCells}`;
}

function getNextGeneration(board) {
    const newBoard = board.map(arr => [...arr]);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const neighbors = countNeighbors(board, i, j);
            if (board[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
                newBoard[i][j] = 0;
            } else if (board[i][j] === 0 && neighbors === 3) {
                newBoard[i][j] = 1;
            }
        }
    }
    return newBoard;
}

function countNeighbors(board, x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const ni = x + i;
            const nj = y + j;
            if (ni >= 0 && ni < rows && nj >= 0 && nj < cols) {
                count += board[ni][nj];
            }
        }
    }
    return count;
}

function play() {
    intervalId = setInterval(() => {
        board = getNextGeneration(board);
        drawBoard();
    }, 500);
}

function stop() {
    clearInterval(intervalId);
}

function randomizeBoard(probability) {
    board = createRandomBoard(probability);
    drawBoard();
}

function randomizeShapes() {
    const maxArea = Math.floor(rows * cols * 0.4);
    let currentArea = 0;

    while (currentArea < maxArea) {
        const shapeType = Math.floor(Math.random() * 4);
        const size = Math.floor(Math.random() * 12) + 4;
        const startX = Math.floor(Math.random() * (cols - size));
        const startY = Math.floor(Math.random() * (rows - size));

        switch (shapeType) {
            case 0: // Rectangle
                for (let i = startY; i < startY + size; i++) {
                    for (let j = startX; j < startX + size; j++) {
                        if (i < rows && j < cols) {
                            board[i][j] = 1;
                        }
                    }
                }
                currentArea += size * size;
                break;
            case 1: // Square
                for (let i = startY; i < startY + size; i++) {
                    for (let j = startX; j < startX + size; j++) {
                        if (i < rows && j < cols) {
                            board[i][j] = 1;
                        }
                    }
                }
                currentArea += size * size;
                break;
            case 2: // Triangle
                for (let i = 0; i < size; i++) {
                    for (let j = 0; j <= i; j++) {
                        if (startY + i < rows && startX + j < cols) {
                            board[startY + i][startX + j] = 1;
                        }
                    }
                }
                currentArea += (size * (size + 1)) / 2;
                break;
            case 3: // Star
                const mid = Math.floor(size / 2);
                for (let i = 0; i < size; i++) {
                    for (let j = 0; j < size; j++) {
                        if (i === mid || j === mid || i === j || i + j === size - 1) {
                            if (startY + i < rows && startX + j < cols) {
                                board[startY + i][startX + j] = 1;
                            }
                        }
                    }
                }
                currentArea += size * size;
                break;
        }
    }
    drawBoard();
}

function clearBoard() {
    board = createEmptyBoard();
    drawBoard();
}

function toggleCell(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);
    board[row][col] = board[row][col] ? 0 : 1;
    drawBoard();
}

canvas.addEventListener('mousedown', () => isDrawing = true);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mousemove', (event) => {
    if (isDrawing) {
        toggleCell(event);
    }
});
canvas.addEventListener('click', toggleCell);

playButton.addEventListener('click', play);
stopButton.addEventListener('click', stop);
random30Button.addEventListener('click', () => randomizeBoard(0.3));
random10Button.addEventListener('click', () => randomizeBoard(0.1));
randomShapesButton.addEventListener('click', randomizeShapes);
clearButton.addEventListener('click', clearBoard);

drawBoard();
