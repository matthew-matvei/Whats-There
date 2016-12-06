"use strict";

var express = require("express");
var http = require("http");
var path = require("path");
var bodyParser = require("body-parser");
var Q = require("q");

var MashapeCaller = require("./src/api/caller").MashapeCaller;
var YummlyCaller = require("./src/api/caller").YummlyCaller;
var FoodToForkCaller = require("./src/api/caller").FoodToForkCaller;
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

    var mashapeCaller = new MashapeCaller();

    var allResponses = [];

    allResponses.push(mashapeCaller.call(req.body));

    var yummlyCaller = new YummlyCaller();
    allResponses.push(yummlyCaller.call(req.body));

    var ftfCaller = new FoodToForkCaller();
    allResponses.push(ftfCaller.call(req.body));

    Q.all(allResponses).then(function(list) {

        var response = [];

        for (var i = 0; i < list.length; i++) {

            var recipes = list[i];

            for (var j = 0; j < recipes.length; j++) {

                response.push(recipes[j].toJSON());
            }
        }

        res.send(response);
    });
});

var server = app.listen(app.get("port"), function() {

    console.log("Server started: listening on port " + app.get("port"));
});