/// <reference path="../../typings/globals/sqlite3/index.d.ts" />

import * as sqlite3 from "sqlite3";
let fs = require("fs");

import Recipe from "../recipe";
import Constants from "../constants";

import { IMashapeDBSearch, IMashapeDBRecipe } from "./DBInterfaces";

export class Database {

    public initialise(): void {

        this.initialiseDatabase(Constants.DB_MASHAPE);
    }

    // TODO: consider using string instead of Enumerator<string>

    /**
     *
     *
     * @param DBName
     *      the Database to initialise, identified by file name
     */
    public initialiseDatabase(DBName: string): void {

        let file = DBName;
        let exists = fs.existsSync(file);
        let db = new sqlite3.Database(file);

        if (!exists) {

            db.serialize(function () {

                // run query to initialise DB schema
                db.run("create table RECIPE_SEARCH " +
                    "(ingredients TEXT PRIMARY KEY, response TEXT NOT NULL)");
                db.run("create table RECIPE " +
                    "(recipe_id TEXT PRIMARY KEY, response TEXT NOT NULL, image)");

                // insert pre-fetched data, used during development
                let devIngredients = "apples,flour,sugar";
                let devResponse = JSON.parse(fs.readFileSync("responses/Mashape-search_response.json"));
                let devSearchStmt = db.prepare("insert or ignore into RECIPE_SEARCH values (?, ?)");
                devSearchStmt.run(devIngredients, JSON.stringify(devResponse));
                devSearchStmt.finalize();

                let dev47732id = "47732";
                let dev47732Response = JSON.parse(fs.readFileSync("responses/Mashape-recipe_response-47732.json"));
                let dev47732Stmt = db.prepare("insert or ignore into RECIPE values (?, ?, ?)");
                dev47732Stmt.run(dev47732id, JSON.stringify(dev47732Response), null);
                dev47732Stmt.finalize();

                let dev47891id = "47891";
                let dev47891Response = JSON.parse(fs.readFileSync("responses/Mashape-recipe_response-47891.json"));
                let dev47891Stmt = db.prepare("insert or ignore into RECIPE values (?, ?, ?)");
                dev47891Stmt.run(dev47891id, JSON.stringify(dev47891Response), null);
                dev47891Stmt.finalize();

                let dev47950id = "47950";
                let dev47950Response = JSON.parse(fs.readFileSync("responses/Mashape-recipe_response-47950.json"));
                let dev47950Stmt = db.prepare("insert or ignore into RECIPE values (?, ?, ?)");
                dev47950Stmt.run(dev47950id, JSON.stringify(dev47950Response), null);
                dev47950Stmt.finalize();

                let dev534573id = "534573";
                let dev534573Response = JSON.parse(fs.readFileSync("responses/Mashape-recipe_response-534573.json"));
                let dev534573Stmt = db.prepare("insert or ignore into RECIPE values (?, ?, ?)");
                dev534573Stmt.run(dev534573id, JSON.stringify(dev534573Response), null);
                dev534573Stmt.finalize();

                let dev556470id = "556470";
                let dev556470Response = JSON.parse(fs.readFileSync("responses/Mashape-recipe_response-556470.json"));
                let dev556470Stmt = db.prepare("insert or ignore into RECIPE values (?, ?, ?)");
                dev556470Stmt.run(dev556470id, JSON.stringify(dev556470Response), null);
                dev556470Stmt.finalize();
            });

            db.close();
        }
    }

    /**
     *
     *
     * @param DBName
     *      the name of the DB file, based on the corresponding API it caches
     *
     * @param ingredients
     *      a comma-separated list of ingredients in lower case, ordered
     *      alphabetically
     *
     * @return the cached response, identical to the response from the API the
     *      database is named after
     */
    public fetchSearchResponse(DBName: string,
        ingredients: string): Promise<string> {

        let db = new sqlite3.Database(DBName);

        return new Promise<string>(function (resolve, reject) {

            db.get("select * from RECIPE_SEARCH where ingredients = ?", ingredients, function (err, row) {

                if (row) {

                    let newRow = <IMashapeDBSearch>row;

                    let response = newRow.response;
                    db.close();

                    resolve(response);

                } else {

                    db.close();

                    reject("Couldn't find search response using given ingredients");
                }
            });
        });
    }

    public fetchRecipeResponse(DBName: string,
        recipeID: string): Promise<string> {

        let db = new sqlite3.Database(DBName);
        return new Promise<string>(function (resolve, reject) {

            db.get("select * from RECIPE where recipe_id = " + recipeID, function (err, row) {

                if (row) {

                    let newRow = <IMashapeDBRecipe>row;

                    let response = newRow.response;
                    db.close();

                    resolve(response);

                } else {

                    db.close();

                    reject("Couldn't find recipe response using given recipe id");
                }
            });
        });
    }

    public storeSearchResponse(DBName: string,
        ingredients: string, response: string): void {

        let file = DBName;
        let exists = fs.existsSync(file);

        if (!exists) {

            this.initialiseDatabase(DBName);

        } else {

            let db = new sqlite3.Database(file);
            let stmt = db.prepare("insert or ignore into RECIPE_SEARCH values (?, ?)");
            stmt.run(ingredients, response);
            stmt.finalize();

            db.close();
        }
    }

    public storeRecipeResponse(DBName: string,
        recipeID: string, response: string, image?: Blob) {

        let file = DBName;
        let exists = fs.existsSync(file);

        if (!exists) {

            this.initialiseDatabase(DBName);

        } else {

            let db = new sqlite3.Database(file);
            let stmt = db.prepare("insert or ignore into RECIPE values (?, ?, ?)");
            stmt.run(recipeID, response, image || null);
            stmt.finalize();

            db.close();
        }
    }
}