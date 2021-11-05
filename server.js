const express = require('express');
const path = require('path');
const notes = require('./db/db.json');


const PORT = process.env.port || 3002;
const app = express();

// Middleware for unlencoded data
app.use(express.urlencoded({ extend: true}));
// Middleware for parsing application/json
app.use(express.json());

app.use(express.static('public'))


// app.post();

// app.delete();

app.get('/api/notes', (req, res) => {
  // Log request to the terminal
  console.info(`${req.method} request received to get notes`);

  return res.json(notes);
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'))
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
});

app.listen(PORT, () => {
  console.info(`App listening at http://localhost:${PORT}`)
});