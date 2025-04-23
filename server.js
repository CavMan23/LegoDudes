// website used to implement and understand cors: https://medium.com/zero-equals-false/using-cors-in-express-cac7e29b005b 
// discussion that is relevant: https://www.reddit.com/r/javascript/comments/8fcxus/help_on_api_using_express_nodejs_and_sql/ 
// inputting nodejs variable into sql query: https://stackoverflow.com/questions/41168942/how-to-input-a-nodejs-variable-into-an-sql-query 



const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const path = require('path');

const app = express();

app.use(cors({
  origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
  credentials: true 
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));



// PostgreSQL connection setup
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',      // change if needed
  database: 'postgres',  // change if needed
  password: 'password',  // fill in if your DB has one
  port: 5432             // default PostgreSQL port
});

app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		pool.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('BrowsingPage.html');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
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
  
  app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Hash the password with bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert the new user
      await pool.query(
        'INSERT INTO users (username, password) VALUES ($1, $2)',
        [username, hashedPassword]
      );
  
      res.send('✅ User registered successfully!');
    } catch (err) {
      console.error('❌ Error in /signup:', err);
      if (err.code === '23505') { // unique_violation
        res.status(409).send('Username already exists.');
      } else {
        res.status(500).send('Error registering user.');
      }
    }
  });
  
// Start server
app.listen(5050, () => {
  console.log('🚀 Server running at http://localhost:5050');
});
