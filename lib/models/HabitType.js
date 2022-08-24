const pool = require('../utils/pool');

module.exports = class Habit {
  id;
  name;

  constructor({ 
    id,
    name
  }) {
    this.id = id; 
    this.name = name;  
  }

  static async getAll(user_id) {
    const { rows } = await pool.query(
      `
      SELECT * 
      FROM  habit_types 
      WHERE user_id = $1 
      ORDER BY due_date DESC
    `,
      [user_id]
    );
    return rows.map((habit) => new Habit(habit));
  }
};
