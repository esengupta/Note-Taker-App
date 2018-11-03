let router = require("express").Router();
let connection = require("../db/connection");

//Get all Notes
router.get("/api/notes", function(req, res) {
    connection.query("SELECT * FROM notes", function(err, data) {
      res.json(data);
    });
});

//Add new Note
router.post("/api/notes", function(req, res) {
    console.log("req.body:", req.body);

    connection.query("INSERT INTO notes SET ?", req.body, function(err, result) {
      if (err) {
        console.log(err);
        return false;
      }
      res.json(result);
    });
});

//Delete Note
router.delete("/api/notes/:noteId", function(req, res) {
  console.log(req.params.noteId);
  connection.query("DELETE FROM notes WHERE id=?", [req.params.noteId], function(err, result) {
    if (err) {
      console.log(err);
      return false;
    }
    res.json(result);
  });
});

//Update existing Note
router.put("/api/notes/:noteId", function(req, res) {
    console.log("req.body:", req.body);

    connection.query("UPDATE notes SET ? WHERE id=?", [req.body, req.params.noteId], function(err, result) {
      if (err) {
        console.log(err);
        return false;
      }
      res.json(result);
    });
});



module.exports = router;