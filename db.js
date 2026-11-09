import mysql from 'mysql2/promise';

const dbPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'threads_co_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default dbPool;