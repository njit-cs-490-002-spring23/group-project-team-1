import ChessGame, { Colors } from './chess_app';

let game;

/**
 * Class to make calls to Chess Backend
 */
export default class ChessHandler {
  /**
   * POST. To initialize a chess game. http://localhost:5757/initialize?player1=1&player2=2
   * @param req HTTP Request containing ID of player 1 and 2, and optional timer.
   * @param res JSON response containing starting FEN position and message if good.
   */
  static async initialize(req, res) {
    if (req.query.player1 && req.query.player2)
      if (req.query.timer)
        game = new ChessGame(req.query.player1, req.query.player2, req.query.timer);
      else game = new ChessGame(req.query.player1, req.query.player2);
    if (game) {
      const response = { message: 'Good!', fen: game.getFen() };
      res.json(response);
    }
  }

  /**
   * GET. To get the current board fen string. http://localhost:5757/fen
   * @param req HTTP Request
   * @param res JSON response, accessing from .fen
   */
  static async getFen(req, res) {
    const filler = req;
    const response = {
      fen: game.getFen(),
    };
    res.json(response);
  }

  /**
   * POST. Make a move on chessboard. http://localhost:5757/move/e4?color=w
   * @param req HTTP Request from paramaters /move/:move, and query ?color=
   * @param res JSON Response, contains new fen.
   */
  static async makeMove(req, res) {
    console.log(game.getMoves());
    console.log(`req.params.move = ${req.params.move}`);
    console.log(`req.query.color = ${req.query.color}`);
    if (req.params.move && req.query.color) {
      if (req.query.color === 'w') game.make_move(game.matchMoves(req.params.move), Colors.White);
      else if (req.query.color === 'b')
        game.make_move(game.matchMoves(req.params.move), Colors.Black);
      else {
        res.json({ error: 'Please provide a color' });
      }
    }
    const response = {
      code: 200,
      fen: game.getFen(),
    };
    res.json(response);
  }

  /**
   * GET. Get History of chess game moves. http://localhost:5757/history
   * @param req HTTP Request
   * @param res JSON Response containing history of moves and their FEN strings.
   */
  static async getHistory(req, res) {
    const filler = req;
    const response = {
      code: 200,
      history: game.getHistory(),
    };
    res.json(response);
  }

  /**
   * GET. Get current colors turn. http://localhost:5757/turn
   * @param req HTTP Request
   * @param res JSON response with color of who's turn it is. 'w' = white, 'b' = black
   */
  static async getTurn(req, res) {
    const filler = req;
    const response = {
      code: 200,
      turn: game.getTurn(),
    };
    res.json(response);
  }

  /**
   * POST. Load specific FEN string. http://localhost:5757/load
   * @param req JSON Request, follow format: { fen: 'FEN STRING' } for sending post request.
   * @param res JSON response containing, prevFen and newFen if successful.
   */
  static async loadFen(req, res) {
    const oldFen = game.getFen();
    let response;
    console.log(`Req body fen: ${req.body.fen}`);
    if (game.loadFen(req.body.fen))
      response = { code: 200, prevFen: oldFen, newFen: game.getFen() };
    else response = { code: 400, message: 'Failed to load new fen.', prevFen: oldFen };
    res.json(response);
  }

  /**
   * GET. Get reason for game ending. http://localhost:5757/reason
   * @param req HTTP Request
   * @param res JSON Response. Use .reason
   */
  static async getReason(req, res) {
    const filler = req;
    const response = { reason: game.getReasonForGameEnd() };
    res.json(response);
  }

  /**
   * GET. Get info of piece on certain square. http://localhost:5757/piece/b8
   * @param req HTTP parameter request containing square to be checked.
   * @param res JSON response with info of piece on square.
   */
  static async pieceOnSquare(req, res) {
    const { square } = req.params;
    const pieceInfo = game.getPieceOnSquare(square);
    const response = { piece: pieceInfo.type, color: pieceInfo.color };
    res.json(response);
  }

  /**
   * GET. Gets list of current possible moves. http://localhost:5757/moves
   * @param req HTTP request
   * @param res JSON response containing list of moves.
   */
  static async getMoves(req, res) {
    const filler = req;
    const response = { moves: game.getMoves() };
    res.json(response);
  }

  /**
   * GET. Checks if there is a checkmate. http://localhost:5757/checkmate
   * @param req HTTP Request
   * @param res JSON response containing if there is a checkmate or not.
   */
  static async checkCheckmate(req, res) {
    const filler = req;
    const response = { checkmate: game.checkIfCheckmate() };
    res.json(response);
  }

  /**
   * POST. To allow a player to concede the game. http://localhost:5757/concede/w
   * @param req Color of conceding player.
   * @param res JSON response with the winner's ID.
   */
  static async concede(req, res) {
    let concedingPlayer;
    if (req.params.color === 'w' || req.params.color === 'white') concedingPlayer = Colors.White;
    else concedingPlayer = Colors.Black;
    game.concede(concedingPlayer);
    const response = { winner: game.winner };
    res.json(response);
  }

  /**
   * GET. Returns the winners ID and color, if a winner exists. http://localhost:5757/winner
   * @param req HTTP Request.
   * @param res JSON Response containing the winner's ID (.winner), and winnerColor (.winnerColor)
   */
  static async winner(req, res) {
    const filler = req;
    let response;
    if (game.winner === -1) {
      response = { winner: null, winnerColor: null };
      res.json(response);
      return;
    }
    const winnerID = game.winner;
    const winnersColor = game.winner.white_id === winnerID ? Colors.White : Colors.Black;
    response = { winner: winnerID, winnerColor: winnersColor };
    res.json(response);
  }
}
