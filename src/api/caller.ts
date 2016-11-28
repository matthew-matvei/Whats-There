/** @author Matthew James <matthew.d.james87@gmail.com> */

import $ = require("jquery");
import Q = require("q");

import { Database } from "../db/database";
import Recipe from "../recipe";
import Ingredient from "../ingredient";
import { ICallOptions } from "./callOptions";
import { IMashapeRecipe, IMashapeSearchItem } from "./recipeInterfaces";
import Constants from "../constants";

let qs = require("querystring");
let uniRest = require("unirest");

/**
 * @interface Interface defines the API caller, which other API classes that handle
 * specific site communication implement.
 */
interface Caller {

    /**
     * Primary method of any Caller derived class, it handles everything from
     * constructing the API GET URL to returning the list of gotten recipes.
     *
     * Note: unirest is used for the actual GET requests. Otherwise, a local
     * DB will be queried to see if a cached version already exists.
     *
     * @param userOptions
     *      user-defined options associated with the API call
     *
     * @return a promise of an array of returned recipes
     */
    call(userOptions: ICallOptions): Promise<Array<Recipe>>;

    /**
     * Method takes as input a recipe ID from a list of IDs returned during
     * the call() method's invokation.
     *
     * Note: unirest is used for the actual GET requests. Otherwise, a local
     * DB will be queried to see if a cached version already exists.
     *
     * @param recipeID
     *      the API-specific desired recipe ID as a string
     *
     * @return a promise of a gotten recipe
     */
    get(recipeID: string): Promise<Recipe>;

    /**
     * Method handles the construction of the query string for a given API,
     * using options supplied by given userOptions.
     *
     * @param userOptions
     *      user-defined options associated with the API call
     *
     * @return the API GET URL as string
     */
    buildSearchString(userOptions: ICallOptions): string;

    /**
     * Method handles the construction of the get recipe string for a given API,
     * using the ID of the given recipeID.
     *
     * @param recipeID
     *      the ID of the recipe to get
     *
     * @return the API GET URL as string
     */
    buildGetString(recipeID: string): string;

    /**
     * Method takes as input a name, an object of ingredients, a method and
     * allergens of a recipe to construct. The method is mostly useful for
     * extracting / handling constructing ingredients for the recipe.
     *
     * @param response
     *      a JSON-formatted string, either from an API response or from a DB
     *      cached version
     *
     * @return the constructed recipe as a Recipe object
     */
    buildRecipe(response: string): Recipe;

    /**
     * Method takes as input a JSON-formatted string as the response from the
     * API after searching for recipes. It handles finding and returning the
     * various recipe IDs as an array of string.
     *
     * @param response
     *      the JSON-formatted response from a recipe search
     *
     * @return a list of recipe IDs
     */
    extractRecipes(response: string): Array<string>;
}

/**
 * @classdesc Class handles making API calls to Food2Fork.
 * @implements Caller
 */
export class FoodToForkCaller implements Caller {

	/*
	 * NOTE: FOLLOWING API REQUIRED FOR FoodToFork API
	 */

    private readonly API_KEY = "";

    /** @inheritdoc */
    public call(userOptions: ICallOptions): Promise<Array<Recipe>> {

        return new Promise<Array<Recipe>>(function (resolve, reject) {

            let queryString = this.buildSearchString(userOptions);

            $.get(queryString).done(function (searchResults) {

                // handle succeeding to retrieve recipes
                resolve(searchResults);

            }).fail(function (error) {

                // handle failing to retrieve recipes
            });
        });
    }

    /** @inheritdoc */
    public get(recipeID: string): Promise<Recipe> {

        return new Promise<Recipe>(function (resolve, reject) {


        });
    }

    /** @inheritdoc */
    public buildSearchString(userOptions: ICallOptions): string {

        let parameters = qs.stringify({

            key: this.API_KEY,
            q: userOptions.ingredients
        });

        return Constants.F2F_URL + Constants.F2F_SEARCH_RECIPES_PATH + "?" +
            parameters;
    }

    /** @inheritdoc */
    public buildGetString(recipeID: string): string {

        let parameters = qs.stringify({

            key: this.API_KEY,
            rId: recipeID
        });

        return Constants.F2F_URL + Constants.F2F_GET_RECIPE_PATH + "?" + parameters;
    }

