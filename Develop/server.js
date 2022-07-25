const express = require('express');
const app = express();
const PORT = 3001;
const fs = require('fs');
const path = require('path');
//const util = require('util');
//const uuid = require('./public/assets/js/uuid')
//const notes = require('./db/db.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


// - - - - - - - - - - - - - functions from activity - - - - - - - - - - - - - - - - - - - - - - -
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
  };
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 


// serves up notes page
app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// CHECK THIS SYNTAX
app.get('/api/notes', (req, res)  => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.json("WOOPS")
        } else {
            const parsedNote = JSON.parse(data);
            res.json(parsedNote);
        }
    })
});


// saves notes to db.json
app.post('/api/notes', (req, res) => {
    // logging POST request was recieved
    console.info(`${req.method} request received to save notes`);
    console.info(req.body);

    const { title, text, note_id } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            note_id,
        };

        readAndAppend(newNote, './db/db.json');

        const response = {
            status: 'Note saved',
            body: newNote,
        };

        res.json(response);
    } else {
        res.json('Error saving the note');
    }
});

app.delete('/api/notes')

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);