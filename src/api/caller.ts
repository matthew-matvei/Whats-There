/** @author Matthew James <matthew.d.james87@gmail.com> */

import Q = require("q");

import Constants from "../constants";
import { Database } from "../db/database";
import Ingredient from "../ingredient";
import Recipe from "../recipe";
import {
    IFoodToForkRecipe, IFoodToForkSearch, IFoodToForkSearchItem, IMashapeRecipe,
    IMashapeSearchItem, IResponse, IYummlyRecipe,
    IYummlySearchItem
} from "./callerInterfaces";
import CallerUtils from "./callerUtils";
import { ICallOptions } from "./callOptions";
import { FoodToForkFilter, MashapeFilter, YummlyFilter } from "./filter";

let qs = require("querystring");
let uniRest = require("unirest");

// TODO: consider making interface an abstract class, in order to reduced repeated code in sub-classes' call() and get() methods

/**
 * @interface Interface defines the API caller, which other API classes that
 * handle specific site communication implement.
 */
export interface ICaller {

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
     * various recipe IDs as an array of string. Since ordering is performed,
     * userOptions may optionally be passed to allow manual ordering based on
     * user's call options.
     *
     * @param response
     *      the JSON-formatted response from a recipe search
     * @param userOptions
     *      options with which the user made the API call (optional)
     *
     * @return a list of recipe IDs
     */
    extractRecipes(response: string, userOptions?: ICallOptions): Array<string>;
}

/**
 * @classdesc Class handles making API calls to Food2Fork.
 * @implements ICaller
 */
export class FoodToForkCaller implements ICaller {

    /*
	 * NOTE: FOLLOWING API REQUIRED FOR FoodToFork API
	 */

    private readonly API_KEY = "";
    private readonly MASHAPE_KEY = "";

