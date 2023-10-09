const express = require("express");
const ShortUniqueId = require('short-unique-id')
const fs = require("fs");
const path = require("path");
const db = require("./db/db.json");

const uid = new ShortUniqueId({ length: 6 });
const app = express();
// specifies which port Express.js will use to run
const PORT =  process.env.PORT || 3001;

// Middleware =======================================================================
app.use(express.json());
app.use(express.static("public")); // Static middleware pointing to /public
app.use(express.urlencoded({ extended: true })); // escaping unallowed chars to allowed chars

// HTML Routes ====================================================================
app.get("/", (req,res) => res.sendFile(path.join(__dirname, `/public/index.html`)))

app.get("/notes", (req,res) => 
res.sendFile(path.join(__dirname, `public/notes.html`)));

// API Routes ======================================================================
app.get("/api/notes", (req,res) => {
    fs.readFile(`./db/db.json`, "utf-8", (err, data) => {
        const allNotes = JSON.parse(data)
    res.json(allNotes); // sends back parsed file
    })
});

app.post(`/api/notes`, (req,res) => {

    const note = {
    title: req.body.title,
    text: req.body.text,
    id: uid.rnd()
    }

const data = fs.readFileSync('./db/db.json');

const dbData = JSON.parse(data);
dbData.push(note)

try {
  fs.writeFileSync(`./db/db.json`, JSON.stringify(dbData), 'utf8');

  console.log('New note successfully written to file!');
} catch (error) {
  console.log('An error has occurred ', error);
}
res.json(note);
});
// Delete route ======================================================================

 app.delete("/api/notes/:id", (req,res) => {
    const data = fs.readFileSync('./db/db.json')
const dbData = JSON.parse(data);

const filterDb = dbData.filter(function(note) {
    return note.id != req.params.id
});

console.log(filterDb);
fs.writeFileSync(`./db/db.json`, JSON.stringify(filterDb), 'utf8');

res.json(filterDb)
 });

// Run program Express Server =======================================================
app.listen(PORT, () =>
console.log(`express-notes-11 listening at http://localhost:${PORT}`)
);