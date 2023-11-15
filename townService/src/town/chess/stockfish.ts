import fetch from 'node-fetch';

class CallStockfish {
  private _elo: number;

  private _move: string;

  private _moveList: string[];

  constructor(ELO_VALUE: number) {
    this._elo = ELO_VALUE;
    this.setElo();
    this._move = '';
    this._moveList = [];
  }

  public setElo() {
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
        console.log('something is wrong');
        return {
          status: 400,
        };
      })
      .then(jsonResponse => {
        // Log the response data in the console
        console.log(jsonResponse);
      })
      .catch(err => console.error(err));
  }

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

  public getMove() {
    return this._move;
  }

  public getMoveList() {
    return this._moveList;
  }
}

const stockypoo = new CallStockfish(3000);
await stockypoo.callStockfish('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

console.log(stockypoo.getMove());

await stockypoo.getBestMovesList('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

console.log(stockypoo.getMoveList());

export default CallStockfish;
