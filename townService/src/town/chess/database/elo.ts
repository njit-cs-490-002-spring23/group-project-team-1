import Database from './database';

export default class MatchResult {
  player1_user: string;

  player2_user: string;

  game_score: number;

  usernameList: string[];

  /**
   * Initializes the MatchResult object.
   * The order in which you initialize the parameters matter. The score is from the perspective of Player 1.
   * {0 = Loss / 0.5 = Draw / 1 = Win}
   * @param userPlayer1 Username of Player 1 of type string.
   * @param userPlayer2 Username of Player 2 of type string.
   * @param score The result in regards to Player 1 {0 = Loss / 0.5 Draw / 1 = Win}.
   */
  constructor() {
    this.player1_user = '';
    this.player2_user = '';
    this.game_score = -1;
    this.usernameList = [];
  }

  addToList(user: string) {
    console.log(user);
    if (!this.usernameList.includes(user) && this.usernameList.length < 2)
      this.usernameList.push(user);

    if (this.usernameList.length === 2) {
      // eslint-disable-next-line prefer-destructuring
      this.player1_user = this.usernameList[0];
      // eslint-disable-next-line prefer-destructuring
      this.player2_user = this.usernameList[1];
    }
  }

  setScore(score: number) {
    this.game_score = score;
  }

  /**
   * Performs the calculations to determine the rating change of both players for a given match result.
   * @param elo1 ELO of player 1.
   * @param elo2 ELO of player 2.
   * @returns Rating Change for both players.
   */
  private _calculateRatingChange(elo1: number, elo2: number): number {
    const kFactor = 20;
    const ratio: number = (elo2 - elo1) / 400;

    const expectedScore = 1 / (10 ** ratio + 1);
    const ratingChange = kFactor * (this.game_score - expectedScore);
    return ratingChange;
  }

  /**
   * Updates the ELO for a given Match Result.
   * Creates a new Database object and calls db_getELO to get the ELO of a particular player.
   * Calls _calculateRatingChange to determine the rating change.
   * Calls db_setELO to set the updated ELO's of both players.
   */
  async updateElo() {
    const database = new Database();
    const oldEloPlayer1: number = await database.db_getELO(this.player1_user);
    const oldEloPlayer2: number = await database.db_getELO(this.player2_user);

    const ratingChange = this._calculateRatingChange(oldEloPlayer1, oldEloPlayer2);
    const newEloPlayer1 = Math.ceil(oldEloPlayer1 + ratingChange);
    const newEloPlayer2 = Math.ceil(oldEloPlayer2 - ratingChange);

    database.db_setELO(this.player1_user, newEloPlayer1);
    database.db_setELO(this.player2_user, newEloPlayer2);

    database.dbClose();
  }

  /**
   * Static method that is called for the purpose of leaderboard functionality.
   * Acts as a mediator function to make the connection to the database and call db_getAllELO.
   * Must be called with await before function call.
   * @returns Dictionary with key being the username (type string) and value being the ELO (type any)
   */
  static async leaderboardElo() {
    const database = new Database();
    const output: { [username: string]: any } | null = await database.db_getAllELO();
    database.dbClose();
    return output;
  }
}
