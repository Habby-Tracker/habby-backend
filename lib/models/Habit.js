const pool = require('../utils/pool');

module.exports = class Habit {
  id;
  user_id;
  goalID;
  habitName;
  statusID;
  dueDate;
  completedDate;

  constructor({ 
    id,
    user_id,
    goal_id,
    habit_name,
    status_id,
    due_date,
    completed_date
  }) {
    this.id = id; 
    this.user_id = user_id; 
    this.goalID = goal_id; 
    this.habitName = habit_name; 
    this.statusID = status_id; 
    this.dueDate = due_date; 
    this.completedDate = completed_date; 
  }

  static async insert({ goalID, user_id, habitName, statusID, dueDate, completedDate }) {
    const { rows } = await pool.query(
      `
      INSERT INTO habits (goal_id, user_id, habit_name, status_id, due_date, completed_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `,
      [goalID, user_id, habitName, statusID, dueDate, completedDate]
    );

    return new Habit(rows[0]);
  }

  static async updateById(id, user_id, attrs) {
    const habit = await Habit.getById(id);
    if (!habit) return null;
    const { goalID, habitName, statusID, dueDate, completedDate } = { ...habit, ...attrs };
    const { rows } = await pool.query(
      `
      UPDATE habits 
      SET    goal_id=$3, habit_name=$4, status_id=$5, due_date=$6, completed_date=$7
      WHERE  id=$1 
      AND    user_id=$2
      RETURNING *;
    `,
      [id, user_id, goalID, habitName, statusID, dueDate, completedDate]
    );
    return new Habit(rows[0]);
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM   habits
      WHERE  id=$1
    `,
      [id]
    );

    if (!rows[0]) {
      return null;
    }
    return new Habit(rows[0]);
  }

  static async getAll(user_id) {
    const { rows } = await pool.query(
      `
      SELECT * 
      FROM  habits 
      WHERE user_id = $1 
      ORDER BY due_date DESC
    `,
      [user_id]
    );
    return rows.map((habit) => new Habit(habit));
  }

  static async delete(id) {
    const { rows } = await pool.query(
      `
      DELETE FROM habits 
      WHERE id = $1 
      RETURNING *
    `,
      [id]
    );
    return new Habit(rows[0]);
  }
};

