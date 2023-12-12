const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Assuming that 'courseInfo.sqlite' is in the same directory as 'server.js'
const dbPath = path.resolve(__dirname, 'forumData.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Database opened successfully');
  }
});

// Enable foreign key support
db.run('PRAGMA foreign_keys = ON');

// Parse POST request data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Default HTML file: Login.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
  });
// CSS file
app.use(express.static(path.join(__dirname)));

// Handle form submission
// Inside your login route
// app.post('/login', (req, res) => {
//     const { username, password } = req.body;
  
//     // Replace this logic with your actual authentication logic (querying the database, etc.)
//     const query = `SELECT c_username, c_password FROM credentials WHERE c_username = ? AND c_password = ?`;
//     db.get(query, [username, password], (err, row) => {
//       if (err) {
//         console.error('Error querying database:', err.message);
//         res.red('/?error=1');
//         return;
//       }
  
//       if (row) {
//         const { username, password } = row;
//         if (role === 'instructor') {
//           res.redirect(`/forum/${username}`);  // Use the username here
//         }
//       } else {
//         res.redirect('/?error=1');
//       }
//     });
//   });

  app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    // console.log(username)
    // console.log(password)
    // Replace this logic with your actual authentication logic (querying the database, etc.)
    db.run(`INSERT INTO credential (c_username, c_password) VALUES (?, ?)`, [username, password], (err, row) => {
      if (err) {
        console.log('Error querying database:', err.message);
        res.status(500).json({ message: err.message });
        return;
      } else {
        console.log('Data added Successfully');
        res.status(200).json({ message: 'Data added Successfully' });
      }
    });
  });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
    });