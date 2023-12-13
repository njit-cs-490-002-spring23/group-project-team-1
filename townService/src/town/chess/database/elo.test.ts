import MatchResult from './elo';

/** To run this file, do
 * npx jest --watch .\elo.test.ts
 * Then hit p
 * then hit enter and let them run.
 */

describe('Elo', () => {
  let testMatch;

  describe('calculate rating change for a match', () => {
    it('correctly calculates the change for a loss', async () => {
      testMatch = new MatchResult();
      const elo1 = 1500;
      const elo2 = 1500;
      testMatch.game_score = 0;
      await expect(testMatch._calculateRatingChange(elo1, elo2)).toEqual(-10);
    });
    it('correctly calculates the change for a tie', async () => {
      testMatch = new MatchResult();
      const elo1 = 1500;
      const elo2 = 1500;
      testMatch.game_score = 0.5;
      await expect(testMatch._calculateRatingChange(elo1, elo2)).toEqual(0);
    });
    it('correctly calculates the change for a win', async () => {
      testMatch = new MatchResult();
      const elo1 = 1500;
      const elo2 = 1500;
      testMatch.game_score = 1;
      await expect(testMatch._calculateRatingChange(elo1, elo2)).toEqual(10);
    });
  });
});
