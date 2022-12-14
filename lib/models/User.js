const bcrypt = require('bcrypt');
const HttpError = require('../utils/httpError.js');
const pool = require('../utils/pool');

module.exports = class User {
  id;
  firstName;
  lastName;
  email;
  avatar;
  createdAt;
  #passwordHash;

  constructor({
    id,
    first_name,
    last_name,
    email,
    password_hash,
    avatar,
    created_at,
  }) {
    this.id = id;
    this.firstName = first_name;
    this.lastName = last_name;
    this.email = email;
    this.avatar = avatar;
    this.createdAt = created_at;
    this.#passwordHash = password_hash;
  }

  static async insert({ firstName, lastName, email, password, avatar }) {
    if (email.length <= 6) {
      throw new Error('Invalid email');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    try {
      const { rows } = await pool.query(
        `
        INSERT INTO users (first_name, last_name, email, password_hash, avatar)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
        [firstName, lastName, email, passwordHash, avatar]
      );

      return new User(rows[0]);
    } catch (err) {
      //error code incase more than one user has the same email
      if (err.code === '23505') {
        throw new HttpError('Email already exists', 400);
      }
      throw err;
    }
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM users');

    return rows.map((row) => new User(row));
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM users
      WHERE id=$1
      `,
      [id]
    );
    return new User(rows[0]);
  }

  static async getByEmail(email) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email=$1
      `,
      [email]
    );

    if (!rows[0]) return null;

    return new User(rows[0]);
  }

  static async updateByEmail(first_name, last_name, email) {
    const { rows } = await pool.query(
      `
      UPDATE users
      SET first_name=$1, last_name=$2
      WHERE email=$3
      RETURNING *
      `,
      [first_name, last_name, email]
    );
    return new User(rows[0]);
  }

  async isValidPassword(password) {
    return await bcrypt.compare(password, this.#passwordHash);
  }
};
