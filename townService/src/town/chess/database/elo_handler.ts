import MatchResult from './elo';

let match;

export default class EloHandler {
  static async initialize(req, res) {
    if (req.query.user1 && req.query.user2 && req.query.score)
      match = new MatchResult(req.query.user1, req.query.user2, req.query.score);
    if (match) {
      const response = { message: 'Initialized match' };
      res.json(response);
    }
  }

  static async eloUpdate(req, res) {
    const filler = req;
    try {
      match.updateElo();
      const response = { message: 'Updated ELOs' };
      res.json(response);
    } catch (err) {
      const response = { message: 'Could not update ELOs' };
      res.json(response);
    }
  }

  static async eloGetLeaderboard(req, res) {
    const filler = req;
    try {
      MatchResult.leaderboardElo();
      const response = { message: 'Returned leaderboard' };
      res.json(response);
    } catch (err) {
      const response = { message: 'Could not return leaderboard' };
      res.json(response);
    }
  }
}
