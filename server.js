const express = require('express');
const path = require('path');
const data = require('./db/db.json');


const PORT = process.env.port || 3002;
const app = express();

// Middleware for unlencoded data
app.use(express.urlencoded({ extend: true}));
// Middleware for parsing application/json
app.use(express.json());

app.use(express.static('public'))


app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

app.listen(PORT, () => 
  console.log(`App listening at http://localhost:${PORT}`)
);