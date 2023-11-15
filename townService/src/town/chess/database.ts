class Elo {

    //kmw: Currently decided to make it compare Player1 vs Player2 in that order
    //ex: Player1 vs Player2, if player
    //(win = 1, draw = 0.5, loss = 0)
    player1_user: string;
    player2_user: string;
    game_score: number;

    //kmw: Making the assumption that we have already assigned the associated elo ratings and passed the result of the game
    constructor(userPlayer1: string, userPlayer2: string, score: number) {
        this.player1_user = userPlayer1;
        this.player2_user = userPlayer2;
        this.game_score = score;
    }

    updateElo() {
        //kmw: will need to grab elo's from database, leaving it at 1500 for now
        let old_eloPlayer1: number = 1500;
        let old_eloPlayer2: number = 1500;
        let new_eloPlayer1: number;
        let new_eloPlayer2: number;

        //kmw: k-factor is a weird one, leaving it at 20 for now since it can technically change but for the scope of this project maybe leave it like this
        let expectedScore: number;
        let k_factor: number = 20;
        let ratio: number = Math.abs(old_eloPlayer2 - old_eloPlayer1) / 400;

        expectedScore = 1 / ( (10**ratio) + 1);
        let rating_change = k_factor * (this.game_score - expectedScore)

        new_eloPlayer1 = old_eloPlayer1 + rating_change;
        new_eloPlayer2 = old_eloPlayer2 - rating_change;
    }

}