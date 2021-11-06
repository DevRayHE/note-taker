const express = require('express');
const fs = require('fs');
const path = require('path');
const uniqid = require('uniqid')

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

// Delete request to delete a note
app.delete('/api/notes/:id', (req, res) => {
  // Log request to the terminal
  // console.info(`${req.method} request received to delte note with id ${id}`);
  console.info(`${req.method} request received to delte note with request body ${req.body}`);
  console.info(`${req.method} request received to delte note with id ${req.params.id}`);

  const id = req.params.id;

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    console.info(`${req.method} request received to get notes`);
    let allNotes = JSON.parse(data);

    const notesAfterDelete = allNotes.filter((note) => note.id !== id)

    fs.writeFile(
      './db/db.json', 
      JSON.stringify(notesAfterDelete, null, 2),
      (writeErr) =>
        writeErr
          ? console.error(writeErr)
          : console.info('Successfully updated notes!')
    )
  })

  return res.json(`Note with ${id} has been deleted!`);
});

// Get request to retrive current notes
app.get('/api/notes', (req, res) => {
  // Log request to the terminal
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    console.info(`${req.method} request received to get notes`);
    res.json(JSON.parse(data));
  })
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