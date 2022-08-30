const pool = require('../utils/pool');

module.exports = class Goal {
  id;
  user_id;
  goalCategoryID;
  goalName;
  timePeriodID;
  habitTypeID;
  habitName;
  statusID;
  status;
  createdAt;

  constructor({
    id,
    user_id,
    goal_category_id,
    goal_name,
    time_period_id,
    habit_type_id,
    default_habit_name,
    status_id,
    status,
    created_at,
  }) {
    this.id = id;
    this.user_id = user_id;
    this.goalCategoryID = goal_category_id;
    this.goalName = goal_name;
    this.timePeriodID = time_period_id;
    this.habitTypeID = habit_type_id;
    this.habitName = default_habit_name;
    this.statusID = status_id;
    this.status = status;
    this.createdAt = created_at;
  }

  static async insert({
    goalCategoryID,
    goalName,
    timePeriodID,
    habitTypeID,
    habitName,
    statusID,
    user_id,
  }) {
    const { rows } = await pool.query(
      `
      INSERT INTO goals (user_id, goal_category_id, goal_name, time_period_id, habit_type_id, default_habit_name, status_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `,
      [
        user_id,
        goalCategoryID,
        goalName,
        timePeriodID,
        habitTypeID,
        habitName,
        statusID,
      ]
    );

    return new Goal(rows[0]);
  }

  static async updateById(id, user_id, attrs) {
    const goal = await Goal.getById(id);
    if (!goal) return null;
    const { goalCategoryID, goalName, habitName, statusID } = {
      ...goal,
      ...attrs,
    };
    const { rows } = await pool.query(
      `
      UPDATE goals 
      SET    goal_category_id = $3, goal_name=$4, default_habit_name=$5, status_id=$6
      WHERE  id=$1 
      AND    user_id=$2
      RETURNING *;
    `,
      [id, user_id, goalCategoryID, goalName, habitName, statusID]
    );
    return new Goal(rows[0]);
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT goals.*, status.name as status
      FROM   goals
      LEFT JOIN status on status.id = goals.status_id
      WHERE goals.id=$1
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
      SELECT goals.*, status.name as status
      FROM  goals
      LEFT JOIN status on status.id = goals.status_id
      WHERE goals.user_id = $1 
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
