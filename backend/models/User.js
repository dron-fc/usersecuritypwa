export default {
async init(db) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('user', 'moderator', 'admin')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
},

  async create(db, { email, password, role = 'user' }) {
    const { lastID } = await db.run(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, password, role]
    );
    return this.findById(db, lastID);
  },

  async findById(db, id) {
    return db.get('SELECT * FROM users WHERE id = ?', [id]);
  },

  async findByEmail(db, email) {
    return db.get('SELECT * FROM users WHERE email = ?', [email]);
  },

  async getAll(db) {
    return db.all('SELECT id, email, role, created_at FROM users');
  }
};
