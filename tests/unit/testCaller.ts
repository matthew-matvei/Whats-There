import fs = require("fs");

import Ingredient from "../../src/ingredient";
import Recipe from "../../src/recipe";
import { FoodToForkCaller, YummlyCaller, MashapeCaller } from
    "../../src/api/caller";
import { Constants } from "../../src/constants";
import CallerUtils from "../../src/api/callerUtils";
import { ICallOptions } from "../../src/api/callOptions";
import { IMashapeRecipe, IYummlyRecipe, IMashapeIngredient } from
    "../../src/api/callerInterfaces";

let expect = require("chai").expect;

let singleIngredientOptions: ICallOptions;
let spaceIngredientOptions: ICallOptions;
let multiIngredientsOptions: ICallOptions;

let ftfCaller: FoodToForkCaller;
let mashapeCaller: MashapeCaller;
let yummlyCaller: YummlyCaller;

let ftfSearchResponse: string;
let mashapeSearchResponse: string;
let mashapeGetResponse: string;
let yummlySearchResponse: string;
let yummlyGetResponse: string;

before(function () {

    ftfSearchResponse = fs.readFileSync(
        "tests/unit/responses/F2F-recipes-search.json", "utf8");
    mashapeSearchResponse = fs.readFileSync(
        "tests/unit/responses/mashape-recipe-search.json", "utf8");
    mashapeGetResponse = fs.readFileSync(
        "tests/unit/responses/mashape-recipe-get.json", "utf8");
    yummlySearchResponse = fs.readFileSync(
        "tests/unit/responses/yummly-recipe-search.json", "utf8");
    yummlyGetResponse = fs.readFileSync(
        "tests/unit/responses/yummly-recipe-get.json", "utf8");

    singleIngredientOptions = <ICallOptions>{
        ingredients: "ingredient1",
        allergies: new Array<string>(),
        ratio: 1
    };

    spaceIngredientOptions = <ICallOptions>{
        ingredients: "ingredient 1",
        allergies: new Array<string>(),
        ratio: 1
    };

    let ingredients = new Array<Ingredient>();
    ingredients.push(new Ingredient("ingredient1", 10, "ml"));
    ingredients.push(new Ingredient("ingredient2", 20, "ml"));

    multiIngredientsOptions = <ICallOptions>{
        ingredients: "ingredient1,ingredient2",
        allergies: new Array<string>(),
        ratio: 1
    };

    ftfCaller = new FoodToForkCaller();
    mashapeCaller = new MashapeCaller();
    yummlyCaller = new YummlyCaller();
});

/** Test suite checks functionality defined in '../../src/api/caller' */
describe("Class FoodToForkCaller's", function () {

    let expectedRecipeIDs: Array<string>;

    before(function () {

        expectedRecipeIDs = new Array<string>();
        expectedRecipeIDs.push("35171");
        expectedRecipeIDs.push("29159");
        expectedRecipeIDs.push("e7fdb2");
    });

    describe("buildSearchString() method", function () {

        it("builds the expected string", function () {

            let expectedURL = Constants.F2F_URL +
                Constants.F2F_SEARCH_RECIPES_PATH + "?key=" +
                "3f3ce1ce11e5c3482673f33008e0d706" + "&" +
                "q=ingredient1";

            expect(ftfCaller.buildSearchString(singleIngredientOptions))
                .to.equal(expectedURL);
        });

        it("builds a URL with multiple ingredients", function () {

            let expectedURL = Constants.F2F_URL +
                Constants.F2F_SEARCH_RECIPES_PATH + "?key=" +
                "3f3ce1ce11e5c3482673f33008e0d706" + "&" +
                "q=ingredient1%2Cingredient2";

            expect(ftfCaller.buildSearchString(multiIngredientsOptions))
                .to.equal(expectedURL);
        });

        it("builds a URL with correct escaping for whitespace", function () {

            let expectedURL = Constants.F2F_URL +
                Constants.F2F_SEARCH_RECIPES_PATH + "?key=" +
                "3f3ce1ce11e5c3482673f33008e0d706" + "&" +
                "q=ingredient%201";

            expect(ftfCaller.buildSearchString(spaceIngredientOptions))
                .to.equal(expectedURL);
        });
    });

    describe("buildGetString() method", function () {

        it("builds a URL with numeric recipe", function () {

            let recipeID = "1050";
            let expectedString = Constants.F2F_URL +
                Constants.F2F_GET_RECIPE_PATH + "?key=" +
                "3f3ce1ce11e5c3482673f33008e0d706" + "&" + "rId=" + recipeID;

            expect(ftfCaller.buildGetString(recipeID)).to
                .equal(expectedString);
        });

        it("builds a URL with non-numeric recipe", function () {

            let recipeID = "alpha";
            let expectedString = Constants.F2F_URL +
                Constants.F2F_GET_RECIPE_PATH + "?key=" +
                "3f3ce1ce11e5c3482673f33008e0d706" + "&" + "rId=" + recipeID;

            expect(ftfCaller.buildGetString(recipeID)).to
                .equal(expectedString);
        });

        it("builds a URL with hyphened IDs", function () {

            let recipeID = "One-Two";
            let expectedString = Constants.F2F_URL +
                Constants.F2F_GET_RECIPE_PATH + "?key=" +
                "3f3ce1ce11e5c3482673f33008e0d706" + "&" + "rId=" + recipeID;

            expect(ftfCaller.buildGetString(recipeID)).to
                .equal(expectedString);
        });
    });

    describe("extractRecipes() method", function () {

        it("extracts recipe IDs", function () {

            /*
             * Note: due to a difference between actual API response and
             * example response on file, ftfSearchResponse is JSON stringified
             * here.
             */
            expect(ftfCaller.extractRecipes(JSON.stringify(ftfSearchResponse)))
                .to.deep.equal(expectedRecipeIDs);
        });
    });
});

