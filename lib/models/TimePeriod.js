const pool = require('../utils/pool');

module.exports = class TimePeriod {
  id;
  name;
  day_count;
  week_count;
  month_count;

  constructor({ id, name, day_count, week_count, month_count }) {
    this.id = id;
    this.name = name;
    this.dayCount = day_count;
    this.weekCount = week_count;
    this.monthCount = month_count;
  }

  static async getAll() {
    const { rows } = await pool.query(`
    SELECT * FROM time_periods`);
    return rows.map((row) => new TimePeriod(row));
  }

  static async getById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM time_periods WHERE id=$1',
      [id]
    );
    if (!rows[0]) {
      return null;
    }
    return new TimePeriod(rows[0]);
  }
};

