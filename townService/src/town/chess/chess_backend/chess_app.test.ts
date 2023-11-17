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
  const whiteID = 123;
  const blackID = 321;
  beforeEach(() => {
    game = new ChessGame(whiteID, blackID);
  });
  describe('Initalize Game', () => {
    it('Adds the players IDs to the respective colors.', () => {
      expect(game.white_id).toEqual(123);
      expect(game.black_id).toEqual(321);
    });
    it('Initalizes the game ID to a value', () => {
      expect(game.gameID).toBeGreaterThan(0);
    });
    it('Didnt initialize a custom timer value', () => {
      expect(game.timer).toEqual(999999);
    });
    it('Didnt assign a winner.', () => {
      expect(game.winner).toEqual(-1);
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
  });
});
