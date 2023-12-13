/* eslint-disable import/no-duplicates */
import ChessGame from './chess_app';
import { Colors } from './chess_app';

/** To run this file, do
 * npx jest --watch .\chess_app.test.ts
 * Then hit p
 * then hit enter and let them run.
 */

describe('Chess Game', () => {
  let game: ChessGame;
  const whiteID = '123';
  const blackID = '321';
  beforeEach(() => {
    game = new ChessGame(whiteID, blackID);
  });
  describe('Initalize Game', () => {
    it('Adds the players IDs to the respective colors.', () => {
      expect(game.white_id).toEqual('123');
      expect(game.black_id).toEqual('321');
    });
    it('Initalizes the game ID to a value', () => {
      expect(game.gameID).toBeGreaterThan(0);
    });
    it('Didnt initialize a custom timer value', () => {
      expect(game.timer).toEqual(999999);
    });
    it('Didnt assign a winner.', () => {
      expect(game.winner).toEqual('-1');
    });
  });

  describe('Make a move', () => {
    const move = 'e4';
    it('Successfully make the move and returns the correct FEN', () => {
      expect(game.make_move(move, Colors.White)).toEqual(game.getFen());
      expect(game.getFen()).toEqual('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1');
    });
    it('Inserts the move into the History', () => {
      game.make_move(move, Colors.White);
      expect(game.getHistory()).toEqual({
        e4: game.getFen(),
      });
      expect(game.getHistory()[move]).toEqual(game.getFen());
    });
    it('Increments to the next turn', () => {
      game.make_move(move, Colors.White);
      expect(game.getTurn()).toEqual(Colors.Black);
    });
    it('Doesnt end the game', () => {
      game.make_move(move, Colors.White);
      expect(game.getReasonForGameEnd()).toEqual('Not Over');
    });
    it('Puts the piece onto the move square', () => {
      expect(game.getPieceOnSquare('e2')).toEqual({ type: 'p', color: 'w' });
      game.make_move(move, Colors.White);
      expect(game.getPieceOnSquare('e2')).toEqual(false);
      expect(game.getPieceOnSquare('e4')).toEqual({ type: 'p', color: 'w' });
    });
    it('Doesnt cause a checkmate', () => {
      game.make_move(move, Colors.White);
      expect(game.checkIfCheckmate()).toEqual(false);
    });
  });

  describe('Load back to old history state', () => {
    it('Loads the board', () => {
      const prevFen = game.make_move('e4', Colors.White);
      game.make_move('e5', Colors.Black);
      expect(game.getFen()).toEqual('rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2');
      game.loadFen(prevFen);
      expect(game.getFen()).toEqual(prevFen);
    });
    it('Actually sets the pieces', () => {
      const prevFen = game.make_move('e4', Colors.White);
      game.make_move('e5', Colors.Black);
      expect(game.getPieceOnSquare('e4')).toEqual({ type: 'p', color: 'w' });
      expect(game.getPieceOnSquare('e5')).toEqual({ type: 'p', color: 'b' });
      expect(game.getFen()).toEqual('rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2');
      game.loadFen(prevFen);
      expect(game.getFen()).toEqual(prevFen);
      expect(game.getPieceOnSquare('e4')).toEqual({ type: 'p', color: 'w' });
      expect(game.getPieceOnSquare('e7')).toEqual({ type: 'p', color: 'b' });
      expect(game.getPieceOnSquare('e5')).toEqual(false);
      expect(game.getPieceOnSquare('e2')).toEqual(false);
    });
  });

  describe('Concede', () => {
    it('Sets the winner', () => {
      expect(game.winner).toEqual('-1');
      game.concede(Colors.White);
      expect(game.winner).toEqual(game.black_id);
    });
    it('Ends the game', () => {
      expect(game.winner).toEqual('-1');
      game.concede(Colors.White);
      expect(game.winner).toEqual(game.black_id);
      expect(game.make_move('e4', Colors.White)).toEqual('Error');
      expect(game.getReasonForGameEnd()).toEqual('Concede');
    });
  });

  describe('Match Moves', () => {
    it('Matches a basic move', () => {
      expect(game.matchMoves('e4')).toEqual('e4');
      expect(game.matchMoves('Nc3')).toEqual('Nc3');
    });
    it('Matches a Check move', () => {
      game.loadFen('rnbqkbnr/ppppp1pp/8/5p2/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2');
      expect(game.matchMoves('Qh5')).toEqual('Qh5+');
    });
    it('Matches Checkmate Move', () => {
      game.loadFen('rnbqkbnr/ppppp2p/8/5Pp1/8/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2');
      expect(game.matchMoves('Qh5')).toEqual('Qh5#');
      game.make_move(game.matchMoves('Qh5'), Colors.White);
      expect(game.checkIfCheckmate()).toEqual(true);
      expect(game.winner).toEqual(game.white_id);
    });
    it('Matches King Side Castling', () => {
      game.loadFen('rn2kbnr/pppbpppp/8/q2p4/4P3/5N2/PPPPBPPP/RNBQK2R w KQkq - 1 2');
      expect(game.matchMoves('O-O')).toEqual('O-O');
      game.make_move('O-O', Colors.White);
      expect(game.getPieceOnSquare('g1')?.type).toEqual('k');
    });
    it('Matches Queen Side Castling', () => {
      game.loadFen('r3kbnr/pppbpppp/n7/q2p4/4P3/3P1N2/PPP1BPPP/RNBQ1RK1 b KQkq - 1 2');
      console.log(game.getMoves());
      console.log(game.matchMoves('Qa2'));
      expect(game.matchMoves('O-O-O')).toEqual('O-O-O');
      game.make_move('O-O-O', Colors.Black);
      expect(game.getPieceOnSquare('c8')?.type).toEqual('k');
    });
    it('Matches Pawn Moves with capture', () => {
      game.loadFen('r3kbnr/pppbpppp/n7/q2p4/4P3/3P1N2/PPP1BPPP/RNBQ1RK1 b KQkq - 1 2');
      expect(game.matchMoves('d5e4')).toEqual('dxe4');
      game.make_move(game.matchMoves('d5e4'), Colors.Black);
      expect(game.getPieceOnSquare('e4')?.color).toEqual('b');
    });
  });
});