    /** @inheritdoc */
    public call(userOptions: ICallOptions): Promise<Array<Recipe>> {

        // since 'this' loses scope inside the Promise, we store it here
        let thisCaller = this;

        return new Promise<Array<Recipe>>(function (resolve, reject) {

            /*
             * Initially attempts to fetch a response using given userOptions
             * from the DB. If this succeeds, the recipes referred to in the
             * response are fetched. If it fails, Mashape API is contacted.
             */
            let db = new Database();
            db.fetchSearchResponse(Constants.DB_FOOD_TO_FORK,
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

                        let filter = new FoodToForkFilter();
                        let sortedRecipes = filter.filterByIngredients(
                            recipesArray, userOptions);

                        resolve(sortedRecipes);
                    });
                })
                .catch(function (error) {

                    // during dev, this warns that a cached version was not used
                    console.log(error);

                    // unirest is used to communicate with Mashape API
                    uniRest.get(thisCaller.buildSearchString(userOptions))
                        .header("X-Mashape-Key", thisCaller.MASHAPE_KEY)
                        .header("Accept", "application/json")
                        .end(function (result: IResponse) {

                            db.storeSearchResponse(Constants.DB_FOOD_TO_FORK,
                                userOptions.ingredients,
                                JSON.stringify(result.body));

                            let recipes = new Array<Promise<Recipe>>();
                            let recipeIDs = thisCaller.extractRecipes(
                                JSON.stringify(result.body));
                            for (let id of recipeIDs) {

                                recipes.push(thisCaller.get(id));
                            }

                            /*
                             * Following is executed once all promises in
                             * recipes array are fulfilled. Note: those promises
                             * may either be resolved or rejected.
                             */
                            Q.all(recipes).then(function (recipesArray) {

                                let filter = new FoodToForkFilter();
                                let sortedRecipes = filter.filterByIngredients(
                                    recipesArray, userOptions);

                                resolve(sortedRecipes);
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
            db.fetchRecipeResponse(Constants.DB_FOOD_TO_FORK, recipeID)
                .then(function (response) {

                    resolve(thisCaller.buildRecipe(response));
                })
                .catch(function (error) {

                    // during dev, this warns that a cached version was not used
                    console.log(error);

                    // unirest is used to communicate with Mashape API
                    uniRest.get(thisCaller.buildGetString(recipeID))
                        .header("X-Mashape-Key", thisCaller.MASHAPE_KEY)
                        .header("Accept", "application/json")
                        .end(function (result: IResponse) {

                            db.storeRecipeResponse(Constants.DB_FOOD_TO_FORK,
                                recipeID, JSON.stringify(result.body));

                            resolve(thisCaller.buildRecipe(
                                JSON.stringify(result.body)));
                        });
                });
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

        return Constants.F2F_URL + Constants.F2F_GET_RECIPE_PATH + "?" +
            parameters;
    }

    /** @inheritdoc */
    public buildRecipe(response: string): Recipe {

        /*
         * Note: response becomes 'double-escaped', likely due to FoodToFork's
         * response.body already being JSON.stringified. Therefore, this is
         * handled here by parsing twice.
         */
        let responseAsJSON = <IFoodToForkRecipe>JSON.parse(
            JSON.parse(response));

        let name = responseAsJSON.recipe.title;

        // TODO: handle ingredient lines similarly to in Yummly
        let ingredients = responseAsJSON.recipe.ingredients
            .map(function (ingredient) {

                let ingredientVolume = CallerUtils
                    .getIngredientVolume(ingredient);
                let ingredientName = CallerUtils.getIngredientName(ingredient);

                if (ingredientVolume > 0) {

                    return new Ingredient(ingredientName, ingredientVolume, "");

                } else {

                    return new Ingredient(ingredientName, 0, "");
                }
            });
        let image = responseAsJSON.recipe.image_url;
        let source = responseAsJSON.recipe.source_url;

        // note: F2F API returns no servings or timeToMake information
        return new Recipe(name, ingredients, "", new Array<string>(), image,
            source, 0, 0);
    }

    /** @inheritdoc */
    public extractRecipes(response: string): Array<string> {

        let result = new Array<string>();

        /*
         * Note: response becomes 'double-escaped', likely due to FoodToFork's
         * response.body already being JSON.stringified. Therefore, this is
         * handled here by parsing twice.
         */
        for (let recipe of (JSON.parse(JSON.parse(response)) as
            IFoodToForkSearch).recipes) {

            result.push((<IFoodToForkSearchItem>recipe).recipe_id);
        }

        return result;
    }
}

/** @classdesc Class handles making API calls to Edamam. */
export class EdamamCaller implements ICaller {

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

        return new Recipe("Recipe1", [new Ingredient("Ingredient1", 10, "ml")],
            "", new Array<string>(), "IMG", "URL", 1, 1);
    }

    /** @inheritdoc */
    public extractRecipes(response: string): Array<string> {

        return new Array<string>();
    }
}

/** @classdesc Class handles making API calls to Mashape Spoonacular */
export class MashapeCaller implements ICaller {

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

                    // during dev, this warns that a cached version was not used
                    console.log(error);

                    // unirest is used to communicate with Mashape API
                    uniRest.get(thisCaller.buildSearchString(userOptions))
                        .header("X-Mashape-Key", thisCaller.API_KEY)
                        .header("Accept", "application/json")
                        .end(function (result: IResponse) {

                            db.storeSearchResponse(Constants.DB_MASHAPE,
                                userOptions.ingredients,
                                JSON.stringify(result.body));

                            let recipes = new Array<Promise<Recipe>>();
                            let recipeIDs = thisCaller.extractRecipes(
                                JSON.stringify(result.body));
                            for (let id of recipeIDs) {

                                recipes.push(thisCaller.get(id));
                            }

                            /*
                             * Following is executed once all promises in
                             * recipes array are fulfilled. Note: those promises
                             * may either be resolved or rejected.
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

                    // during dev, this warns that a cached version was not used
                    console.log(error);

                    // unirest is used to communicate with Mashape API
                    uniRest.get(thisCaller.buildGetString(recipeID))
                        .header("X-Mashape-Key", thisCaller.API_KEY)
                        .header("Accept", "application/json")
                        .end(function (result: IResponse) {

                            db.storeRecipeResponse(Constants.DB_MASHAPE,
                                recipeID, JSON.stringify(result.body));

                            resolve(thisCaller.buildRecipe(
                                JSON.stringify(result.body)));
                        });
                });
        });
    }

    /** @inheritdoc */
    public buildSearchString(userOptions: ICallOptions): string {

        // 'querystring' module interprets userOptions to URL-friendly string
        let parameters = qs.stringify({

            fillIngredients: false,

            // the only parameter essential to this API call
            ingredients: userOptions.ingredients,

            limitLicense: false,
            number: Constants.MASHAPE_RESULT_LIMIT,
            ranking: Constants.MASHAPE_MIN_MISSING
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
        let image = responseAsJSON.image;
        let source = responseAsJSON.sourceUrl;

        let ingredientsArray = new Array<Ingredient>();
        for (let ingredient of ingredients) {

            ingredientsArray.push(new Ingredient(ingredient.name,
                ingredient.amount, ingredient.unit));
        }

        let servings = responseAsJSON.servings;
        let timeToMake = responseAsJSON.readyInMinutes * 60;

        return new Recipe(name, ingredientsArray, method,
            allergens, image, source, servings, timeToMake);
    }

    /** @inheritdoc */
    public extractRecipes(response: string): Array<string> {

        let filter = new MashapeFilter();
        let sortedResponse = filter.filterByIngredients(response);

        let result = new Array<string>();
        for (let recipe of JSON.parse(sortedResponse)) {

            result.push((<IMashapeSearchItem>recipe).id.toString());
        }

        return result;
    }
}

/**
 * @classdesc Class handles making API calls to Yummly.
 */
export class YummlyCaller implements ICaller {

    /*
	 * NOTE: FOLLOWING API REQUIRED FOR YummlyCaller API
	 */

    private readonly API_ID = "";

    private readonly API_KEY = "";

    /** @inheritdoc */
    public call(userOptions: ICallOptions): Promise<Array<Recipe>> {

        // since 'this' loses scope inside the Promise, we store it here
        let thisCaller = this;

        return new Promise<Array<Recipe>>(function (resolve, reject) {

            /*
             * Initially attempts to fetch a response using given userOptions
             * from the DB. If this succeeds, the recipes referred to in the
             * response are fetched. If it fails, Yummly API is contacted.
             */
            let db = new Database();
            db.fetchSearchResponse(Constants.DB_YUMMLY, userOptions.ingredients)
                .then(function (response) {

                    let recipes = new Array<Promise<Recipe>>();
                    let recipeIDs = thisCaller.extractRecipes(response,
                        userOptions);
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

                    // during dev, this warns that a cached version was not used
                    console.log(error);

                    uniRest.get(thisCaller.buildSearchString(userOptions))
                        .header("X-Yummly-App-ID", thisCaller.API_ID)
                        .header("X-Yummly-App-Key", thisCaller.API_KEY)
                        .header("Accept", "application/json")
                        .end(function (result: IResponse) {

                            db.storeSearchResponse(Constants.DB_YUMMLY,
                                userOptions.ingredients,
                                JSON.stringify(result.body));

                            let recipes = new Array<Promise<Recipe>>();
                            let recipeIDs = thisCaller.extractRecipes(
                                JSON.stringify(result.body), userOptions);

                            for (let id of recipeIDs) {

                                recipes.push(thisCaller.get(id));
                            }

                            /*
                             * Following is executed once all promises in
                             * recipes array are fulfilled. Note: those promises
                             * may either be resolved or rejected.
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
            db.fetchRecipeResponse(Constants.DB_YUMMLY, recipeID)
                .then(function (response) {

                    resolve(thisCaller.buildRecipe(response));
                })
                .catch(function (error) {

                    console.log(error);

                    uniRest.get(thisCaller.buildGetString(recipeID))
                        .header("X-Yummly-App-ID", thisCaller.API_ID)
                        .header("X-Yummly-App-Key", thisCaller.API_KEY)
                        .header("Accept", "application/json")
                        .end(function (result: IResponse) {

                            db.storeRecipeResponse(Constants.DB_YUMMLY,
                                recipeID, JSON.stringify(result.body));

                            resolve(thisCaller.buildRecipe(
                                JSON.stringify(result.body)));
                        });
                });
        });
    }

    /** @inheritdoc */
    public buildSearchString(userOptions: ICallOptions): string {

        // 'querystring' module interprets userOptions to URL-friendly string
        let parameters = qs.stringify({

            // the comma-separated list must be split by a space
            q: userOptions.ingredients.replace(/,/g, " "),
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

        let responseAsJSON = <IYummlyRecipe>JSON.parse(response);

        let name = responseAsJSON.name;
        let ingredients = responseAsJSON.ingredientLines
            .map(function (ingredient) {

                // TODO: consider abstracting out

                let volume = CallerUtils.getIngredientVolume(ingredient);
                let name = CallerUtils.getIngredientName(ingredient);

                /*
                 * If the returned volume is greater than 0, it can be used as
                 * ingredient's volume. Otherwise, where no volume is found, a
                 * value of 0 is given.
                 */
                if (volume > 0) {

                    return new Ingredient(name,
                        volume, "");

                } else {

                    return new Ingredient(name, 0, "");
                }
            });

        // note: caller assumes images is array of length one
        let image = responseAsJSON.images[0].hostedLargeUrl;
        let source = responseAsJSON.source.sourceRecipeUrl;
        let servings = responseAsJSON.numberOfServings;
        let timeToMake = responseAsJSON.totalTimeInSeconds;
        let attributionText = responseAsJSON.attribution.text;
        let attributionHTML = responseAsJSON.attribution.html;

        return new Recipe(name, ingredients, "", new Array<string>(), image,
            source, servings, timeToMake, attributionText, attributionHTML);
    }

    /** @inheritdoc */
    public extractRecipes(response: string,
        userOptions: ICallOptions): Array<string> {

        let filter = new YummlyFilter();
        let sortedResponse = filter.filterByIngredients(response, userOptions);

        let result = new Array<string>();
        for (let recipe of JSON.parse(sortedResponse)) {

            result.push((<IYummlySearchItem>recipe).id);
        }

        return result;
    }
}
