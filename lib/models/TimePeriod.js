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

  static async getALL() {
    const { rows } = await pool.query(`
    SELECT * FROM time_periods`);
    return rows.map((row) => new TimePeriod(row));
  }
};
