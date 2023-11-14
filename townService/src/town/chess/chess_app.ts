/**
 * TO DO:
 * Implement regex matching for moves passed to function from front end to match move in movelist
 * Make timer count down
 */

import { Chess } from 'chess.js';

// const chess = new Chess();
// Class for Chess Game

export enum Colors {
  White = 'w',
  Black = 'b',
}

class ChessGame {
  gameID: number;

  private _game: Chess;
  // winner: number; winner's id number
  // white_id: number; white player id
  // black_id: number; black player id

  timer: number;

  private _history: { [move: string]: string };

  constructor(time_limit: number) {
    this.gameID = Math.floor(Math.random() * 100000);
    this.timer = time_limit;
    this._game = new Chess();
    this._history = {};
  }

  private _preMoveChecks(): boolean {
    if (
      this._game.isCheckmate() ||
      this._game.isGameOver() ||
      this._game.isDraw() ||
      this._game.isInsufficientMaterial() ||
      this._game.isThreefoldRepetition()
    )
      return false;
    return true;
  }

  // To make a move
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
    }
    return this.getFen();
  }

  public getFen(): string {
    return this._game.fen();
  }

  public getMoves(): string[] {
    return this._game.moves();
  }

  // I might now need to make this. I might just auto assume that the front end will pass the right notation, because this is bugging out.
  public matchMoves(moveToMake: string): string {
    const moves = this.getMoves();
    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      console.log(move);
      if (moveToMake[-1] === '#' && moves.includes(moveToMake)) {
        return move;
      }
      if (move.match(`^${moveToMake}.?`)) {
        return move;
      }
    }
    return 'None';
  }

  public getTurn(): string {
    return this._game.turn();
  }

  // Call this to check if the game is over or not after every move.
  public getReasonForGameEnd(): string {
    if (!this._game.isGameOver()) return 'Not Over';
    if (this._game.isCheckmate())
      return `Checkmate - ${this.getTurn() === Colors.White ? Colors.Black : Colors.White}`;
    if (this._game.isInsufficientMaterial()) return 'Insufficient Material';
    if (this._game.isThreefoldRepetition()) return 'Three Fold Repetition';
    if (this._game.isDraw()) return 'Draw';
    return 'Not Over';
  }

  public loadFen(fen: string): boolean {
    this._game.load(fen);
    if (this.getFen() === fen) return true;
    return false;
  }

  public getHistory() {
    return this._history;
  }
}

/* Test Area */
const gamer = new ChessGame(10); // initialize
console.log(gamer.gameID);
console.log(gamer.getFen());
console.log(gamer.getMoves());
const MOVE = 'e3';
console.log(gamer.matchMoves(MOVE));
// if ('e3+'.match(`^${MOVE}`)) {
//   console.log('true');
// }
console.log(gamer.getHistory());
gamer.make_move('Na3', Colors.White); // make move
console.log(gamer.getFen());
console.log(gamer.getTurn() === Colors.Black);
console.log(gamer.getHistory());
gamer.make_move('e5', Colors.Black); // make another move
console.log(gamer.getHistory());
const hist = gamer.getHistory();
// console.log(hist['Na3']);
console.log(gamer.getFen());
// gamer.loadFen(gamer.getHistory()['Na3']); // revert to old board state from history
console.log(gamer.getFen());

export default ChessGame;
