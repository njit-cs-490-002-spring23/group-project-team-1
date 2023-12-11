import Database from './database';

let db;

export default class DatabaseHandler {
  static async initialize(req, res) {
    const filler = req;
    db = new Database();
    if (db) {
      const response = { message: 'Initialized database' };
      res.json(response);
    }
  }

  static async databaseClose(req, res) {
    const filler = req;
    try {
      db.dbClose();
      const response = { message: 'Closed database' };
      res.json(response);
    } catch (err) {
      const response = { message: 'Could not close database' };
      res.json(response);
    }
  }

  static async databaseGetELO(req, res) {
    const grabbedELO: number = await db.db_getELO(req.query.user);
    if (typeof grabbedELO === 'number') {
      const response = { message: 'Returned number' };
      res.json(response);
    }
  }

  static async databaseSetELO(req, res) {
    try {
      db.db_setELO(req.query.user, req.query.newELO);
      const response = { message: 'Set ELO' };
      res.json(response);
    } catch (err) {
      const response = { message: 'Could not set ELO' };
      res.json(response);
    }
  }

  static async databaseGetAll(req, res) {
    const filler = req;
    const output: { [username: string]: any } | null = await db.db_getAllELO();
    if (output) {
      const response = { message: 'Returned output' };
      res.json(response);
    }
  }
}
