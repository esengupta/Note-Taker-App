let router = require("express").Router();
let path = require("path");

// for notes..
router.get("/notes", function(req, res) {
	
    res.sendFile(path.join(__dirname, "../public/notes.html"));
});


// for index..
router.get("/index", function(req, res) {
	
    res.sendFile(path.join(__dirname, "../public/index.html"));
});


module.exports = router;