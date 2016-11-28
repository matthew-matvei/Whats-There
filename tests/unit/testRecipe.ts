/// <reference path="../../typings/index.d.ts" />

import { UnregisteredUser } from "../../src/user";
import Recipe from "../../src/recipe";
import Ingredient from "../../src/ingredient";
import Constants from "../../src/constants";

let expect = require("chai").expect;
let assert = require("chai").assert;

/** Test suite checks functionality defined in '../../src/recipe' */
describe("Class Recipe's", function () {

    let recipe: Recipe;
    let ingredient: Ingredient;
    let ingredients: Array<Ingredient>;
    let allergen: string;
    let allergens: Array<string>;

    before(function () {

        ingredient = new Ingredient("Ingredient1", 10, "ml");
        allergen = "Allergen1";
    });

    beforeEach(function () {

        ingredients = new Array<Ingredient>();
        ingredients.push(ingredient);
        allergens = new Array<string>();
    });

    afterEach(function () {

        expect(recipe.checkInvariant()).to.be.true;
    });

    describe("Constructor method", function () {

        it("constructs a valid recipe", function () {

            recipe = new Recipe("Recipe1", ingredients, "Method",
                allergens, "URL");
        });
    });

    describe("getName() method", function () {

        it("returns the expected name in lower case", function () {

            let expectedName = "recipe1";
            recipe = new Recipe("Recipe1", ingredients, "Method", allergens, "URL");

            expect(recipe.getName()).to.equal(expectedName);
        });
    });

    describe("getIngredients() method", function () {

        it("returns the ingredients when there is just one " +
            "ingredient", function () {

                recipe = new Recipe("Recipe1", ingredients, "Method",
                    allergens, "URL");

                expect(recipe.getIngredients()).to.deep.equal(ingredients);
            });

        it("returns the ingredients when there are two", function () {

            let ingredient2 = new Ingredient("Ingredient2", 20, "ml");
            ingredients.push(ingredient2);
            recipe = new Recipe("Recipe1", ingredients, "Method",
                new Array<string>(), "URL");

            expect(recipe.getIngredients()).to.deep.equal(ingredients);
        });

        it("does not expose the original ingredients array", function () {

            recipe = new Recipe("Recipe1", ingredients, "Method",
                new Array<string>(), "URL");

            recipe.getIngredients().pop();

            expect(recipe.getIngredients()).to.include(ingredient);
        });
    });

    describe("getMethod() method", function () {

        it("returns the method", function () {

            let expectedMethod = "Method";

            recipe = new Recipe("Recipe1", ingredients, "Method",
                new Array<string>(), "URL");

            expect(recipe.getMethod()).to.equal(expectedMethod);
        });
    });

    describe("getAllergens() method", function () {

        it("returns an empty array when there are none", function () {

            recipe = new Recipe("Recipe1", ingredients, "Method", allergens, "URL");

            expect(recipe.getAllergens()).to.deep.equal(new Array<string>());
        });

        it("returns the allergens when there is just one " +
            "allergen", function () {

                allergens.push("Allergen1");
                recipe = new Recipe("Recipe1", ingredients, "Method",
                    allergens, "URL");

                expect(recipe.getAllergens()).to.deep.equal(allergens);
            });

        it("returns the allergens when there are two", function () {

            allergens.push("Allergen1");
            allergens.push("Allergen2");
            recipe = new Recipe("Recipe1", ingredients, "Method",
                allergens, "URL");

            expect(recipe.getAllergens()).to.deep.equal(allergens);
        });

        it("does not expose the original allergens array", function () {

            allergens.push("Allergen1");
            recipe = new Recipe("Recipe1", ingredients, "Method",
                allergens, "URL");

            recipe.getAllergens().pop();

            expect(recipe.getAllergens()).to.deep.equal(allergens);
        });
    });

    describe("equals() method", function () {

        it("returns false if other object is not a Recipe", function () {

            ingredient = new Ingredient("Ingredient1", 10, "ml");

            expect(recipe.equals(ingredient)).to.be.false;
        });

        it("returns false if other recipe has different " +
            "number of ingredients", function () {

                let ingredient1 = new Ingredient("Ingredient1", 10, "ml");
                let ingredient2 = new Ingredient("Ingredient2", 20, "ml");
                let otherIngredients = new Array<Ingredient>();
                otherIngredients.push(ingredient1);
                otherIngredients.push(ingredient2);
                let otherRecipe = new Recipe("Recipe2", otherIngredients,
                    "Method2", new Array<string>(), "URL");

                recipe = new Recipe("Recipe1", ingredients, "Method",
                    allergens, "URL");

                expect(recipe.equals(otherRecipe)).to.be.false;
            });

        it("returns false if any of the ingredients are " +
            "different in the two recipes", function () {

                let ingredient1 = new Ingredient("Ingredient2", 20, "ml");
                let otherIngredients = new Array<Ingredient>();
                otherIngredients.push(ingredient1);
                let otherRecipe = new Recipe("Recipe2", otherIngredients,
                    "Method1", new Array<string>(), "URL");

                recipe = new Recipe("Recipe1", ingredients, "Method",
                    allergens, "URL");

                expect(recipe.equals(otherRecipe)).to.be.false;
            });

        it("returns true if the other recipe has the same " +
            "ingredients", function () {

                let ingredient1 = new Ingredient("Ingredient1", 10, "ml");
                let otherIngredients = new Array<Ingredient>();
                otherIngredients.push(ingredient1);
                let otherRecipe = new Recipe("Recipe1", otherIngredients,
                    "Method1", new Array<string>(), "URL");

                recipe = new Recipe("Recipe1", ingredients, "Method",
                    allergens, "URL");

                expect(recipe.equals(otherRecipe)).to.be.true;
            });

        it("returns true if the other recipe has the same " +
            "ingredients but a different name", function () {

                let ingredient1 = new Ingredient("Ingredient1", 10, "ml");
                let otherIngredients = new Array<Ingredient>();
                otherIngredients.push(ingredient1);
                let otherRecipe = new Recipe("Recipe2", otherIngredients,
                    "Method1", new Array<string>(), "URL");

                recipe = new Recipe("Recipe1", ingredients, "Method",
                    allergens, "URL");

                expect(recipe.equals(otherRecipe)).to.be.true;
            });
    });
});