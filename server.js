const express = require("express");
const ShortUniqueId = require('short-unique-id')
const fs = require("fs");
const path = require("path");
const db = require("./db/db.json");

const uid = new ShortUniqueId({ length: 6 });
const app = express();
// specifies which port Express.js will use to run
const PORT = 3001;

app.use(express.json());
app.use(express.static("public")); // Static middleware pointing to /public
app.use(express.urlencoded({ extended: true })); // escaping unallowed chars to allowed chars

// HTML Routes ==================================================================
// creates default route
app.get("/", (req,res) => res.sendFile(path.join(__dirname, `/public/index.html`)))

app.get("/notes", (req,res) => 
res.sendFile(path.join(__dirname, `public/notes.html`)));

// API Routes ====================================================================
// GET /api/notes should read db.json file and return all saved notes as json
app.get("/api/notes", (req,res) => {
    fs.readFile(`./db/db.json`, "utf-8", (err, data) => {
        console.log(data)
        const allNotes = JSON.parse(data)
        console.log(allNotes)
    res.json(allNotes); // db[0] to get 1st item
    })
});

app.post(`/api/notes`, (req,res) => {
console.log(req.body, "-----------------")

const note = {
title: req.body.title,
text: req.body.text,
id: uid.rnd()
}

// fs.readFile(`./db/db.json`, "utf-8", (err, data) => {

//     const dbData = (data && JSON.parse(data)) || [];
//     dbData.push(note)

// fs.writeFile(`./db/db.json`, JSON.stringify(dbData), (err) =>
//     err
//       ? console.error(err)
//       : console.log("nothing")
//     //   : res.json(dbData)
//   );
// })
// res.json(db)

const data = fs.readFileSync('./db/db.json');

const dbData = JSON.parse(data);
dbData.push(note)

console.log(JSON.parse(data));
try {
  fs.writeFileSync(`./db/db.json`, JSON.stringify(dbData), 'utf8');

  console.log('Data successfully saved to disk');
} catch (error) {
  console.log('An error has occurred ', error);
}
res.json(note);
// console.log(uid.rnd())
});
/* POST /api/notes should receive a new note 
to save on the request body, add it to the db.json file, and then return the new
note to the client. You'll need to find a way to give each note a unique id when
 it's saved (look into npm packages that could do this for you).*/

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

app.listen(PORT, () =>
console.log(`Example app listening at http://localhost:${PORT}`)
);