describe("Class EdamamCaller's", function () {

    describe("buildQueryString() method", function () {

        it("builds the expected string", function () {


        });

        it("builds a URL with multiple ingredients", function () {


        });

        it("builds a URL with correct escaping for whitespace", function () {


        });
    });

    describe("extractRecipes() method", function () {


    });
});

describe("Class MashapeCaller's", function () {

    let expectedRecipeIDs: Array<string>;
    let expectedName: string;
    let expectedIngredients: Array<Ingredient>;
    let expectedMethod: string;
    let expectedAllergens: Array<string>;
    let expectedImage: string;
    let expectedSource: string;
    let expectedServings: number;
    let expectedTimeToMake: number;

    let expectedRecipe: Recipe;

    before(function () {

        expectedRecipeIDs = new Array<string>();
        expectedRecipeIDs.push("534573");
        expectedRecipeIDs.push("556470");
        expectedRecipeIDs.push("47732");

        let expectedResponse = <IMashapeRecipe>JSON.parse(mashapeGetResponse);

        expectedName = expectedResponse.title;
        expectedIngredients = new Array<Ingredient>();
        expectedMethod = expectedResponse.instructions;
        expectedAllergens = new Array<string>();
        expectedImage = expectedResponse.image;
        expectedSource = expectedResponse.sourceUrl;
        expectedServings = expectedResponse.servings;
        expectedTimeToMake = expectedResponse.readyInMinutes * 60;

        <IMashapeRecipe>JSON.parse(mashapeGetResponse).extendedIngredients
            .map(function (ingredient: IMashapeIngredient) {

                expectedIngredients.push(new Ingredient(ingredient.name,
                    ingredient.amount, ingredient.unit));
            });

        expectedRecipe = new Recipe(expectedName, expectedIngredients,
            expectedMethod, expectedAllergens, expectedImage, expectedSource,
            expectedServings, expectedTimeToMake);
    });

    describe("buildSearchString() method", function () {

        it("builds the expected string", function () {

            let expectedURL = Constants.MASHAPE_URL +
                Constants.MASHAPE_SEARCH_RECIPES_PATH + "?" +
                "fillIngredients=false&" + "ingredients=ingredient1" +
                "&limitLicense=false&number=" + Constants.MASHAPE_RESULT_LIMIT +
                "&ranking=" + Constants.MASHAPE_MIN_MISSING;

            expect(mashapeCaller.buildSearchString(singleIngredientOptions))
                .to.equal(expectedURL);
        });

        it("builds a URL with multiple ingredients", function () {

            let expectedURL = Constants.MASHAPE_URL +
                Constants.MASHAPE_SEARCH_RECIPES_PATH + "?" +
                "fillIngredients=false&" +
                "ingredients=ingredient1%2Cingredient2&" +
                "limitLicense=false&number=" + Constants.MASHAPE_RESULT_LIMIT +
                "&ranking=" + Constants.MASHAPE_MIN_MISSING;

            expect(mashapeCaller.buildSearchString(multiIngredientsOptions))
                .to.equal(expectedURL);
        });

        it("builds a URL with correct escaping for whitespace", function () {

            let expectedURL = Constants.MASHAPE_URL +
                Constants.MASHAPE_SEARCH_RECIPES_PATH + "?" +
                "fillIngredients=false&" + "ingredients=ingredient%201&" +
                "limitLicense=false&number=" + Constants.MASHAPE_RESULT_LIMIT +
                "&ranking=" + Constants.MASHAPE_MIN_MISSING;

            expect(mashapeCaller.buildSearchString(spaceIngredientOptions))
                .to.equal(expectedURL);
        });
    });

    describe("buildGetString() method", function () {

        it("builds a URL with numeric recipe", function () {

            let recipeID = "1050";
            let expectedString = Constants.MASHAPE_URL +
                Constants.MASHAPE_GET_RECIPE_PATH_PREFIX + recipeID +
                Constants.MASHAPE_GET_RECIPE_PATH_SUFFIX;

            expect(mashapeCaller.buildGetString(recipeID)).to
                .equal(expectedString);
        });

        it("builds a URL with non-numeric recipe", function () {

            let recipeID = "alpha";
            let expectedString = Constants.MASHAPE_URL +
                Constants.MASHAPE_GET_RECIPE_PATH_PREFIX + recipeID +
                Constants.MASHAPE_GET_RECIPE_PATH_SUFFIX;

            expect(mashapeCaller.buildGetString(recipeID)).to
                .equal(expectedString);
        });
    });

    describe("buildRecipe() method", function () {

        it("builds a recipe", function () {

            expect(mashapeCaller.buildRecipe(mashapeGetResponse)
                .equals(expectedRecipe)).to.be.true;
        });
    });

    describe("extractRecipes() method", function () {

        it("extracts recipe IDs", function () {

            expect(mashapeCaller.extractRecipes(mashapeSearchResponse)).to.deep
                .equal(expectedRecipeIDs);
        });
    });
});

