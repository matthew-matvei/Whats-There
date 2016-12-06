// script is useful for manually checking that values are present in DB

var sqlite3 = require("sqlite3");
var file = "Mashape.db";
var db = new sqlite3.Database(file);

var ingredients = "apples,flour,sugar";

// displays all unique fields in Guest table
db.each("SELECT * FROM RECIPE_SEARCH", function(err, row) {

    console.log(row);
    console.log("");
});

db.each("SELECT * FROM RECIPE", function(err, row) {

    console.log(row);
    console.log("");
});