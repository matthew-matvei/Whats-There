/// <reference path="../../typings/globals/sqlite3/index.d.ts" />

import * as sqlite3 from "sqlite3";
let fs = require("fs");

import { Constants } from "../constants";

import { IDBSearch, IDBRecipe } from "./DBInterfaces";

export class Database {

    /**
     * Method initialises all Database files used in the application.
     *
     * @ensure all database files exist
     *
     *  &&  all database files contain correct database schema
     */
    public initialise(): void {

        this.initialiseDatabase(Constants.DB_MASHAPE);
        this.initialiseDatabase(Constants.DB_YUMMLY);
        this.initialiseDatabase(Constants.DB_FOOD_TO_FORK);
    }

    /**
     * Method takes as input the filename of a database and ensures it both
     * exists and contains the required database schema.
     *
     * @ensure require("fs").existsSync(dbName)
     *
     *  &&  DB schema exists in database at given dbName
     *
     * @param dbName
     *      the Database to initialise, identified by file name
     */
    public initialiseDatabase(dbName: string): void {

        let file = dbName;
        let exists = fs.existsSync(file);
        let db = new sqlite3.Database(file);

        if (!exists) {

            db.serialize(function () {

                // run query to initialise DB schema
                db.run("create table RECIPE_SEARCH " +
                    "(ingredients TEXT PRIMARY KEY, response TEXT NOT NULL)");
                db.run("create table RECIPE " +
                    "(recipe_id TEXT PRIMARY KEY, " +
                    "response TEXT NOT NULL)");
            });
        }

        db.close();
    }

    /**
     * Method takes as input a dbName and a comma-separated list of ingredients.
     * It fetches a cached API response (where API corresponds to the DB
     * referred to by dbName) using ingredients. The method resolves where a
     * response is found and rejects where it is not.
     *
     * @param dbName
     *      the name of the DB file, based on the corresponding API it caches
     *
     * @param ingredients
     *      a comma-separated list of ingredients in lower case, ordered
     *      alphabetically
     *
     * @return the cached response, identical to the response from the API the
     *      database is named after
     */
    public fetchSearchResponse(dbName: string,
        ingredients: string): Promise<string> {

        let db = new sqlite3.Database(dbName);

        return new Promise<string>(function (resolve, reject) {

            let stmt = db.prepare(
                "select * from RECIPE_SEARCH where ingredients = ?");
            stmt.get(ingredients, function (error, row) {

                stmt.finalize();

                if (row !== undefined) {

                    let response = (<IDBSearch>row).response;
                    db.close();

                    resolve(response);

                } else {

                    db.close();

                    reject("Couldn't find search response using " +
                        "given ingredients");
                }
            });
        });
    }

    public fetchRecipeResponse(dbName: string,
        recipeID: string): Promise<string> {

        let db = new sqlite3.Database(dbName);
        return new Promise<string>(function (resolve, reject) {

            let stmt = db.prepare("select * from RECIPE where recipe_id = ?");
            stmt.get(recipeID, function (err, row) {

                stmt.finalize();

                if (row !== undefined) {

                    let response = (<IDBRecipe>row).response;
                    db.close();

                    resolve(response);

                } else {

                    db.close();

                    reject("Couldn't find recipe response using " +
                        "given recipe id");
                }
            });
        });
    }

    public storeSearchResponse(dbName: string,
        ingredients: string, response: string): void {

        let file = dbName;
        let exists = fs.existsSync(file);

        if (!exists) {

            this.initialiseDatabase(dbName);

        } else {

            let db = new sqlite3.Database(file);
            let stmt = db.prepare(
                "insert or ignore into RECIPE_SEARCH values (?, ?)",
                function (error) {

                    // errors in caching handled silently
                });

            stmt.run(ingredients, response,
                function (error: any) {

                    // errors in caching handled silently
                });
            stmt.finalize();

            db.close();
        }
    }

    public storeRecipeResponse(dbName: string,
        recipeID: string, response: string) {

        let file = dbName;
        let exists = fs.existsSync(file);

        if (!exists) {

            this.initialiseDatabase(dbName);

        } else {

            let db = new sqlite3.Database(file);
            let stmt = db.prepare(
                "insert or ignore into RECIPE values (?, ?)",
                function (error) {

                    // errors in caching handled silently
                });

            stmt.run(recipeID, response,
                function (error: any) {

                    // errors in caching handled silently
                });

            stmt.finalize();

            db.close();
        }
    }
}
