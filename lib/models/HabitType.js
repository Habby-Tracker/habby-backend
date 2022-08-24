const pool = require('../utils/pool');

module.exports = class HabitType {
  id;
  name;

  constructor({ 
    id,
    name
  }) {
    this.id = id; 
    this.name = name;  
  }

  static async getAll(){
    const { rows } = await pool.query('SELECT * FROM habit_types');
    return rows.map(row => new HabitType(row));
  }
};
