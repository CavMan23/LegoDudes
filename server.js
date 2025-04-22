const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// ✅ CORS fix — allow only requests from localhost:3000
app.use(cors({
  origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
  credentials: true // 👈 This is what was missing!
}));

app.use(express.json());

// PostgreSQL connection setup
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',      // change if needed
  database: 'postgres',  // change if needed
  password: 'password',          // fill in if your DB has one
  port: 5432             // default PostgreSQL port
});

// Route: GET /display
app.get('/display', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventory LIMIT 25;');
    const columns = result.fields.map(f => f.name);
    const rows = result.rows;
    res.json({ columns, rows });
  } catch (err) {
    console.error('Error in /display:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route: POST /truncate
app.post('/truncate', async (req, res) => {
  try {
    await pool.query('TRUNCATE TABLE inventory;');
    res.send('Table truncated successfully');
  } catch (err) {
    console.error('Error in /truncate:', err);
    res.status(500).send(err.message);
  }
});

// Route: POST /insert
app.post('/insert', async (req, res) => {
  try {
    await pool.query(`
      INSERT INTO inventory (productid, productname, price, status, cartid)
      VALUES (999, 'Test Set', 999, 'In Stock', NULL);
    `);
    res.send('Test data inserted successfully');
  } catch (err) {
    console.error('Error in /insert:', err);
    res.status(500).send(err.message);
  }
});

// Start server
app.listen(5050, () => {
  console.log('🚀 Server running at http://localhost:5050');
});
