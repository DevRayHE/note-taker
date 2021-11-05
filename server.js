const express = require('express');
const fs = require('fs');
const path = require('path');
const uniqid = require('uniqid')
const notes = require('./db/db.json');


const PORT = process.env.port || 3002;
const app = express();

// Middleware for unlencoded data
app.use(express.urlencoded({ extend: true}));
// Middleware for parsing application/json
app.use(express.json());

app.use(express.static('public'))


// Post request to add a note
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to post a note`);

  const {title, text} = req.body;
  const id = uniqid();
  console.info(`${req.body}  ${title}  ${text}`);

  const newNote = {
    title,
    text,
    id,
  }

  // Obtain exisiting notes
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedNotes = JSON.parse(data);

      // Add a new note
      parsedNotes.push(newNote);

      fs.writeFile(
        './db/db.json', 
        JSON.stringify(parsedNotes, null, 2),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info('Successfully updated notes!')
      )
    }
  });

  const response = {
    status: 'success',
    body: newNote,
  }

  console.log(response);
  res.json(response);
});


// app.delete();

// Get request to retrive current notes
app.get('/api/notes', (req, res) => {
  // Log request to the terminal
  console.info(`${req.method} request received to get notes`);

  return res.json(notes);
});

// Get request to retrive nots.html file
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'))
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
});

app.listen(PORT, () => {
  console.info(`App listening at http://localhost:${PORT}`)
});