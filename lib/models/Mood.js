const pool = require('../utils/pool');

module.exports = class Mood {
  id;
  user_id;
  mood;
  date;
  createdAt;

  constructor({ id, user_id, mood, date, created_at }) {
    this.id = id;
    this.user_id = user_id;
    this.mood = mood;
    this.date = date;
    this.createdAt = created_at;
  }

  static async insert({ user_id, mood, date }) {
    const { rows } = await pool.query(
      `
      INSERT INTO moods (user_id, mood, date)
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
      [user_id, mood, date]
    );

    return new Mood(rows[0]);
  }

  static async updateById(id, user_id, attrs) {
    const thisMood = await Mood.getById(id);
    if (!thisMood) return null;
    const { mood, date } = {
      ...thisMood,
      ...attrs,
    };
    const { rows } = await pool.query(
      `
      UPDATE moods 
      SET mood=$3, date=$4
      WHERE id=$1 
      AND user_id=$2
      RETURNING *;
    `,
      [id, user_id, mood, date]
    );
    return new Mood(rows[0]);
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM moods
      WHERE id=$1
    `,
      [id]
    );

    if (!rows[0]) {
      return null;
    }
    return new Mood(rows[0]);
  }

  static async getAll(user_id) {
    const { rows } = await pool.query(
      `
      SELECT * 
      FROM  moods 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `,
      [user_id]
    );
    return rows.map((moods) => new Mood(moods));
  }

  static async delete(id) {
    const { rows } = await pool.query(
      `
      DELETE FROM moods 
      WHERE id = $1 
      RETURNING *
    `,
      [id]
    );
    return new Mood(rows[0]);
  }
};