    /** @inheritdoc */
    public buildRecipe(response: string): Recipe {

        return new Recipe("Recipe1", [new Ingredient("Ingredient1", 10, "ml")], "", new Array<string>(), "");
    }

    /** @inheritdoc */
    public extractRecipes(response: string): Array<string> {

        return new Array<string>();
    }
}

/** @classdesc Class handles making API calls to Edamam. */
export class EdamamCaller implements Caller {

	/*
	 * NOTE: FOLLOWING API REQUIRED FOR Edamam API
	 */

    private readonly API_KEY = "";

    /** @inheritdoc */
    public call(userOptions: ICallOptions): Promise<Array<Recipe>> {

        return new Promise<Array<Recipe>>(function (resolve, reject) {

            resolve(new Array<Recipe>());
        });
    }

    /** @inheritdoc */
    public get(recipeID: string): Promise<Recipe> {

        return new Promise<Recipe>(function (resolve, reject) {


        });
    }

    /** @inheritdoc */
    public buildSearchString(userOptions: ICallOptions): string {

        return "";
    }

    /** @inheritdoc */
    public buildGetString(recipeID: string): string {

        return "";
    }

    /** @inheritdoc */
    public buildRecipe(response: string): Recipe {

        return new Recipe("Recipe1", [new Ingredient("Ingredient1", 10, "ml")], "", new Array<string>(), "");
    }

    /** @inheritdoc */
    public extractRecipes(response: string): Array<string> {

        return new Array<string>();
    }
}

/** @classdesc Class handles making API calls to Mashape Spoonacular */
export class MashapeCaller implements Caller {

	/*
	 * NOTE: FOLLOWING API REQUIRED FOR Mashape API
	 */

    private readonly API_KEY = "";

    /** @inheritdoc */
    public call(userOptions: ICallOptions): Promise<Array<Recipe>> {

        // TODO: result.headers.x-ratelimit-requests-remaining could be used to identify when it's necessary to stop

        // since 'this' loses scope inside the Promise, we store it here
        let thisCaller = this;

        return new Promise<Array<Recipe>>(function (resolve, reject) {

            // TODO: abstract out / improve the following repetitive code

            /*
             * Initially attempts to fetch a response using given userOptions
             * from the DB. If this succeeds, the recipes referred to in the
             * response are fetched. If it fails, Mashape API is contacted.
             */
            let db = new Database();
            db.fetchSearchResponse(Constants.DB_MASHAPE,
                userOptions.ingredients)
                .then(function (response) {

                    let recipes = new Array<Promise<Recipe>>();
                    let recipeIDs = thisCaller.extractRecipes(response);
                    for (let id of recipeIDs) {

                        recipes.push(thisCaller.get(id));
                    }

                    /*
                     * Following is executed once all promises in recipes array
                     * are fulfilled. Note: those promises may either be
                     * resolved or rejected.
                     */
                    Q.all(recipes).then(function (recipesArray) {

                        resolve(recipesArray);
                    });
                })
                .catch(function (error) {

                    // during development, this warns that a cached version was not used
                    console.log(error);

                    // unirest is used to communicate with Mashape API
                    uniRest.get(thisCaller.buildSearchString(userOptions))
                        .header("X-Mashape-Key", thisCaller.API_KEY)
                        .header("Accept", "application/json")
                        .end(function (result: any) {

                            db.storeSearchResponse(Constants.DB_MASHAPE, userOptions.ingredients, JSON.stringify(result.body));

                            let recipes = new Array<Promise<Recipe>>();
                            let recipeIDs = thisCaller.extractRecipes(JSON.stringify(result.body));
                            for (let id of recipeIDs) {

                                recipes.push(thisCaller.get(id));
                            }

                            /*
                             * Following is executed once all promises in recipes array
                             * are fulfilled. Note: those promises may either be
                             * resolved or rejected.
                             */
                            Q.all(recipes).then(function (recipesArray) {

                                resolve(recipesArray);
                            });
                        });
                });
        });
    }

