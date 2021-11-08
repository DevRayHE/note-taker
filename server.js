const express = require('express');
const path = require('path');
const uniqid = require('uniqid')
const {
  readFromFile,
  writeToFile,
} = require ('./helpers/fsUtils');

const PORT = process.env.PORT || 3002;
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

  const newNote = {
    title,
    text,
    id,
  }

  // Obtain exisiting notes
  readFromFile('./db/db.json')
    .then((data) => {
    const parsedNotes = JSON.parse(data);

      // Add a new note
    parsedNotes.push(newNote);

    writeToFile('./db/db.json', parsedNotes);
  });

  const response = {
    status: 'success',
    body: newNote,
  }

  console.log(response);
  res.json(response);
});

// Delete request to delete a note
app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;

  readFromFile('./db/db.json')
    .then((data) => {
      let allNotes = JSON.parse(data);

      const notesAfterDelete = allNotes.filter((note) => note.id !== id);

      writeToFile('./db/db.json', notesAfterDelete);
    });

  res.json(`Note with ${id} has been deleted!`);
});

// Get request to retrive current notes
app.get('/api/notes', (req, res) => {
  // Log request to the terminal
  readFromFile('./db/db.json')
    .then((data) => {
      res.json(JSON.parse(data));
    });
});

// Get request to retrive notes.html file
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'))
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
});

app.listen(PORT, () => {
  console.info(`App listening at http://localhost:${PORT}`)
});