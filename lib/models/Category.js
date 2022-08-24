const pool = require('../utils/pool');

module.exports = class Category {
  id;
  name;
  defaultIcon;
  user_id;

  constructor({ id, name, default_icon, user_id }) {
    this.id = id;
    this.name = name;
    this.defaultIcon = default_icon;
    this.user_id = user_id;
  }

  static async getAll(user_id){
    const { rows } = await pool.query(`
    SELECT * 
    FROM categories
    WHERE user_id=$1
    `, [user_id]);
    return rows.map(row => new Category(row));
  }

  static async insert({ name, defaultIcon, user_id }) {
    const { rows } = await pool.query(`
    INSERT INTO categories (user_id, name, default_icon)
    VALUES ($1, $2, $3)
    RETURNING *;
  `, [user_id, name, defaultIcon]);
    return new Category(rows[0]);
  }

  static async delete(id){
    const { rows } = await pool.query(`
    DELETE FROM categories
    WHERE id=$1
    RETURNING *
    `, [id]);
    return new Category(rows[0]);
  }

};

//small change


