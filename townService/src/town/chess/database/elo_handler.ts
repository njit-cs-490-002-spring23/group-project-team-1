import MatchResult from './elo';

let match;

export default class EloHandler {
  static async eloInitialize(req, res) {
    const filler = req;
    match = new MatchResult();
    if (match) {
      const response = { message: 'Initialized Match Result object' };
      res.json(response);
    }
  }

  static async eloAddToList(req, res) {
    console.log(req.body);
    match.addToList(req.body.username);
    if (match) {
      const response = {
        message: 'Added to Username List',
        // eslint-disable-next-line no-unneeded-ternary
        arraySet: match.player1_user ? true : false,
      };
      res.json(response);
    }
  }

  static async eloSetScore(req, res) {
    console.log(req.params.score);
    match.setScore(req.params.score);
    if (match) {
      const response = { message: 'Set score' };
      res.json(response);
    }
  }

  static async eloUpdate(req, res) {
    console.log('HERE in ELOUPDATE');
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
      const response = {
        leaderboard: await MatchResult.leaderboardElo(),
        message: 'Returned leaderboard',
      };
      console.log(await MatchResult.leaderboardElo());
      res.json(response);
    } catch (err) {
      const response = { message: 'Could not return leaderboard' };
      res.json(response);
    }
  }
}
