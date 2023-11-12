// just filling for github to make the directory
import { Chess } from 'chess.js';

// const chess = new Chess();
// Class for Chess Game

export enum Colors {
  White = 'White',
  Black = 'Black',
}

class ChessGame {
  gameID: number;

  private _game: Chess;

  // white_id: number; white player id
  // black_id: number; black player id
  timer: number;

  private _currTurn: Colors; // White / Black

  constructor(time_limit: number) {
    this.gameID = Math.floor(Math.random() * 100000);
    this.timer = time_limit;
    this._game = new Chess();
    this._currTurn = Colors.White;
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
  public make_move(moveToMake: string, color: Colors): void {
    if (
      this._preMoveChecks() &&
      this._game.moves().includes(moveToMake) &&
      color === this._currTurn
    ) {
      this._game.move(moveToMake);
    } else {
      console.log('Error');
    }
  }

  public getFen(): string {
    return this._game.fen();
  }
}

const gamer = new ChessGame(10);
console.log(gamer.gameID);
console.log(gamer.getFen());
gamer.make_move('e4', Colors.White);
console.log(gamer.getFen());

export default ChessGame;
