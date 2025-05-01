document.addEventListener('DOMContentLoaded', () => {
    // Game state
    const gameState = {
        board: Array(8).fill().map(() => Array(8).fill(null)),
        turn: 'white',
        selectedPiece: null,
        validMoves: [],
        whiteCaptured: [],
        blackCaptured: [],
        moveHistory: [],
        whiteKingPos: { row: 7, col: 4 },
        blackKingPos: { row: 0, col: 4 },
        whiteTime: 600, // 10 minutes in seconds
        blackTime: 600,
        timerInterval: null,
        flipped: false,
        gameOver: false
    };

    // DOM elements
    const chessboard = document.getElementById('chessboard');
    const whiteTimeDisplay = document.getElementById('white-time');
    const blackTimeDisplay = document.getElementById('black-time');
    const moveHistoryElement = document.getElementById('move-history');
    const capturedWhiteElement = document.getElementById('captured-white');
    const capturedBlackElement = document.getElementById('captured-black');
    const newGameBtn = document.getElementById('new-game-btn');
    const flipBoardBtn = document.getElementById('flip-board-btn');
    const gameOverModal = document.getElementById('game-over-modal');
    const gameOverText = document.getElementById('game-over-text');
    const gameOverDetails = document.getElementById('game-over-details');
    const playAgainBtn = document.getElementById('play-again-btn');

    // Initialize the game
    initGame();

    // Event listeners
    newGameBtn.addEventListener('click', initGame);
    flipBoardBtn.addEventListener('click', flipBoard);
    playAgainBtn.addEventListener('click', initGame);

    // Initialize the game
    function initGame() {
        // Reset game state
        gameState.board = Array(8).fill().map(() => Array(8).fill(null));
        gameState.turn = 'white';
        gameState.selectedPiece = null;
        gameState.validMoves = [];
        gameState.whiteCaptured = [];
        gameState.blackCaptured = [];
        gameState.moveHistory = [];
        gameState.whiteKingPos = { row: 7, col: 4 };
        gameState.blackKingPos = { row: 0, col: 4 };
        gameState.whiteTime = 600;
        gameState.blackTime = 600;
        gameState.gameOver = false;
        
        // Clear timers
        if (gameState.timerInterval) {
            clearInterval(gameState.timerInterval);
        }
        
        // Hide modal
        gameOverModal.classList.remove('active');
        
        // Reset UI
        updatePlayerInfo();
        updateCapturedPieces();
        moveHistoryElement.innerHTML = '';
        
        // Initialize board
        initializeBoard();
        renderBoard();
        
        // Start timer
        startTimer();
    }

    // Initialize the chess board with pieces
    function initializeBoard() {
        // Pawns
        for (let col = 0; col < 8; col++) {
            gameState.board[1][col] = { type: 'pawn', color: 'black', hasMoved: false };
            gameState.board[6][col] = { type: 'pawn', color: 'white', hasMoved: false };
        }
        
        // Rooks
        gameState.board[0][0] = { type: 'rook', color: 'black', hasMoved: false };
        gameState.board[0][7] = { type: 'rook', color: 'black', hasMoved: false };
        gameState.board[7][0] = { type: 'rook', color: 'white', hasMoved: false };
        gameState.board[7][7] = { type: 'rook', color: 'white', hasMoved: false };
        
        // Knights
        gameState.board[0][1] = { type: 'knight', color: 'black' };
        gameState.board[0][6] = { type: 'knight', color: 'black' };
        gameState.board[7][1] = { type: 'knight', color: 'white' };
        gameState.board[7][6] = { type: 'knight', color: 'white' };
        
        // Bishops
        gameState.board[0][2] = { type: 'bishop', color: 'black' };
        gameState.board[0][5] = { type: 'bishop', color: 'black' };
        gameState.board[7][2] = { type: 'bishop', color: 'white' };
        gameState.board[7][5] = { type: 'bishop', color: 'white' };
        
        // Queens
        gameState.board[0][3] = { type: 'queen', color: 'black' };
        gameState.board[7][3] = { type: 'queen', color: 'white' };
        
        // Kings
        gameState.board[0][4] = { type: 'king', color: 'black', hasMoved: false };
        gameState.board[7][4] = { type: 'king', color: 'white', hasMoved: false };
    }

    // Render the chess board
    function renderBoard() {
        chessboard.innerHTML = '';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'dark' : 'light'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                
                // Add coordinates
                if ((gameState.flipped && row === 0) || (!gameState.flipped && row === 7)) {
                    const file = document.createElement('span');
                    file.className = 'coordinate file';
                    file.textContent = String.fromCharCode(97 + (gameState.flipped ? 7 - col : col));
                    square.appendChild(file);
                }
                
                if ((gameState.flipped && col === 7) || (!gameState.flipped && col === 0)) {
                    const rank = document.createElement('span');
                    rank.className = 'coordinate rank';
                    rank.textContent = gameState.flipped ? row + 1 : 8 - row;
                    square.appendChild(rank);
                }
                
                // Add piece if exists
                const piece = gameState.board[row][col];
                if (piece) {
                    const pieceElement = document.createElement('div');
                    pieceElement.className = `piece ${piece.color}`;
                    pieceElement.dataset.type = piece.type;
                    pieceElement.dataset.color = piece.color;
                    
                    // Use Unicode chess characters or images
                    pieceElement.innerHTML = getPieceSymbol(piece.type, piece.color);
                    
                    // Add drag events
                    pieceElement.draggable = true;
                    pieceElement.addEventListener('dragstart', handleDragStart);
                    pieceElement.addEventListener('dragend', handleDragEnd);
                    
                    square.appendChild(pieceElement);
                }
                
                // Highlight selected square and valid moves
                if (gameState.selectedPiece && gameState.selectedPiece.row === row && gameState.selectedPiece.col === col) {
                    square.classList.add('highlight');
                }
                
                if (gameState.validMoves.some(move => move.row === row && move.col === col)) {
                    square.classList.add('move-highlight');
                }
                
                // Highlight king in check
                const kingPos = gameState.turn === 'white' ? gameState.whiteKingPos : gameState.blackKingPos;
                if (isInCheck(gameState.turn) && kingPos.row === row && kingPos.col === col) {
                    square.classList.add('check-highlight');
                }
                
                // Add click event
                square.addEventListener('click', () => handleSquareClick(row, col));
                square.addEventListener('dragover', handleDragOver);
                square.addEventListener('dragenter', handleDragEnter);
                square.addEventListener('dragleave', handleDragLeave);
                square.addEventListener('drop', handleDrop);
                
                chessboard.appendChild(square);
            }
        }
    }

    // Get Unicode symbol for piece
    function getPieceSymbol(type, color) {
        const symbols = {
            king: { white: '♔', black: '♚' },
            queen: { white: '♕', black: '♛' },
            rook: { white: '♖', black: '♜' },
            bishop: { white: '♗', black: '♝' },
            knight: { white: '♘', black: '♞' },
            pawn: { white: '♙', black: '♟' }
        };
        return symbols[type][color];
    }
}
)
    // // Handle square click
    // function handleSquareClick(row, col) {
    //     if (gameState.gameOver) return;
        
    //     const piece = gameState.board[row][col];
        
    //     If no piece is selected and the