let expect = require("chai").expect;

import Sorter from "../../src/sorter";
import Recipe from "../../src/recipe";
import Ingredient from "../../src/ingredient";
import { Constants } from "../../src/constants";

describe("Class Sorter's sort() method,", function () {

    let recipe1: Recipe;
    let recipe1Comma: Recipe;
    let recipe2: Recipe;
    let recipe3: Recipe;
    let recipeZero: Recipe;
    let recipes: Array<Recipe>;
    let ingredient1: Ingredient;
    let ingredient1Comma: Ingredient;
    let ingredient2: Ingredient;
    let ingredient3: Ingredient;
    let ingredient4: Ingredient;
    let ingredient5: Ingredient;
    let userIngredients: Array<Ingredient>;
    let expected: Array<Recipe>;
    let sortCriteria: string;
    let sortOrder: string;

    before(function () {

        ingredient1 = new Ingredient("Ingredient1", 10, "");
        ingredient1Comma = new Ingredient("Ingredient1,", 10, "");
        ingredient2 = new Ingredient("Ingredient2", 10, "");
        ingredient3 = new Ingredient("Ingredient3", 10, "");
        ingredient4 = new Ingredient("Ingredient4", 10, "");
        ingredient5 = new Ingredient("Ingredient5", 10, "");
        userIngredients = [ingredient1, ingredient2, ingredient3];

        recipe1 = new Recipe("Recipe1", [ingredient1, ingredient2, ingredient3],
            "Method", new Array<string>(), "Image", "URL", 10, 10);
        recipe1Comma = new Recipe("Recipe1Comma", [ingredient1Comma,
            ingredient2, ingredient3], "Method", new Array<string>(), "Image",
            "URL", 10, 10);
        recipe2 = new Recipe("Recipe2", [ingredient1, ingredient2, ingredient4],
            "Method", new Array<string>(), "Image", "URL", 9, 9);
        recipe3 = new Recipe("Recipe2", [ingredient1, ingredient4, ingredient5],
            "Method", new Array<string>(), "Image", "URL", 8, 8);
        recipeZero = new Recipe("Recipe Zero", [ingredient1, ingredient2,
            ingredient3], "Method", new Array<string>(), "Image", "URL", 0, 0);
    });

    // TODO: check class throws Errors

    describe("sorting by relevance", function () {

        before(function () {

            sortCriteria = Constants.SORT_BY_RELEVANCE;
        });

        it(", returns an empty array when given " +
            "an empty array", function () {

                recipes = new Array<Recipe>();
                expected = new Array<Recipe>();

                expect(Sorter.sort(recipes, userIngredients, sortCriteria,
                    Constants.SORT_DESCENDING)).to.deep.equal(expected);
            });

        it(", returns an identical array when given an array " +
            "of length one", function () {

                recipes = [recipe1];
                expected = [recipe1];

                expect(Sorter.sort(recipes, userIngredients, sortCriteria,
                    Constants.SORT_DESCENDING)).to.deep.equal(expected);
            });

        describe("in descending order,", function () {

            before(function () {

                sortOrder = Constants.SORT_DESCENDING;
            });

            it("sorts an array of two recipes", function () {

                recipes = [recipe2, recipe1];
                expected = [recipe1, recipe2];

                expect(Sorter.sort(recipes, userIngredients, sortCriteria,
                    sortOrder)).to.deep.equal(expected);
            });

            it("sorts an array of three recipes", function () {

                recipes = [recipe3, recipe1, recipe2];
                expected = [recipe1, recipe2, recipe3];

                expect(Sorter.sort(recipes, userIngredients, sortCriteria,
                    sortOrder)).to.deep.equal(expected);
            });

            it("can handle ingredients with commas", function () {

                recipes = [recipe2, recipe1Comma];
                expected = [recipe1Comma, recipe2];

                expect(Sorter.sort(recipes, userIngredients, sortCriteria,
                    sortOrder)).to.deep.equal(expected);
            });
        });

        describe("in ascending order,", function () {

            before(function () {

                sortOrder = Constants.SORT_ASCENDING;
            });

            it("sorts an array of two recipes", function () {

                recipes = [recipe1, recipe2];
                expected = [recipe2, recipe1];

                expect(Sorter.sort(recipes, userIngredients, sortCriteria,
                    sortOrder)).to.deep.equal(expected);
            });

            it("sorts an array of three recipes", function () {

                recipes = [recipe2, recipe1, recipe3];
                expected = [recipe3, recipe2, recipe1];

                expect(Sorter.sort(recipes, userIngredients, sortCriteria,
                    sortOrder)).to.deep.equal(expected);
            });

            it("can handle ingredients with commas", function () {

                recipes = [recipe1Comma, recipe2];
                expected = [recipe2, recipe1Comma];

                expect(Sorter.sort(recipes, userIngredients, sortCriteria,
                    sortOrder)).to.deep.equal(expected);
            });
        });
    });

    describe("sorting by time", function () {

        before(function () {

            sortCriteria = Constants.SORT_BY_TIME_TAKEN;
        });

        it(", returns an empty array when given " +
            "an empty array", function () {

                recipes = new Array<Recipe>();
                expected = new Array<Recipe>();

                expect(Sorter.sort(recipes, userIngredients, sortCriteria,
                    Constants.SORT_DESCENDING)).to.deep.equal(expected);
            });

        it(", returns an identical array when given an array " +
            "of length one", function () {

                recipes = [recipe1];
                expected = [recipe1];

                expect(Sorter.sort(recipes, userIngredients, sortCriteria,
                    Constants.SORT_DESCENDING)).to.deep.equal(expected);
            });

        describe("in descending order,", function () {

            before(function () {

                sortOrder = Constants.SORT_DESCENDING;
            });

            it("sorts an array of two recipes", function () {

                recipes = [recipe2, recipe1];
                expected = [recipe1, recipe2];

                expect(Sorter.sort(recipes, userIngredients, sortCriteria,
                    sortOrder)).to.deep.equal(expected);
            });

            it("sorts an array of three recipes", function () {

                recipes = [recipe3, recipe1, recipe2];
                expected = [recipe1, recipe2, recipe3];

                expect(Sorter.sort(recipes, userIngredients, sortCriteria,
                    sortOrder)).to.deep.equal(expected);
            });

            it("can handle time to make value of 0", function () {

                recipes = [recipe1, recipeZero];
                expected = [recipeZero, recipe1];

                expect(Sorter.sort(recipes, userIngredients, sortCriteria,
                    sortOrder)).to.deep.equal(expected);
            });
        });

        describe("in ascending order,", function () {

            before(function () {

                sortOrder = Constants.SORT_ASCENDING;
            });

            it("sorts an array of two recipes", function () {

                recipes = [recipe1, recipe2];
                expected = [recipe2, recipe1];

                expect(Sorter.sort(recipes, userIngredients, sortCriteria,
                    sortOrder)).to.deep.equal(expected);
            });

            it("sorts an array of three recipes", function () {

                recipes = [recipe2, recipe1, recipe3];
                expected = [recipe3, recipe2, recipe1];

                expect(Sorter.sort(recipes, userIngredients, sortCriteria,
                    sortOrder)).to.deep.equal(expected);
            });

            it("can handle time to make value of 0", function () {

                recipes = [recipeZero, recipe1];
                expected = [recipe1, recipeZero];

                expect(Sorter.sort(recipes, userIngredients, sortCriteria,
                    sortOrder)).to.deep.equal(expected);
            });
        });
    });

    describe("sorting by servings", function () {

        before(function () {

            sortCriteria = Constants.SORT_BY_SERVINGS;
        });

        it(", returns an empty array when given " +
            "an empty array", function () {

                recipes = new Array<Recipe>();
                expected = new Array<Recipe>();

                expect(Sorter.sort(recipes, userIngredients, sortCriteria,
                    Constants.SORT_DESCENDING)).to.deep.equal(expected);
            });

        it(", returns an identical array when given an array " +
            "of length one", function () {

                recipes = [recipe1];
                expected = [recipe1];

                expect(Sorter.sort(recipes, userIngredients, sortCriteria,
                    Constants.SORT_DESCENDING)).to.deep.equal(expected);
            });

        describe("in descending order,", function () {

            before(function () {

                sortOrder = Constants.SORT_DESCENDING;
            });

            it("sorts an array of two recipes", function () {

                recipes = [recipe2, recipe1];
                expected = [recipe1, recipe2];

                expect(Sorter.sort(recipes, userIngredients, sortCriteria,
                    sortOrder)).to.deep.equal(expected);
            });

            it("sorts an array of three recipes", function () {

                recipes = [recipe3, recipe1, recipe2];
                expected = [recipe1, recipe2, recipe3];

                expect(Sorter.sort(recipes, userIngredients, sortCriteria,
                    sortOrder)).to.deep.equal(expected);
            });

            it("can handle servings value of 0", function () {

                recipes = [recipe1, recipeZero];
                expected = [recipeZero, recipe1];

                expect(Sorter.sort(recipes, userIngredients, sortCriteria,
                    sortOrder)).to.deep.equal(expected);
            });
        });

        describe("in ascending order,", function () {

            before(function () {

                sortOrder = Constants.SORT_ASCENDING;
            });

            it("sorts an array of two recipes", function () {

                recipes = [recipe1, recipe2];
                expected = [recipe2, recipe1];

                expect(Sorter.sort(recipes, userIngredients, sortCriteria,
                    sortOrder)).to.deep.equal(expected);
            });

            it("sorts an array of three recipes", function () {

                recipes = [recipe2, recipe1, recipe3];
                expected = [recipe3, recipe2, recipe1];

                expect(Sorter.sort(recipes, userIngredients, sortCriteria,
                    sortOrder)).to.deep.equal(expected);
            });

            it("can handle servings value of 0", function () {

                recipes = [recipeZero, recipe1];
                expected = [recipe1, recipeZero];

                expect(Sorter.sort(recipes, userIngredients, sortCriteria,
                    sortOrder)).to.deep.equal(expected);
            });
        });
    });
});
