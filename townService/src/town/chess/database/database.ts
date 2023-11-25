import mysql, { Connection, RowDataPacket } from 'mysql2';

/**
 * Database class that handles the connections with the database and reading/updating.
 */
class Database {
  private _db: Connection;

  private _defaultELO = 1500;

  constructor() {
    this._db = this._dbConnect();
  }

  /**
   * Opens connection with local database. Called at initialization of a new Database object.
   * @returns The connection of type Connection used for queries.
   */
  private _dbConnect() {
    if (this._db) {
      console.log('Error!');
    }
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'coveytown',
      database: 'chesselo',
    });
    return connection;
  }

  /**
   * Closes connection with local database. Called at the end of each method that viewed/updated the database.
   * @param connection The connection of type Connection that we are closing.
   */
  dbClose() {
    this._db.end();
  }

  /**
   * Returns the ELO of a given Username in the database. Called for the purpose of displaying ELO and for match result calculations.
   * If the Username is not present in the database, inserts that Username and the default ELO.
   * Must be called with await before function call.
   * @param playerName Username of the player of type string.
   * @returns ELO of type number.
   */
  async db_getELO(playerName: string) {
    let result;

    try {
      result = await this._db
        .promise()
        .query<RowDataPacket[]>(`SELECT ELO FROM player_elo WHERE Username = '${playerName}'`);
    } catch (error) {
      console.log(error);
      return null;
    }

    if (result[0][0] === undefined) {
      this.db_setELO(playerName, this._defaultELO);
      return this._defaultELO;
    }
    const output = result[0][0].ELO;
    return output;
  }

  /**
   * Inserts or updates the ELO of a given Username in the database.
   * @param playerName Username of the player of type string.
   * @param playerELO ELO of type number.
   */
  async db_setELO(playerName: string, playerELO: number) {
    try {
      await this._db.promise()
        .query(`INSERT INTO player_elo (Username, ELO) VALUES ('${playerName}', ${playerELO})
      ON DUPLICATE KEY UPDATE Username = '${playerName}' , ELO = ${playerELO}`);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Returns a dictionary of the top ten players based on their ELO score.
   * Must be called with await before function call.
   * @returns Dictionary with key being the username (type string) and value being the ELO (type any)
   */
  async db_getAllELO() {
    let result;
    const output: { [username: string]: any } = {};
    try {
      result = await this._db
        .promise()
        .query<RowDataPacket[]>('SELECT * FROM player_elo ORDER BY ELO DESC LIMIT 10');
    } catch (error) {
      return null;
    }

    for (let i = 0; i < 10; i++) {
      try {
        output[result[0][i].Username] = result[0][i].ELO;
      } catch (error) {
        break;
      }
    }
    return output;
  }
}

export default Database;