describe("Class YummlyCaller's", function () {

    let expectedRecipeIDs: Array<string>;
    let expectedName: string;
    let expectedIngredients: Array<Ingredient>;
    let expectedMethod: string;
    let expectedAllergens: Array<string>;
    let expectedImage: string;
    let expectedSource: string;
    let expectedServings: number;
    let expectedTimeToMake: number;

    let expectedRecipe: Recipe;

    before(function () {

        expectedRecipeIDs = new Array<string>();
        expectedRecipeIDs.push("Chunky-Rice-And-Bean-Soup-Recipezaar");
        expectedRecipeIDs.push("Vegetarian-Cabbage-Soup-Recipezaar");
        expectedRecipeIDs.push("Oriental-Inspired-Vegetable-Soup-Recipezaar");

        let expectedResponse = <IYummlyRecipe>JSON.parse(yummlyGetResponse);

        expectedName = expectedResponse.name;
        expectedIngredients = new Array<Ingredient>();
        expectedMethod = "";
        expectedAllergens = new Array<string>();
        expectedImage = expectedResponse.images[0].hostedLargeUrl;
        expectedSource = expectedResponse.source.sourceRecipeUrl;
        expectedServings = expectedResponse.numberOfServings;
        expectedTimeToMake = expectedResponse.totalTimeInSeconds;

        (<IYummlyRecipe>JSON.parse(yummlyGetResponse)).ingredientLines
            .map(function (ingredient: string) {

                expectedIngredients.push(new Ingredient(
                    CallerUtils.getIngredientName(ingredient),
                    CallerUtils.getIngredientVolume(ingredient), ""));
            });

        expectedRecipe = new Recipe(expectedName, expectedIngredients,
            expectedMethod, expectedAllergens, expectedImage, expectedSource,
            expectedServings, expectedTimeToMake);
    });

    describe("buildSearchString() method", function () {

        it("builds the expected string", function () {

            let expectedURL = Constants.YUMMLY_URL +
                Constants.YUMMLY_SEARCH_RECIPES_PATH + "?" +
                "q=ingredient1" + "&requirePictures=false";

            expect(yummlyCaller.buildSearchString(singleIngredientOptions))
                .to.equal(expectedURL);
        });

        it("builds a URL with multiple ingredients", function () {

            let expectedURL = Constants.YUMMLY_URL +
                Constants.YUMMLY_SEARCH_RECIPES_PATH + "?" +
                "q=ingredient1%20ingredient2" + "&requirePictures=false";

            expect(yummlyCaller.buildSearchString(multiIngredientsOptions))
                .to.equal(expectedURL);
        });

        it("builds a URL with correct escaping for whitespace", function () {

            let expectedURL = Constants.YUMMLY_URL +
                Constants.YUMMLY_SEARCH_RECIPES_PATH + "?" +
                "q=ingredient%201" + "&requirePictures=false";

            expect(yummlyCaller.buildSearchString(spaceIngredientOptions))
                .to.equal(expectedURL);
        });
    });

    describe("buildGetString() method", function () {

        it("builds a URL with numeric recipe", function () {

            let recipeID = "1050";
            let expectedString = Constants.YUMMLY_URL +
                Constants.YUMMLY_GET_RECIPE_PATH + recipeID;

            expect(yummlyCaller.buildGetString(recipeID)).to
                .equal(expectedString);
        });

        it("builds a URL with non-numeric recipe", function () {

            let recipeID = "alpha";
            let expectedString = Constants.YUMMLY_URL +
                Constants.YUMMLY_GET_RECIPE_PATH + recipeID;

            expect(yummlyCaller.buildGetString(recipeID)).to
                .equal(expectedString);
        });

        it("builds a URL with hyphened IDs", function () {

            let recipeID = "One-Two";
            let expectedString = Constants.YUMMLY_URL +
                Constants.YUMMLY_GET_RECIPE_PATH + recipeID;

            expect(yummlyCaller.buildGetString(recipeID)).to
                .equal(expectedString);
        });
    });

    describe("buildRecipe() method", function () {

        it("builds a recipe", function () {

            expect(yummlyCaller.buildRecipe(yummlyGetResponse)
                .equals(expectedRecipe)).to.be.true;
        });
    });

    describe("extractRecipes() method", function () {

        it("extracts recipe IDs", function () {

            expect(yummlyCaller.extractRecipes(yummlySearchResponse,
                singleIngredientOptions)).to.deep.equal(expectedRecipeIDs);
        });
    });
});
