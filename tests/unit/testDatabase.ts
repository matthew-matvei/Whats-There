import fs = require("fs");

import { Database } from "../../src/db/database";

let expect = require("chai").expect;
let assert = require("chai").assert;

describe("Database class'", function () {

    let DB: Database;
    let DBName: string;

    let ingredientList: string;
    let searchResponse: string;
    let recipeID: string;
    let recipeResponse: string;

    before(function (done) {

        DBName = "Test.db";
        DB = new Database();

        DB.initialiseDatabase(DBName);

        setTimeout(function () {

            done();

        }, 1000);
    });

    describe("InitialiseDatabase() method", function () {

        it("ensures the DB with name DBName is created", function () {

            expect(fs.existsSync(DBName)).to.be.true;
        });
    });

    describe("Store and fetch methods", function () {

        before(function (done) {

            DB.storeSearchResponse(DBName, ingredientList, searchResponse);
            setTimeout(function () {

                done();

            }, 1000);
        });

        it("can fetch a search response stored in the DB", function () {

            DB.fetchSearchResponse(DBName, ingredientList).then(
                function (response) {

                    expect(response).to.equal(searchResponse);
                });
        });

        it("can fetch a recipe response stored in the DB", function () {

            DB.fetchRecipeResponse(DBName, recipeID).then(function (response) {

                expect(response).to.equal(recipeResponse);
            });
        });
    });

    after(function () {

        fs.unlinkSync(DBName);
    });
});
