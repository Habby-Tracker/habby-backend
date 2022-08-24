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

  static async getAll(){
    const { rows } = await pool.query(`
    SELECT * 
    FROM categories
    `);
    return rows.map(row => new Category(row));
  }
};
