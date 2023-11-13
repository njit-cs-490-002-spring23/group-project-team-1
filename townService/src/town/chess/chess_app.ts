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

  // white_id: number; white player id
  // black_id: number; black player id
  timer: number;

  constructor(time_limit: number) {
    this.gameID = Math.floor(Math.random() * 100000);
    this.timer = time_limit;
    this._game = new Chess();
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
      if (move.match(`^${moveToMake}.?`)) {
        return move;
      }
    }
    return 'None';
  }

  public getTurn(): string {
    return this._game.turn();
  }
}

const gamer = new ChessGame(10);
console.log(gamer.gameID);
console.log(gamer.getFen());
console.log(gamer.getMoves());
const MOVE = 'e3#';
console.log(gamer.matchMoves(MOVE));
// if ('e3+'.match(`^${MOVE}`)) {
//   console.log('true');
// }
gamer.make_move('Na3', Colors.White);
console.log(gamer.getFen());
console.log(gamer.getTurn() === Colors.Black);

export default ChessGame;
