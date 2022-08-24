const pool = require('../utils/pool');
module.exports = class Status {
  id;
  name;

  constructor({ id, name }) {
    this.id = id;
    this.name = name;
  }

  static async getAll(){
    const { rows } = await pool.query('SELECT * FROM status');
    return rows.map(row => new Status(row));
  }
};


