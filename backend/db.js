const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./trustlend.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idNumber TEXT,
    score INTEGER,
    approved INTEGER
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idNumber TEXT,
    recharge INTEGER,
    utilityScore INTEGER,
    upiUsage TEXT,
    occupation TEXT,
    missedPayments INTEGER
  )`);

  // Insert dummy users if table is empty
  db.get(`SELECT COUNT(*) as count FROM users`, (err, row) => {
    if (row && row.count === 0) {
      const stmt = db.prepare(`INSERT INTO users (idNumber, recharge, utilityScore, upiUsage, occupation, missedPayments)
        VALUES (?, ?, ?, ?, ?, ?)`);
      stmt.run('ABCDE1234F', 300, 4, 'yes', 'salaried', 1);
      stmt.run('PQRS5678K', 500, 5, 'no', 'self-employed', 0);
      stmt.finalize();
      console.log('✅ Inserted dummy users into database.');
    }
  });
});

// Save new user
function saveUser(user) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users (idNumber, recharge, utilityScore, upiUsage, occupation, missedPayments)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user.idNumber, user.recharge, user.utilityScore, user.upiUsage, user.occupation, user.missedPayments],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

// Get user by idNumber
function getUserByIdNumber(idNumber) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users WHERE idNumber = ?`, [idNumber], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Save loan
function saveLoan(user, score, approved) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO loans (idNumber, score, approved) VALUES (?, ?, ?)`,
      [user.idNumber, score, approved ? 1 : 0],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
}

// Get loan by ID
function getLoan(id) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM loans WHERE id=?`, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

module.exports = { saveLoan, getLoan, saveUser, getUserByIdNumber };
