const pool = require('../utils/pool');

module.exports = class Goal {
  id;
  user_id;
  goal_category_id;
  goal_name;
  time_period_id;
  habit_type_id;
  default_habit_name;
  status_id;
  created_at;

  constructor({ 
    id, 
    user_id, 
    goalCategoryID, 
    goalName, 
    timePeriodID, 
    habitTypeID, 
    habitName, 
    statusID, 
    created_at
  }) {
    this.id = id;
    this.user_id = user_id;
    this.goal_category_id = goalCategoryID;
    this.goal_name = goalName;
    this.time_period_id = timePeriodID;
    this.habit_type_id = habitTypeID;
    this.default_habit_name = habitName;
    this.status_id = statusID;
    this.created_at = created_at;
  }

  static async insert({ user_id, goal_category_id, goal_name, time_period_id, habit_type_id, default_habit_name, status_id }) {
    const { rows } = await pool.query(
      `
      INSERT INTO goals (user_id, goal_category_id, goal_name, time_period_id, habit_type_id, default_habit_name, status_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `,
      [user_id, goal_category_id, goal_name, time_period_id, habit_type_id, default_habit_name, status_id]
    );

    return new Goal(rows[0]);
  }

  static async updateById(id, user_id, attrs) {
    const goal = await Goal.getById(id);
    if (!goal) return null;
    const { goal_category_id, goal_name, default_habit_name, status_id } = { ...goal, ...attrs };
    const { rows } = await pool.query(
      `
      UPDATE goals 
      SET    goal_category_id = $3, goal_name=$4, default_habit_name=$5, status_id=$6
      WHERE  id=$1 
      AND    user_id=$2
      RETURNING *;
    `,
      [id, user_id, goal_category_id, goal_name, default_habit_name, status_id]
    );
    return new Goal(rows[0]);
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM   goals
      WHERE  id=$1
    `,
      [id]
    );

    if (!rows[0]) {
      return null;
    }
    return new Goal(rows[0]);
  }

  static async getAll(user_id) {
    const { rows } = await pool.query(
      `
      SELECT * 
      FROM  goals 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `,
      [user_id]
    );
    return rows.map((row) => new Goal(row));
  }

  static async delete(id) {
    const { rows } = await pool.query(
      `
      DELETE FROM goals 
      WHERE id = $1 
      RETURNING *
    `,
      [id]
    );
    return new Goal(rows[0]);
  }
};
