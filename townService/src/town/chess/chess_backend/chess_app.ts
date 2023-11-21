/**
 * TO DO:
 * Make timer count down
 */

import { Chess, SQUARES, Square } from 'chess.js';

/**
 * Colors for referencing pieces or player. Use this, it is directly related to the backend functionality.
 */
export enum Colors {
  White = 'w',
  Black = 'b',
}

/**
 * Chess Class. Offers basic logic for a chess game, as well as many functions to use this logic.
 */
class ChessGame {
  gameID: number;

  private _game: Chess;

  winner: number;

  white_id: number;

  black_id: number;

  timer: number;

  private _history: { [move: string]: string };

  /**
   * Initialize your chess game object. This will be used to interact with the board. To display the board, do so by FEN string and the getFen() function.
   * Also initializes the gameID of the game for history purposes, if needed.
   * @param whiteID Player ID of white.
   * @param blackID Player ID of black.
   * @param time_limit Optional: Timer value. If not set, defaults to infinity (999999).
   */
  constructor(whiteID: number, blackID: number, time_limit = 999999) {
    this.gameID = Math.floor(Math.random() * 100000);
    this._game = new Chess();
    this._history = {};
    this.winner = -1;
    this.white_id = whiteID;
    this.black_id = blackID;
    this.timer = time_limit;
  }

  /**
   * Function to check if the game is over.
   * @returns False is the game is over, true otherwise.
   */
  private _preMoveChecks(): boolean {
    if (
      this._game.isCheckmate() ||
      this._game.isGameOver() ||
      this._game.isDraw() ||
      this._game.isInsufficientMaterial() ||
      this._game.isThreefoldRepetition()
    ) {
      this.checkIfCheckmate();
      return false;
    }
    if (this.winner !== -1) {
      return false;
    }
    return true;
  }

  /**
   * Make a move on the chess board.
   * @param moveToMake The move you intend to make, this should follow standard Chess Algebraic Move Notation.
   * For example: e4 means the pawn on e2/e3 will move to e4. The symbol structure for this is:
   * [Piece][moveToMake][ + (if move puts king in check) / # (if move results in checkmate)]
   * @param color Color of the piece of being moved.
   * @returns The new FEN string of the board so the visual could be updated.
   */
  public make_move(moveToMake: string, color: Colors): string {
    if (
      this._preMoveChecks() &&
      (this._game.moves().includes(moveToMake) || this.matchMoves(moveToMake) !== 'None') &&
      color === this._game.turn()
    ) {
      this._game.move(moveToMake);
      this._history[moveToMake] = this.getFen();
    } else {
      console.log('Error');
      return 'Error';
    }
    return this.getFen();
  }

  /**
   * Function to get the FEN string of the current board.
   * @returns FEN string of current board state.
   */
  public getFen(): string {
    return this._game.fen();
  }

  /**
   * Function to get a list of all the possible moves on the board currently.
   * @returns String array of all possible moves.
   */
  public getMoves(): string[] {
    return this._game.moves();
  }

  /**
   * Function get the current piece on a square and it's color.
   * @param square string of the board square that you're trying to get. Must be a valid chess square (a1-h8) in that syntax.
   * @returns Dictionary of the piece and the color of the piece. Returns null if the input isn't valid.
   */
  public getPieceOnSquare(square: string) {
    if (SQUARES.includes(square as Square)) return this._game.get(square as Square);
    return null;
  }