    /** @inheritdoc */
    public get(recipeID: string): Promise<Recipe> {

        // since 'this' loses scope inside the Promise, we store it here
        let thisCaller = this;

        return new Promise<Recipe>(function (resolve, reject) {

            /*
             * Initially attempts to fetch a response using given recipeID
             * from the DB. If this succeeds, the recipes referred to in the
             * response are fetched. If it fails, Mashape API is contacted.
             */
            let db = new Database();
            db.fetchRecipeResponse(Constants.DB_MASHAPE, recipeID)
                .then(function (response) {

                    resolve(thisCaller.buildRecipe(response));
                })
                .catch(function (error) {

                    // during development, this warns that a cached version was not used
                    console.log(error);

                    // unirest is used to communicate with Mashape API
                    uniRest.get(thisCaller.buildGetString(recipeID))
                        .header("X-Mashape-Key", thisCaller.API_KEY)
                        .header("Accept", "application/json")
                        .end(function (result: any) {

                            // TODO: not entirely sure about following. It may also be moved elsewhere
                            /*
                            let isAsync = false;  // should be okay since this is in Promise
                            let xhr = new XMLHttpRequest();
                            xhr.open("GET", result.image, isAsync);
                            xhr.responseType = "blob";
                            xhr.send();
                            */

                            db.storeRecipeResponse(Constants.DB_MASHAPE,
                                recipeID, JSON.stringify(result.body), null);

                            resolve(thisCaller.buildRecipe(JSON.stringify(result.body)));
                        });
                });
        });
    }

    /** @inheritdoc */
    public buildSearchString(userOptions: ICallOptions): string {

        // TODO: consider checking ingredients !== ""

        // 'querystring' module interprets userOptions to URL-friendly string
        let parameters = qs.stringify({

            fillIngredients: false,

            // the only parameter essential to this API call
            ingredients: userOptions.ingredients,
            limitLicense: false,
            number: 5,
            ranking: 1
        });

        return Constants.MASHAPE_URL +
            Constants.MASHAPE_SEARCH_RECIPES_PATH + "?" + parameters;
    }

    /** @inheritdoc */
    public buildGetString(recipeID: string): string {

        return Constants.MASHAPE_URL +
            Constants.MASHAPE_GET_RECIPE_PATH_PREFIX + recipeID +
            Constants.MASHAPE_GET_RECIPE_PATH_SUFFIX;
    }

    /** @inheritdoc */
    public buildRecipe(response: string): Recipe {

        let responseAsJSON = <IMashapeRecipe>JSON.parse(response);

        let name = responseAsJSON.title;
        let ingredients = responseAsJSON.extendedIngredients;
        let method = responseAsJSON.instructions;
        let allergens = new Array<string>(); // no allergens available
        let source = responseAsJSON.sourceUrl;

        let ingredientsArray = new Array<Ingredient>();
        for (let ingredient of ingredients) {

            ingredientsArray.push(new Ingredient(ingredient.name,
                ingredient.amount, ingredient.unit));
        }

        return new Recipe(name, ingredientsArray, method,
            new Array<string>(), source);
    }

    /** @inheritdoc */
    public extractRecipes(response: string): Array<string> {

        let result = new Array<string>();
        for (let recipe of JSON.parse(response)) {

            result.push((<IMashapeSearchItem>recipe).id.toString());
        }

        return result;
    }
}

export class YummlyCaller implements Caller {

	/*
	 * NOTE: FOLLOWING API REQUIRED FOR FoodToFork API
	 */

	private readonly API_KEY = "";

    /** @inheritdoc */
    public call(userOptions: ICallOptions): Promise<Array<Recipe>> {

        return new Promise<Array<Recipe>>(function (resolve, reject) {

        });
    }

    /** @inheritdoc */
    public get(recipeID: string): Promise<Recipe> {

        return new Promise<Recipe>(function (resolve, reject) {

        });
    }

    /** @inheritdoc */
    public buildSearchString(userOptions: ICallOptions): string {

        // TODO: consider checking ingredients !== ""

        // 'querystring' module interprets userOptions to URL-friendly string
        let parameters = qs.stringify({

            // the only parameter essential to this API call
            q: userOptions.ingredients,
            requirePictures: false
        });

        return Constants.YUMMLY_URL +
            Constants.YUMMLY_SEARCH_RECIPES_PATH + "?" + parameters;
    }

    /** @inheritdoc */
    public buildGetString(recipeID: string): string {

        return Constants.YUMMLY_URL +
            Constants.YUMMLY_GET_RECIPE_PATH + recipeID;
    }

    /** @inheritdoc */
    public buildRecipe(response: string): Recipe {

        return new Recipe("Recipe1", [new Ingredient("Ingredient1", 10, "ml")], "", new Array<string>(), "");
    }

    /** @inheritdoc */
    public extractRecipes(response: string): Array<string> {

        return new Array<string>();
    }
}
