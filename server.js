const express = require("express");
const ShortUniqueId = require('short-unique-id')
const fs = require("fs");
const path = require("path");
const db = require("./db/db.json");

const uid = new ShortUniqueId({ length: 6 });
const app = express();
// specifies which port Express.js will use to run
const PORT = 3001;


app.use(express.static("public")); // Static middleware pointing to /public
app.use(express.urlencoded({ extended: true })); // escaping unallowed chars to allowed chars

// HTML Routes ==================================================================
// creates default route
app.get("/", (req,res) => res.send(`slash route, idk what goes here`))

app.get("/notes", (req,res) => 
res.sendFile(path.join(__dirname, `public/notes.html`)))
// API Routes ====================================================================
// GET /api/notes should read db.json file and return all saved notes as json
app.get("/api/notes", (req,res) => {
    res.json(db); // db[0] to get 1st item
});

app.post(`api/notes`, (req,res) => {
    
res.json(`api/notes POST request received`)
console.log(uid.rnd())
});
/* POST /api/notes should receive a new note 
to save on the request body, add it to the db.json file, and then return the new
note to the client. You'll need to find a way to give each note a unique id when
 it's saved (look into npm packages that could do this for you).*/


app.listen(PORT, () =>
console.log(`Example app listening at http://localhost:${PORT}`)
);