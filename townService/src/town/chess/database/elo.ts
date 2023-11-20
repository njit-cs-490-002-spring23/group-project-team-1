import { Database } from "./database";

class MatchResult {
  // kmw: Currently decided to make it compare Player1 vs Player2 in that order
  // ex: Player1 vs Player2, if player
  // (win = 1, draw = 0.5, loss = 0)
  player1_user: string;

  player2_user: string;

  game_score: number;

  database = new Database;

  // kmw: Making the assumption that we have already assigned the associated elo ratings and passed the result of the game
  constructor(userPlayer1: string, userPlayer2: string, score: number) {
    this.player1_user = userPlayer1;
    this.player2_user = userPlayer2;
    this.game_score = score;
  }

  // Everything is const because ESLint is a crybaby and we haven't connected to a database yet, jeez man like get over yourself
  updateElo() {
    // kmw: will need to grab elo's from database, leaving it at 1500 for now
    const oldEloPlayer1 = 1500;
    const oldEloPlayer2 = 1500;
    // let newEloPlayer1: number;
    // let newEloPlayer2: number;

    // kmw: k-factor is a weird one, leaving it at 20 for now since it can technically change but for the scope of this project maybe leave it like this
    const kFactor = 20;
    const ratio: number = Math.abs(oldEloPlayer2 - oldEloPlayer1) / 400;

    const expectedScore = 1 / (10 ** ratio + 1);
    const ratingChange = kFactor * (this.game_score - expectedScore);

    const newEloPlayer1 = oldEloPlayer1 + ratingChange;
    const newEloPlayer2 = oldEloPlayer2 - ratingChange;
  }
}

let result = new MatchResult("Deep Blue", "Deep Blue", 0);
let elo = result.database.db_getELO("Deep Blue");
console.log(elo);