  /**
   * Work in Progress. Matches move to a move in the list of valid moves. Use this to confirm your notation before calling make_move.
   * @param moveToMake Move you are attempting to make. Follow Chess standard move notation.
   * @returns The closest move to the move passed with Valid syntax, otherwise 'None'.
   */
  public matchMoves(moveToMake: string): string {
    const moves = this.getMoves();
    let piece;
    let moveSpace;
    const pieceArr = ['r', 'R', 'q', 'Q', 'n', 'N', 'b', 'B', 'k', 'K'];
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    if (moveToMake.length === 2) {
      piece = '';
      moveSpace = moveToMake;
    } else if (moveToMake.length === 3 && pieceArr.includes(moveToMake.slice(0, 1))) {
      piece = moveToMake.slice(0, 1);
      moveSpace = moveToMake.slice(1, 3);
    } else if (moveToMake.length === 4) {
      if (moveToMake.slice(3, 4) === '#' || moveToMake.slice(3, 4) === '+') {
        piece = moveToMake.slice(0, 1);
        moveSpace = moveToMake.slice(1, 3);
      } else {
        piece = this.getPieceOnSquare(moveToMake.slice(0, 2))?.type.toUpperCase(); // ??
        moveSpace = moveToMake.slice(2, 4);
      }
    } else if (moveToMake.length === 5) {
      piece = moveToMake.slice(0, 1);
      moveSpace = moveToMake.slice(2, 4);
    } else {
      piece = 'p';
      moveSpace = 'O - O';
    }
    console.log(piece + moveSpace);
    if (piece) {
      for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        // console.log(move);
        if (moveToMake[-1] === '#' && moves.includes(moveToMake)) {
          return move;
        }
        // why isnt this regex working?
        if (move.match(`^${piece}x?${moveSpace}[+#]?`)) {
          return move;
        }
      }
    } else {
      for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        // console.log(move);
        if (moveToMake[-1] === '#' && moves.includes(moveToMake)) {
          return move;
        }
        if (move.match(`^${moveToMake}.?`)) {
          return move;
        }
      }
    }
    return 'None';
  }

  /**
   * Function to get what color's turn it is.
   * @returns String of which color's turn it is. Directly equal to the enum Colors. Use this enum in your code.
   */
  public getTurn(): string {
    return this._game.turn();
  }

  /**
   * Function to give direct reason for game ending. Can be called after every move to check if game is still ongoing.
   * @returns 'Not Over' if game is still in progress, 'Checkmate - ['w'/'b']' if theres a checkmate,
   * 'Insufficient Material' if there's insufficient material, 'Three Fold Repetition' for TFR, 'Draw' for draw state.
   */
  public getReasonForGameEnd(): string {
    console.log('WINNER', this.winner);
    if (!this._game.isGameOver() && this.winner === -1) return 'Not Over';
    if (this._game.isCheckmate())
      return `Checkmate - ${this.getTurn() === Colors.White ? Colors.Black : Colors.White}`;
    if (this._game.isInsufficientMaterial()) return 'Insufficient Material';
    if (this._game.isThreefoldRepetition()) return 'Three Fold Repetition';
    if (this._game.isDraw()) return 'Draw';
    if (this.winner !== -1) return 'Concede';
    return 'Not Over';
  }

  /**
   * Function to load board to a specific state by FEN string. Good for use for accessing history of game.
   * @param fen FEN string to load the board state to.
   * @returns True if the board was successfully loaded, false otherwise.
   */
  public loadFen(fen: string): boolean {
    this._game.load(fen);
    if (this.getFen() === fen) return true;
    return false;
  }

  /**
   * Function to get history of the game.
   * @returns Dictionary of move names and their corresponding FEN position.
   */
  public getHistory() {
    return this._history;
  }

  /**
   * Function to check if there's been a checkmate.
   * @returns True of there was a checkmate, as well as sets the winner attribute, false otherwise.
   */
  public checkIfCheckmate(): boolean {
    if (this._game.isCheckmate()) {
      this.winner = this.getTurn() === Colors.Black ? this.white_id : this.black_id;
      return true;
    }
    return false;
  }

  /** !
   * Function to assign winner if a player concedes. Attribute .winner will be assigned to winner. No return value.
   * @param color Color of the conceding player.
   */
  public concede(color: Colors): void {
    this.winner = color === Colors.Black ? this.white_id : this.black_id;
  }
}

/* Test Area */
// const gamer = new ChessGame(1, 2, 10); // initialize
// console.log(gamer.gameID);
// console.log(gamer.getFen());
// console.log(gamer.getMoves());
// const MOVE = 'e4';
// console.log('MATCH: ', gamer.matchMoves(MOVE));
// // if ('e3+'.match(`^${MOVE}`)) {
// //   console.log('true');
// // }
// console.log(gamer.getHistory());
// gamer.make_move('e4', Colors.White); // make move
// console.log(gamer.getFen());
// console.log(gamer.getTurn() === Colors.Black);
// console.log(gamer.getHistory());
// gamer.make_move('f5', Colors.Black); // make another move
// console.log(gamer.getHistory());
// const hist = gamer.getHistory();
// // console.log(hist['Na3']);
// console.log(gamer.getFen());
// // gamer.loadFen(gamer.getHistory()['Na3']); // revert to old board state from history
// console.log(gamer.getFen());
// console.log(gamer.timer);
// gamer.make_move('Bc4', Colors.White);
// gamer.make_move('g5', Colors.Black);
// console.log(gamer.winner);
// console.log('-------------------');
// console.log(gamer.getFen());
// console.log(gamer.checkIfCheckmate());
// console.log(gamer.getMoves());
// gamer.make_move('exf5', Colors.White);
// gamer.make_move('a5', Colors.Black);
// gamer.make_move('Qh5', Colors.White);
// console.log(gamer.getFen());
// console.log(gamer.checkIfCheckmate());
// console.log(gamer.winner);
// console.log(gamer.getPieceOnSquare('a2'));
// console.log(gamer.getPieceOnSquare('a1')?.type);

// const stockfish = new CallStockfish(1000);
// await stockfish.callStockfish(gamer.getFen());
// const MOVE = stockfish.getMove();
// console.log(MOVE);

export default ChessGame;
