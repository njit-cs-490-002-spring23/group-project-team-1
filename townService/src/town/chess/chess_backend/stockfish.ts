/* eslint-disable import/no-duplicates */
/* eslint-disable import/no-cycle */
// eslint-disable-next-line import/no-extraneous-dependencies
import fetch from 'node-fetch';
import ChessGame from './chess_app';
import { Colors } from './chess_app';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const fetch = require('node-fetch');

class CallStockfish {
  private _elo: number;

  private _move: string;

  private _moveList: string[];

  /**
   * Initalize the stockfish object. If you didn't create the .env file, check the README to see what to do.
   * Note that the moves will be generated based on the ELO you give stockfish. Use 3000 if you want to find best moves.
   * Use any elo from 300-3000 if using as an AI.
   * @param ELO_VALUE ELO stockfish object will be set at to find moves.
   */
  constructor(ELO_VALUE: number) {
    this._elo = ELO_VALUE;
    this._setElo();
    this._move = '';
    this._moveList = [];
  }

  private _setElo() {
    fetch('http://127.0.0.1:5000/receiver', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(this._elo),
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        return {
          status: 400,
        };
      })
      // .then(jsonResponse => {
      //   // Log the response data in the console
      //   console.log(jsonResponse);
      // })
      .catch(err => err);
  }

  /**
   * Calls stockfish to find the best move from position passed in by FEN String parameter. Call .getMove() to get the resultant move.
   * Use await when calling this function.
   * @param fen Board layout in FEN that stockfish will analyze.
   */
  public async callStockfish(fen: string) {
    await fetch('http://127.0.0.1:5000/receiver', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(fen),
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        console.log('something is wrong');
        return null;
      })
      .then(jsonResponse => {
        const stockfishMove: string = jsonResponse as string;
        this._move = stockfishMove;
      })
      .catch(err => {
        throw err;
      });
  }

  /**
   * Calls stockfish to find list of the top 10 best moves from position passed in by FEN String parameter.
   * Call .getMoveList() to get the resultant list of moves.
   * Use await when calling this function.
   * @param fen Board layout in FEN that stockfish will analyze.
   */
  public async getBestMovesList(fen: string) {
    await fetch('http://127.0.0.1:5000/movelist', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(fen),
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        console.log('something is wrong');
        return null;
      })
      .then(jsonResponse => {
        const stockfishList: string[] = jsonResponse as [];
        this._moveList = stockfishList;
      })
      .catch(err => {
        throw err;
      });
  }

  /**
   * Function to be used after callStockfish()
   * @returns move generated by callStockfish()
   */
  public getMove() {
    return this._move;
  }

  /**
   * Function to be used after getBestMovesList()
   * @returns list of moves generated by getBestMovesList()
   */
  public getMoveList() {
    return this._moveList;
  }
}

const stockypoo = new CallStockfish(3000);
await stockypoo.callStockfish('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

console.log(stockypoo.getMove());

await stockypoo.getBestMovesList('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

console.log(stockypoo.getMoveList());

const game = new ChessGame(12, 21);
game.loadFen('rnbqkbnr/ppppp2p/8/5Pp1/8/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2');
await stockypoo.callStockfish(game.getFen());
await stockypoo.getBestMovesList(game.getFen());
console.log(stockypoo.getMoveList());
console.log(stockypoo.getMove());
console.log(game.getMoves());
console.log(game.matchMoves(stockypoo.getMove()));
game.make_move(game.matchMoves(stockypoo.getMove()), Colors.White);
console.log(game.getFen());
console.log(game.getReasonForGameEnd());
console.log(game.checkIfCheckmate());
// let move = game.matchMoves(stockypoo.getMove().slice(2, 3));
// console.log(game.getMoves());
// console.log(game.make_move(move, Colors.White));
// console.log(game.getFen());
// await stockypoo.callStockfish(game.getFen());
// console.log(stockypoo.getMove());
// move = game.matchMoves(stockypoo.getMove().slice(2, 3));
// console.log(game.getMoves());
// console.log(game.make_move(move, Colors.Black));
// console.log(game.getFen());

export default CallStockfish;
