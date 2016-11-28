"use strict";

var express = require("express");
var http = require("http");
var path = require("path");
var bodyParser = require("body-parser")

var MashapeCaller = require("./src/api/caller").MashapeCaller;
var Database = require("./src/db/database").Database;

var Recipe = require("./src/recipe");

var portNumber = 8080;
var app = express();

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("port", portNumber);

var db = new Database();
db.initialise();

app.post("/api/search-recipes", function(req, res, then) {

    var caller = new MashapeCaller();
    caller.call(req.body).then(function(recipes) {

        var response = [];

        recipes.map(function(recipe) {

            response.push(recipe.toJSON());
        });

        res.send(response);
    });
});

var server = app.listen(app.get("port"), function() {

    console.log("Server started: listening on port " + app.get("port"));
});