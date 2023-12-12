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
app.get('/login', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;

    // console.log(username)
    // console.log(password)
  
    // Replace this logic with your actual authentication logic (querying the database, etc.)
    const query = `SELECT c_username, c_password FROM credential WHERE c_username = ? AND c_password = ?`;
    db.get(query, [username, password], (err, row) => {
      if (err) {
        console.log('Error querying database:', err.message);
        res.status(500).json({ message: err.message });
        return;
      }
      // console.log(row)
      if (row) {
        res.status(200).json({ message: 'Sign in Successful!' });
        // res.redirect(`/forum/${username}`);
      } else {
        res.json({message: 'Username or Password is Incorrect.'});
      }
    });
  });

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

app.get('/forum', (req, res) => {
  const data = {};
  db.all(`SELECT c_id, c_username FROM credential`, (userErr, userRow) => {
    if (userErr) {
      console.error('Error querying database:', userErr.message);
      res.status(500).json({ message: userErr.message });
      return;
    }
    // console.log(userRow)
    data.credential = userRow;
  });

  db.all(`SELECT p_id, p_userId, p_question, p_upvotes, p_downvotes FROM post`, (postErr, postRow) => {
    if (postErr) {
      console.error('Error querying database:', postErr.message);
      res.status(500).json({ message: postErr.message });
      return;
    }
    data.post = postRow
    
  });
  
  db.all(`SELECT r_id, r_postId, r_userId, r_response, r_upvotes, r_downvotes FROM response`, (replyErr, replyRow) => {
    if (replyErr) {
      console.error('Error querying database:', replyErr.message);
      res.status(500).json({ message: replyErr.message });
      return;
    }
    // console.log(data)
    data.response = replyRow
    // console.log(data)
  });

  db.all(`SELECT v_responseId, v_userId, v_voted, v_type FROM voted`, (votedErr, votedRow) => {
    if (votedErr) {
      console.error('Error querying database:', votedErr.message);
      res.status(500).json({ message: votedErr.message });
      return;
    }
    // console.log(data)
    data.voted = votedRow
    // console.log(data)
    
    data.message = 'Access Successful'
    res.status(200).json(data);
  });
});

app.post('/forum/post', (req, res) => {
  const { usernameId, questionText} = req.body;
  // console.log(username)
  // console.log(password)
  // Replace this logic with your actual authentication logic (querying the database, etc.)
  db.run(`INSERT INTO post (p_userId, p_question, p_upvotes, p_downvotes) VALUES (?, ?, 0, 0)`, [usernameId, questionText], (err, row) => {
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

app.delete('/forum/', (req, res) => {
  const postId = req.query.postId;
  db.run(`DELETE FROM post WHERE p_id = ?`, [postId], (err, row) => {
    if (err) {
      console.log('Error querying database:', err.message);
      res.status(500).json({ message: err.message });
      return;
    } else {
      console.log('Data Deleted Successfully');
      db.all(`SELECT r_id FROM response WHERE r_postId = ?`, [postId], (err, responseRow) => {
        console.log(responseRow)
        responseRow.forEach(row => {
          db.run(`DELETE FROM voted WHERE v_responseId = ?`, [row.r_id], (err, row) => {});
        }

        )
      });
      db.run(`DELETE FROM response WHERE r_postId = ?`, [postId], (err, row) => {});
      // db.run(`UPDATE post SET p_id = (SELECT row_number() OVER (ORDER BY p_id) FROM post)`, (postErr, row) => {
      //   if (postErr) {
      //     console.log('Error querying database:', postErr.message);
      //     res.status(500).json({ message: postErr.message });
      //     return;
      //   }
      // });
      // db.run(`DELETE FROM voted WHERE v_responseId = ?`, [responseId], (err, row) => {});

      res.status(200).json({ message: 'Data Deleted Successfully' });
    }
  });
});

app.post('/forum/response', (req, res) => {
  const { usernameId, responseText, questionIndex} = req.body;
  // console.log(username)
  // console.log(password)
  // Replace this logic with your actual authentication logic (querying the database, etc.)
  db.run(`INSERT INTO response (r_postId, r_userId, r_response, r_upvotes, r_downvotes) VALUES (?, ?, ?, 0, 0)`, [questionIndex, usernameId, responseText], (err, row) => {
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