import CallStockfish from './stockfish';

// eslint-disable-next-line @typescript-eslint/naming-convention
let Stockfish;

export default class StockfishHandler {
  /**
   * POST. Initialize stockfish object. http://localhost:5757/stockfishinit/3000
   * @param req HTTP Request containing ELO value for stockfish.
   * @param res JSON response confirming creation.
   */
  static async initialize(req, res) {
    const { elo } = req.params;
    console.log('in init');
    console.log(elo);
    let response;
    Stockfish = new CallStockfish(elo);
    console.log('init');
    if (Stockfish) response = { status: 200, message: 'Stockfish Initialized', stockfish_elo: elo };
    else response = { status: 400, message: 'Failed' };

    res.json(response);
  }

  /**
   * GET. Get stockfish best move. http://localhost:5757/stockfishmove
   * @param req FEN string for stockfish to analyze passed as JSON. EX: { fen: FEN_STRING }
   * @param res JSON containing stockfish move, use .move
   */
  static async getBestMove(req, res) {
    console.log('Stockfish Here');
    const { fen } = req.body.data;
    console.log(req.body);
    console.log(fen);
    await Stockfish.callStockfish(fen);
    console.log(`StockFish Get Move ${Stockfish.getMove()}`);
    const response = { move: Stockfish.getMove() };
    res.json(response);
  }

  /**
   * GET. Get stockfish best move list. http://localhost:5757/stockfishlist
   * @param req FEN string for stockfish to analyze passed as JSON. EX: { fen: FEN_STRING }
   * @param res JSON containing stockfish move list, use .moveList
   */
  static async getBestMoveList(req, res) {
    const { fen } = req.body;
    await Stockfish.getBestMovesList(fen);
    const response = { moveList: Stockfish.getMoveList() };
    res.json(response);
  }
}
