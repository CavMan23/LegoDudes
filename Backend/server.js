// website used to implement and understand cors: https://medium.com/zero-equals-false/using-cors-in-express-cac7e29b005b 
// discussion that is relevant: https://www.reddit.com/r/javascript/comments/8fcxus/help_on_api_using_express_nodejs_and_sql/ 
// inputting nodejs variable into sql query: https://stackoverflow.com/questions/41168942/how-to-input-a-nodejs-variable-into-an-sql-query 



const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const session = require("express-session");
//const bcrypt = require('bcrypt');
const crypto = require('crypto');

const path = require('path');

const app = express();
const apiRouter = express.Router();


app.use(cors({
  origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
  credentials: true 
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

//session stuff
app.use(session({
  secret: 'mySecretKey', // ⚠️ Put this in .env for production
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    secure: false
  }
}));

// PostgreSQL connection setup
const pool = new Pool({
  host: 'db',
  user: 'myuser',      // change if needed
  database: 'postgres',  // change if needed
  password: 'mypassword',  // fill in if your DB has one
  port: 5432             // default PostgreSQL port
});

app.post('/auth', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Please enter Username and Password!' });
  }

  try {
    
    const user = (await db.query("SELECT * FROM users WHERE username = $1", [username])).rows[0];
    if (!user) return res.status(401).json({ message: "Login failUre" });

    const hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, "sha512").toString("hex");
    if (hash !== user.hash) return res.status(401).json({ message: "Login fAilure"});

    if (user) {
      // Set session object
      req.session.user = {
        id: user.user_id,
        username: user.username,
        role: user.user_status
      };

      return res.json({
        success: true,
        message: 'Logged in successfully',
        user: req.session.user
      });
    } else {
      return res.status(401).json({ success: false, message: 'Incorrect Username and/or Password!' });
    }
  } catch (error) {
    console.error('Error in /auth:', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
});


app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Logout error');
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

app.post("/register", async (req, res) => {

  console.log("server.js: register ");
  const { username, email, password, role } = req.body;

  const ID = Math.floor(Math.random() * 1000000); // random int from 0 to 999999

  console.log(`server.js: register username: ${username}`);
  console.log(`server.js: register email: ${email}`);
  console.log(`server.js: register password: ${password}`);
  console.log(`server.js: register role: ${role}`);

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");

  const query = 'INSERT INTO users (user_id, username, password, email, user_status) VALUES ($1, $2, $3, $4, $5)';
  const values = [ID, username, hash, salt, email, role]; // use the hashed password!
  
  console.log("trying query with these values...");
  console.log(values);

  try {
    const result = await pool.query(query, values);
    console.log("user NOW registered ... going to respond");
    console.log(result);
    res.json({ success: true, message: `${role} account created`, username: `${username}` }); 
  } catch (error) {
    console.log("in catch block of server.js/register");
    console.log(error);
    res.json({ success: false, message: 'Username or email already exists.' });
  }
});

// Route: GET /display
app.get('/display', async (req, res) => {
    const { table, limit } = req.query;
  
    // Validate table name (to prevent SQL injection)
    const allowedTables = ['inventory', 'users', 'orders', 'cart'];
    if (!allowedTables.includes(table)) {
      return res.status(400).json({ error: 'Invalid table name' });
    }
  
    const rowLimit = parseInt(limit) || 25;
  
    try {
      const result = await pool.query(`SELECT * FROM ${table} LIMIT $1`, [rowLimit]);
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
    const { productid, productname, price, status, cartid } = req.body;
  
    try {
      await pool.query(
        `INSERT INTO inventory (productid, productname, price, status, cartid)
         VALUES ($1, $2, $3, $4, $5);`,
        [productid, productname, price, status, cartid || null]
      );
      res.send('Test data inserted successfully!');
    } catch (err) {
      console.error('Error in /insert:', err);
      res.status(500).send(err.message);
    }
  });
  
  /* app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Hash the password with bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert the new user
      await pool.query(
        'INSERT INTO users (username, password) VALUES ($1, $2)',
        [username, hashedPassword]
      );
  
      res.send('User registered successfully!');
    } catch (err) {
      console.error('Error in /signup:', err);
      if (err.code === '23505') { // unique_violation
        res.status(409).send('Username already exists.');
      } else {
        res.status(500).send('Error registering user.');
      }
    }
  });
  */

// Route: POST /drop
app.post('/drop', async (req, res) => {
    const { tableName } = req.body;
  
    try {
      await pool.query(`DROP TABLE IF EXISTS ${tableName}`);
      res.send(`Table '${tableName}' dropped successfully :)`);
    } catch (err) {
      console.error('Error in /drop:', err);
      res.status(500).send(err.message);
    }
  });
  
  // Route: POST /create
  app.post('/create', async (req, res) => {
    const { tableSQL } = req.body; // full CREATE TABLE SQL
  
    try {
      await pool.query(tableSQL);
      res.send(`Table created successfully :)`);
    } catch (err) {
      console.error('Error in /create:', err);
      res.status(500).send(err.message);
    }
  });

app.use('/api', apiRouter);

//this will be used for the session stuff
app.get('/session', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

function ensureAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Admins only' });
}

function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  return res.status(401).json({ message: 'Not logged in' });
}

// Start server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
