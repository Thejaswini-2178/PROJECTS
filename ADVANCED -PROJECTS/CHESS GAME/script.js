document.addEventListener('DOMContentLoaded', () => {
    // Game state
    const gameState = {
        board: Array(8).fill().map(() => Array(8).fill(null)),
        turn: 'white',
        selectedSquare: null,
        validMoves: [],
        whiteTime: 600, // 10 minutes in seconds
        blackTime: 600,
        timerInterval: null,
        gameActive: false,
        lastMove: null,
        whiteKingPos: { row: 7, col: 4 },
        blackKingPos: { row: 0, col: 4 },
        check: false,
        flipped: false
    };

    // DOM elements
    const chessboard = document.getElementById('chessboard');
    const moveHistory = document.getElementById('move-history');
    const statusBar = document.getElementById('status-bar');
    const whiteTimeDisplay = document.getElementById('white-time');
    const blackTimeDisplay = document.getElementById('black-time');
    const newGameBtn = document.getElementById('new-game-btn');
    const flipBoardBtn = document.getElementById('flip-board-btn');
    const promotionModal = document.getElementById('promotion-modal');
    let promotionCallback = null;

    // Initialize the game
    function initGame() {
        clearBoard();
        setupPieces();
        renderBoard();
        startTimer();
        gameState.gameActive = true;
        gameState.turn = 'white';
        gameState.selectedSquare = null;
        gameState.validMoves = [];
        gameState.lastMove = null;
        gameState.check = false;
        moveHistory.innerHTML = '';
        updateStatus();
    }

    // Clear the board
    function clearBoard() {
        chessboard.innerHTML = '';
        for (let row = 0; row < 8; row++) {
            gameState.board[row] = Array(8).fill(null);
        }
    }

    // Set up the initial piece positions
    function setupPieces() {
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
        
        gameState.whiteKingPos = { row: 7, col: 4 };
        gameState.blackKingPos = { row: 0, col: 4 };
    }

    // Render the chessboard
    function renderBoard() {
        chessboard.innerHTML = '';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = 'square';
                square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
                square.dataset.row = row;
                square.dataset.col = col;
                
                // Highlight last move
                if (gameState.lastMove && 
                    ((gameState.lastMove.from.row === row && gameState.lastMove.from.col === col) ||
                     (gameState.lastMove.to.row === row && gameState.lastMove.to.col === col))) {
                    square.classList.add('last-move');
                }
                
                // Highlight selected square
                if (gameState.selectedSquare && 
                    gameState.selectedSquare.row === row && 
                    gameState.selectedSquare.col === col) {
                    square.classList.add('selected');
                }
                
                // Highlight valid moves
                if (gameState.validMoves.some(move => 
                    move.to.row === row && move.to.col === col)) {
                    square.classList.add('move-hint');
                }
                
                // Highlight king in check
                if (gameState.check) {
                    const kingPos = gameState.turn === 'white' ? gameState.whiteKingPos : gameState.blackKingPos;
                    if (kingPos.row === row && kingPos.col === col) {
                        square.classList.add('check');
                    }
                }
                
                // Add piece if exists
                const piece = gameState.board[row][col];
                if (piece) {
                    const pieceElement = document.createElement('div');
                    pieceElement.className = 'piece';
                    pieceElement.dataset.piece = `${piece.color}-${piece.type}`;
                    pieceElement.innerHTML = getPieceIcon(piece);
                    pieceElement.draggable = true;
                    
                    pieceElement.addEventListener('dragstart', handleDragStart);
                    square.appendChild(pieceElement);
                }
                
                square.addEventListener('click', () => handleSquareClick(row, col));
                square.addEventListener('dragover', handleDragOver);
                square.addEventListener('drop', handleDrop);
                square.addEventListener('dragenter', handleDragEnter);
                square.addEventListener('dragleave', handleDragLeave);
                
                chessboard.appendChild(square);
            }
        }
        
        if (gameState.flipped) {
            chessboard.style.transform = 'rotate(180deg)';
            Array.from(chessboard.children).forEach(piece => {
                if (piece.querySelector('.piece')) {
                    piece.querySelector('.piece').style.transform = 'rotate(180deg)';
                }
            });
        } else {
            chessboard.style.transform = 'rotate(0)';
            Array.from(chessboard.children).forEach(piece => {
                if (piece.querySelector('.piece')) {
                    piece.querySelector('.piece').style.transform = 'rotate(0)';
                }
            });
        }
    }

    // Get Font Awesome icon for piece
    function getPieceIcon(piece) {
        const icons = {
            'king': 'fa-chess-king',
            'queen': 'fa-chess-queen',
            'rook': 'fa-chess-rook',
            'bishop': 'fa-chess-bishop',
            'knight': 'fa-chess-knight',
            'pawn': 'fa-chess-pawn'
        };
        return `<i class="fas ${icons[piece.type]} ${piece.color}-icon"></i>`;
    }

    // Handle square click
    function handleSquareClick(row, col) {
        if (!gameState.gameActive) return;
        
        const piece = gameState.board[row][col];
        
        // If a piece of the current turn's color is clicked, select it
        if (piece && piece.color === gameState.turn) {
            gameState.selectedSquare = { row, col };
            gameState.validMoves = getValidMoves(row, col);
            renderBoard();
            return;
        }
        
        // If a square is already selected and the clicked square is a valid move
        if (gameState.selectedSquare) {
            const isValidMove = gameState.validMoves.some(move => 
                move.to.row === row && move.to.col === col);
            
            if (isValidMove) {
                makeMove(gameState.selectedSquare.row, gameState.selectedSquare.col, row, col);
                gameState.selectedSquare = null;
                gameState.validMoves = [];
                renderBoard();
            }
        }
    }

    // Get all valid moves for a piece
    function getValidMoves(row, col) {
        const piece = gameState.board[row][col];
        if (!piece) return [];
        
        const moves = [];
        
        switch (piece.type) {
            case 'pawn':
                getPawnMoves(row, col, piece.color, moves);
                break;
            case 'rook':
                getRookMoves(row, col, piece.color, moves);
                break;
            case 'knight':
                getKnightMoves(row, col, piece.color, moves);
                break;
            case 'bishop':
                getBishopMoves(row, col, piece.color, moves);
                break;
            case 'queen':
                getRookMoves(row, col, piece.color, moves);
                getBishopMoves(row, col, piece.color, moves);
                break;
            case 'king':
                getKingMoves(row, col, piece.color, moves);
                break;
        }
        
        // Filter out moves that would leave the king in check
        return moves.filter(move => {
            // Simulate the move
            const originalPiece = gameState.board[move.to.row][move.to.col];
            gameState.board[move.to.row][move.to.col] = { ...piece };
            gameState.board[row][col] = null;
            
            // Update king position if moving the king
            let kingPos;
            if (piece.type === 'king') {
                kingPos = piece.color === 'white' ? gameState.whiteKingPos : gameState.blackKingPos;
                if (piece.color === 'white') {
                    gameState.whiteKingPos = { row: move.to.row, col: move.to.col };
                } else {
                    gameState.blackKingPos = { row: move.to.row, col: move.to.col };
                }
            }
            
            const isCheck = isKingInCheck(piece.color);
            
            // Undo the move
            gameState.board[row][col] = piece;
            gameState.board[move.to.row][move.to.col] = originalPiece;
            
            // Restore king position if moved
            if (piece.type === 'king') {
                if (piece.color === 'white') {
                    gameState.whiteKingPos = kingPos;
                } else {
                    gameState.blackKingPos = kingPos;
                }
            }
            
            return !isCheck;
        });
    }

    // Pawn movement logic
    function getPawnMoves(row, col, color, moves) {
        const direction = color === 'white' ? -1 : 1;
        const startRow = color === 'white' ? 6 : 1;
        
        // Forward move
        if (isInBounds(row + direction, col) && !gameState.board[row + direction][col]) {
            moves.push({ from: { row, col }, to: { row: row + direction, col } });
            
            // Double move from starting position
            if (row === startRow && !gameState.board[row + 2 * direction][col]) {
                moves.push({ from: { row, col }, to: { row: row + 2 * direction, col } });
            }
        }
        
        // Capture moves
        for (const colOffset of [-1, 1]) {
            const newCol = col + colOffset;
            if (isInBounds(row + direction, newCol)) {
                const targetPiece = gameState.board[row + direction][newCol];
                if (targetPiece && targetPiece.color !== color) {
                    moves.push({ from: { row, col }, to: { row: row + direction, col: newCol } });
                }
                
                // En passant
                const lastMove = gameState.lastMove;
                if (lastMove && lastMove.piece.type === 'pawn' && 
                    Math.abs(lastMove.from.row - lastMove.to.row) === 2 &&
                    lastMove.to.row === row && 
                    lastMove.to.col === newCol) {
                    moves.push({ 
                        from: { row, col }, 
                        to: { row: row + direction, col: newCol },
                        isEnPassant: true 
                    });
                }
            }
        }
    }

    // Rook movement logic
    function getRookMoves(row, col, color, moves) {
        const directions = [
            { row: -1, col: 0 },  // up
            { row: 1, col: 0 },   // down
            { row: 0, col: -1 },   // left
            { row: 0, col: 1 }    // right
        ];
        
        for (const dir of directions) {
            for (let i = 1; i < 8; i++) {
                const newRow = row + dir.row * i;
                const newCol = col + dir.col * i;
                
                if (!isInBounds(newRow, newCol)) break;
                
                const targetPiece = gameState.board[newRow][newCol];
                if (!targetPiece) {
                    moves.push({ from: { row, col }, to: { row: newRow, col: newCol } });
                } else {
                    if (targetPiece.color !== color) {
                        moves.push({ from: { row, col }, to: { row: newRow, col: newCol } });
                    }
                    break;
                }
            }
        }
    }

    // Knight movement logic
    function getKnightMoves(row, col, color, moves) {
        const movesOffsets = [
            { row: -2, col: -1 }, { row: -2, col: 1 },
            { row: -1, col: -2 }, { row: -1, col: 2 },
            { row: 1, col: -2 }, { row: 1, col: 2 },
            { row: 2, col: -1 }, { row: 2, col: 1 }
        ];
        
        for (const offset of movesOffsets) {
            const newRow = row + offset.row;
            const newCol = col + offset.col;
            
            if (isInBounds(newRow, newCol)) {
                const targetPiece = gameState.board[newRow][newCol];
                if (!targetPiece || targetPiece.color !== color) {
                    moves.push({ from: { row, col }, to: { row: newRow, col: newCol } });
                }
            }
        }
    }

    // Bishop movement logic
    function getBishopMoves(row, col, color, moves) {
        const directions = [
            { row: -1, col: -1 },  // up-left
            { row: -1, col: 1 },    // up-right
            { row: 1, col: -1 },    // down-left
            { row: 1, col: 1 }      // down-right
        ];
        
        for (const dir of directions) {
            for (let i = 1; i < 8; i++) {
                const newRow = row + dir.row * i;
                const newCol = col + dir.col * i;
                
                if (!isInBounds(newRow, newCol)) break;
                
                const targetPiece = gameState.board[newRow][newCol];
                if (!targetPiece) {
                    moves.push({ from: { row, col }, to: { row: newRow, col: newCol } });
                } else {
                    if (targetPiece.color !== color) {
                        moves.push({ from: { row, col }, to: { row: newRow, col: newCol } });
                    }
                    break;
                }
            }
        }
    }

    // King movement logic
    function getKingMoves(row, col, color, moves) {
        for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
                if (r === 0 && c === 0) continue;
                
                const newRow = row + r;
                const newCol = col + c;
                
                if (isInBounds(newRow, newCol)) {
                    const targetPiece = gameState.board[newRow][newCol];
                    if (!targetPiece || targetPiece.color !== color) {
                        moves.push({ from: { row, col }, to: { row: newRow, col: newCol } });
                    }
                }
            }
        }
        
        // Castling
        const piece = gameState.board[row][col];
        if (!piece.hasMoved && !isKingInCheck(color)) {
            // King-side castling
            if (gameState.board[row][7] && gameState.board[row][7].type === 'rook' && 
                !gameState.board[row][7].hasMoved && 
                !gameState.board[row][5] && !gameState.board[row][6]) {
                // Check if squares are under attack
                if (!isSquareUnderAttack(color, row, 5) && !isSquareUnderAttack(color, row, 6)) {
                    moves.push({ 
                        from: { row, col }, 
                        to: { row, col: 6 }, 
                        isCastle: true, 
                        rookFrom: { row, col: 7 }, 
                        rookTo: { row, col: 5 } 
                    });
                }
            }
            
            // Queen-side castling
            if (gameState.board[row][0] && gameState.board[row][0].type === 'rook' && 
                !gameState.board[row][0].hasMoved && 
                !gameState.board[row][1] && !gameState.board[row][2] && !gameState.board[row][3]) {
                // Check if squares are under attack
                if (!isSquareUnderAttack(color, row, 2) && !isSquareUnderAttack(color, row, 3)) {
                    moves.push({ 
                        from: { row, col }, 
                        to: { row, col: 2 }, 
                        isCastle: true, 
                        rookFrom: { row, col: 0 }, 
                        rookTo: { row, col: 3 } 
                    });
                }
            }
        }
    }

    // Check if a square is within bounds
    function isInBounds(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    // Make a move
    function makeMove(fromRow, fromCol, toRow, toCol) {
        const piece = gameState.board[fromRow][fromCol];
        const targetPiece = gameState.board[toRow][toCol];
        
        // Find the move in validMoves to check for special moves
        const move = gameState.validMoves.find(m => 
            m.to.row === toRow && m.to.col === toCol);
        
        // Handle pawn promotion
        if (piece.type === 'pawn' && (toRow === 0 || toRow === 7)) {
            showPromotionModal(fromRow, fromCol, toRow, toCol);
            return;
        }
        
        // Execute the move
        executeMove(fromRow, fromCol, toRow, toCol, move);
        
        // Switch turns
        gameState.turn = gameState.turn === 'white' ? 'black' : 'white';
        gameState.check = isKingInCheck(gameState.turn);
        
        // Check for game end conditions
        checkGameEnd();
        
        // Update status
        updateStatus();
        
        // Add to move history
        addToMoveHistory(piece, fromRow, fromCol, toRow, toCol, targetPiece, move);
    }

    // Execute the move on the board
    function executeMove(fromRow, fromCol, toRow, toCol, move) {
        const piece = gameState.board[fromRow][fromCol];
        
        // Mark piece as moved (for pawns, kings, rooks)
        if (piece.type === 'pawn' || piece.type === 'king' || piece.type === 'rook') {
            piece.hasMoved = true;
        }
        
        // Handle en passant
        if (move && move.isEnPassant) {
            gameState.board[fromRow][toCol] = null; // Remove the captured pawn
        }
        
        // Handle castling
        if (move && move.isCastle) {
            // Move the rook
            const rook = gameState.board[move.rookFrom.row][move.rookFrom.col];
            gameState.board[move.rookTo.row][move.rookTo.col] = rook;
            gameState.board[move.rookFrom.row][move.rookFrom.col] = null;
            rook.hasMoved = true;
        }
        
        // Update king position if moving the king
        if (piece.type === 'king') {
            if (piece.color === 'white') {
                gameState.whiteKingPos = { row: toRow, col: toCol };
            } else {
                gameState.blackKingPos = { row: toRow, col: toCol };
            }
        }
        
        // Move the piece
        gameState.board[toRow][toCol] = piece;
        gameState.board[fromRow][fromCol] = null;
        
        // Store last move
        gameState.lastMove = {
            from: { row: fromRow, col: fromCol },
            to: { row: toRow, col: toCol },
            piece: piece
        };
    }

    // Show promotion modal
    function showPromotionModal(fromRow, fromCol, toRow, toCol) {
        promotionModal.style.display = 'flex';
        
        promotionCallback = (pieceType) => {
            const piece = gameState.board[fromRow][fromCol];
            gameState.board[toRow][toCol] = { type: pieceType, color: piece.color };
            gameState.board[fromRow][fromCol] = null;
            
            // Switch turns
            gameState.turn = gameState.turn === 'white' ? 'black' : 'white';
            gameState.check = isKingInCheck(gameState.turn);
            
            // Check for game end conditions
            checkGameEnd();
            
            // Update status
            updateStatus();
            
            // Add to move history
            addToMoveHistory(piece, fromRow, fromCol, toRow, toCol, null, null, pieceType);
            
            promotionModal.style.display = 'none';
            renderBoard();
        };
    }

    // Check if king is in check
    function isKingInCheck(color) {
        const kingPos = color === 'white' ? gameState.whiteKingPos : gameState.blackKingPos;
        return isSquareUnderAttack(color, kingPos.row, kingPos.col);
    }

    // Check if square is under attack
    function isSquareUnderAttack(color, row, col) {
        const opponentColor = color === 'white' ? 'black' : 'white';
        
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = gameState.board[r][c];
                if (piece && piece.color === opponentColor) {
                    const moves = [];
                    
                    switch (piece.type) {
                        case 'pawn':
                            // Pawns attack diagonally
                            const direction = opponentColor === 'white' ? -1 : 1;
                            if ((r + direction === row && (c - 1 === col || c + 1 === col))) {
                                return true;
                            }
                            break;
                        case 'knight':
                            getKnightMoves(r, c, opponentColor, moves);
                            if (moves.some(m => m.to.row === row && m.to.col === col)) {
                                return true;
                            }
                            break;
                        default:
                            // For other pieces, use their movement rules
                            if (piece.type === 'rook') {
                                getRookMoves(r, c, opponentColor, moves);
                            } else if (piece.type === 'bishop') {
                                getBishopMoves(r, c, opponentColor, moves);
                            } else if (piece.type === 'queen') {
                                getRookMoves(r, c, opponentColor, moves);
                                getBishopMoves(r, c, opponentColor, moves);
                            } else if (piece.type === 'king') {
                                getKingMoves(r, c, opponentColor, moves);
                            }
                            
                            if (moves.some(m => m.to.row === row && m.to.col === col)) {
                                return true;
                            }
                    }
                }
            }
        }
        
        return false;
    }

    // Check for game end conditions (checkmate or stalemate)
    function checkGameEnd() {
        // Check if current player has any valid moves
        let hasValidMoves = false;
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = gameState.board[row][col];
                if (piece && piece.color === gameState.turn) {
                    const moves = getValidMoves(row, col);
                    if (moves.length > 0) {
                        hasValidMoves = true;
                        break;
                    }
                }
            }
            if (hasValidMoves) break;
        }
        
        if (!hasValidMoves) {
            if (gameState.check) {
                // Checkmate
                gameState.gameActive = false;
                clearInterval(gameState.timerInterval);
                statusBar.textContent = `Checkmate! ${gameState.turn === 'white' ? 'Black' : 'White'} wins!`;
            } else {
                // Stalemate
                gameState.gameActive = false;
                clearInterval(gameState.timerInterval);
                statusBar.textContent = "Stalemate! Game ended in a draw.";
            }
        }
    }

    // Update status bar
    function updateStatus() {
        if (gameState.check) {
            statusBar.textContent = `${gameState.turn === 'white' ? 'White' : 'Black'} is in check!`;
        } else {
            statusBar.textContent = `${gameState.turn === 'white' ? 'White' : 'Black'}'s turn`;
        }
    }

    // Add move to history
    function addToMoveHistory(piece, fromRow, fromCol, toRow, toCol, targetPiece, move, promotionType) {
        const moveNotation = getMoveNotation(piece, fromRow, fromCol, toRow, toCol, targetPiece, move, promotionType);
        const moveElement = document.createElement('div');
        moveElement.className = 'move';
        moveElement.textContent = moveNotation;
        moveHistory.appendChild(moveElement);
        moveHistory.scrollTop = moveHistory.scrollHeight;
    }

    // Get algebraic notation for move
    function getMoveNotation(piece, fromRow, fromCol, toRow, toCol, targetPiece, move, promotionType) {
        let notation = '';
        
        // Castling
        if (move && move.isCastle) {
            return toCol === 6 ? 'O-O' : 'O-O-O'; // King-side or queen-side
        }
        
        // Piece type (except pawn)
        if (piece.type !== 'pawn') {
            notation += piece.type === 'knight' ? 'N' : piece.type[0].toUpperCase();
        }
        
        // Disambiguation if needed (for pieces of same type that can move to same square)
        if (piece.type !== 'pawn') {
            let samePieces = 0;
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    const p = gameState.board[r][c];
                    if (p && p.type === piece.type && p.color === piece.color && 
                        !(r === fromRow && c === fromCol)) {
                        const moves = getValidMoves(r, c);
                        if (moves.some(m => m.to.row === toRow && m.to.col === toCol)) {
                            samePieces++;
                        }
                    }
                }
            }
            
            if (samePieces > 0) {
                // If on same file, use rank; otherwise use file
                const sameFile = gameState.board.some((row, r) => 
                    r !== fromRow && row[fromCol] && 
                    row[fromCol].type === piece.type && 
                    row[fromCol].color === piece.color);
                
                if (sameFile) {
                    notation += String.fromCharCode(97 + fromCol);
                } else {
                    notation += (8 - fromRow);
                }
            }
        }
        
        // Capture
        if (targetPiece || (move && move.isEnPassant)) {
            if (piece.type === 'pawn') {
                notation += String.fromCharCode(97 + fromCol);
            }
            notation += 'x';
        }
        
        // Destination
        notation += String.fromCharCode(97 + toCol) + (8 - toRow);
        
        // Promotion
        if (promotionType) {
            notation += '=' + (promotionType === 'knight' ? 'N' : promotionType[0].toUpperCase());
        }
        
        // Check or checkmate
        if (move) {
            // Simulate the move to check for check/checkmate
            const originalPiece = gameState.board[toRow][toCol];
            gameState.board[toRow][toCol] = piece;
            gameState.board[fromRow][fromCol] = null;
            
            const opponentColor = piece.color === 'white' ? 'black' : 'white';
            const opponentKingPos = opponentColor === 'white' ? gameState.whiteKingPos : gameState.blackKingPos;
            const isNowCheck = isSquareUnderAttack(opponentColor, opponentKingPos.row, opponentKingPos.col);
            
            // Undo the move
            gameState.board[fromRow][fromCol] = piece;
            gameState.board[toRow][toCol] = originalPiece;
            
            if (isNowCheck) {
                // Check if it's checkmate
                let hasLegalMoves = false;
                for (let r = 0; r < 8; r++) {
                    for (let c = 0; c < 8; c++) {
                        const p = gameState.board[r][c];
                        if (p && p.color === opponentColor) {
                            const moves = getValidMoves(r, c);
                            if (moves.length > 0) {
                                hasLegalMoves = true;
                                break;
                            }
                        }
                    }
                    if (hasLegalMoves) break;
                }
                
                notation += hasLegalMoves ? '+' : '#';
            }
        }
        
        return notation;
    }

    // Start the game timer
    function startTimer() {
        clearInterval(gameState.timerInterval);
        
        gameState.whiteTime = 600; // 10 minutes
        gameState.blackTime = 600;
        updateTimeDisplays();
        
        gameState.timerInterval = setInterval(() => {
            if (gameState.gameActive) {
                if (gameState.turn === 'white') {
                    gameState.whiteTime--;
                    if (gameState.whiteTime <= 0) {
                        gameState.whiteTime = 0;
                        endGameByTime('black');
                    }
                } else {
                    gameState.blackTime--;
                    if (gameState.blackTime <= 0) {
                        gameState.blackTime = 0;
                        endGameByTime('white');
                    }
                }
                updateTimeDisplays();
            }
        }, 1000);
    }

    // Update time displays
    function updateTimeDisplays() {
        whiteTimeDisplay.textContent = formatTime(gameState.whiteTime);
        blackTimeDisplay.textContent = formatTime(gameState.blackTime);
    }

    // Format time as MM:SS
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // End game by timeout
    function endGameByTime(winner) {
        gameState.gameActive = false;
        clearInterval(gameState.timerInterval);
        statusBar.textContent = `Time's up! ${winner === 'white' ? 'White' : 'Black'} wins!`;
    }

    // Drag and drop handlers
    function handleDragStart(e) {
        const pieceElement = e.target;
        const square = pieceElement.parentElement;
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        
        const piece = gameState.board[row][col];
        if (!piece || piece.color !== gameState.turn || !gameState.gameActive) {
            e.preventDefault();
            return;
        }
        
        pieceElement.classList.add('dragging');
        e.dataTransfer.setData('text/plain', `${row},${col}`);
        e.dataTransfer.effectAllowed = 'move';
        
        gameState.selectedSquare = { row, col };
        gameState.validMoves = getValidMoves(row, col);
        renderBoard();
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    function handleDrop(e) {
        e.preventDefault();
        const square = e.currentTarget;
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        
        const [fromRow, fromCol] = e.dataTransfer.getData('text/plain').split(',').map(Number);
        const piece = gameState.board[fromRow][fromCol];
        
        if (!piece || piece.color !== gameState.turn || !gameState.gameActive) return;
        
        const isValidMove = gameState.validMoves.some(move => 
            move.to.row === row && move.to.col === col);
        
        if (isValidMove) {
            makeMove(fromRow, fromCol, row, col);
            gameState.selectedSquare = null;
            gameState.validMoves = [];
            renderBoard();
        }
    }

    function handleDragEnter(e) {
        e.preventDefault();
        const square = e.currentTarget;
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        
        const isValidMove = gameState.validMoves.some(move => 
            move.to.row === row && move.to.col === col);
        
        if (isValidMove) {
            square.classList.add('highlight');
        }
    }

    function handleDragLeave(e) {
        e.preventDefault();
        const square = e.currentTarget;
        square.classList.remove('highlight');
    }

    // Promotion modal handlers
    promotionModal.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', () => {
            if (promotionCallback) {
                promotionCallback(option.dataset.piece);
                promotionCallback = null;
            }
        });
    });

    // Button handlers
    newGameBtn.addEventListener('click', initGame);
    flipBoardBtn.addEventListener('click', () => {
        gameState.flipped = !gameState.flipped;
        renderBoard();
    });

    // Initialize the game
    initGame();
});