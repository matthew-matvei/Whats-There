import Utils from "../../src/utils";
import Recipe from "../../src/recipe";
import Ingredient from "../../src/ingredient";

import { IRecipeAsJSON } from "../../src/interfaces";

let expect = require("chai").expect;
let assert = require("chai").assert;

describe("Class Util's", function () {

    describe("hash() method", function () {


    });

    describe("parseRecipe() method", function () {

        let expectedName: string;
        let expectedIngredients: Array<Ingredient>;
        let expectedMethod: string;
        let expectedAllergens: Array<string>;
        let expectedSourceURL: string;

        let recipe: Recipe;
        let ingredient1: Ingredient;
        let ingredient2: Ingredient;

        before(function () {

            expectedName = "Recipe";
            ingredient1 = new Ingredient("Ingredient1", 10, "ml");
            ingredient2 = new Ingredient("Ingredient2", 20, "mg");
            expectedSourceURL = "URL";
        });

        beforeEach(function () {

            expectedIngredients = new Array<Ingredient>();
            expectedAllergens = new Array<string>();
        });

        it("can parse a regular recipe", function () {

            expectedIngredients.push(ingredient1);
            expectedMethod = "Method";
            expectedAllergens.push("Allergen1");
            recipe = new Recipe(expectedName, expectedIngredients,
                expectedMethod, expectedAllergens, expectedSourceURL);
            let definition = getDefinition(expectedName, expectedIngredients, expectedMethod, expectedAllergens, expectedSourceURL);

            expect(Utils.parseRecipe(definition).equals(recipe)).to.be.true;
        });

        it("can parse a recipe with no method", function () {

            expectedIngredients.push(ingredient1);
            expectedMethod = null;
            expectedAllergens.push("Allergen1");
            recipe = new Recipe(expectedName, expectedIngredients, expectedMethod, expectedAllergens, expectedSourceURL);
            let definition = getDefinition(expectedName, expectedIngredients, expectedMethod, expectedAllergens, expectedSourceURL);

            expect(Utils.parseRecipe(definition).equals(recipe)).to.be.true;
        });

        it("can parse a recipe with one ingredient", function () {

            expectedIngredients.push(ingredient1);
            expectedMethod = "Method";
            expectedAllergens.push("Allergen1");
            recipe = new Recipe(expectedName, expectedIngredients,
                expectedMethod, expectedAllergens, expectedSourceURL);
            let definition = getDefinition(expectedName, expectedIngredients,
                expectedMethod, expectedAllergens, expectedSourceURL);

            expect(Utils.parseRecipe(definition).equals(recipe)).to.be.true;
        });

        it("can parse a recipe with two ingredients", function () {

            expectedIngredients.push(ingredient1);
            expectedIngredients.push(ingredient2);
            expectedMethod = "Method";
            expectedAllergens.push("Allergen1");
            recipe = new Recipe(expectedName, expectedIngredients,
                expectedMethod, expectedAllergens, expectedSourceURL);
            let definition = getDefinition(expectedName, expectedIngredients,
                expectedMethod, expectedAllergens, expectedSourceURL);

            expect(Utils.parseRecipe(definition).equals(recipe)).to.be.true;
        });

        it("can parse a recipe with no allergens", function () {

            expectedIngredients.push(ingredient1);
            expectedMethod = "Method";
            recipe = new Recipe(expectedName, expectedIngredients,
                expectedMethod, expectedAllergens, expectedSourceURL);
            let definition = getDefinition(expectedName, expectedIngredients,
                expectedMethod, expectedAllergens, expectedSourceURL);

            expect(Utils.parseRecipe(definition).equals(recipe)).to.be.true;
        });

        it("can parse a recipe with one allergen", function () {

            expectedIngredients.push(ingredient1);
            expectedMethod = "Method";
            expectedAllergens.push("Allergen1");
            recipe = new Recipe(expectedName, expectedIngredients,
                expectedMethod, expectedAllergens, expectedSourceURL);
            let definition = getDefinition(expectedName, expectedIngredients,
                expectedMethod, expectedAllergens, expectedSourceURL);

            expect(Utils.parseRecipe(definition).equals(recipe)).to.be.true;
        });

        it("can parse a recipe with two allergens", function () {

            expectedIngredients.push(ingredient1);
            expectedAllergens.push("Allergen1");
            expectedAllergens.push("Allergen2");
            expectedMethod = "Method";
            recipe = new Recipe(expectedName, expectedIngredients,
                expectedMethod, expectedAllergens, expectedSourceURL);
            let definition = getDefinition(expectedName, expectedIngredients,
                expectedMethod, expectedAllergens, expectedSourceURL);

            expect(Utils.parseRecipe(definition).equals(recipe)).to.be.true;
        });
    });
});

function getDefinition(name: string, ingredients: Array<Ingredient>,
    method: string, allergens: Array<string>, sourceURL: string): string {

    return JSON.stringify(<IRecipeAsJSON>{

        name: name,
        ingredients: ingredients.map(function (ingredient) {

            return ingredient.toJSON();
        }),
        method: method,
        allergens: allergens,
        sourceURL: sourceURL
    });
}