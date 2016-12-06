/// <reference path="../../typings/index.d.ts" />

import { UnregisteredUser } from "../../src/user";
import Recipe from "../../src/recipe";
import Ingredient from "../../src/ingredient";
import Constants from "../../src/constants";

let expect = require("chai").expect;
let assert = require("chai").assert;

/** Test suite checks functionality defined in '../../src/ingredient' */
describe("Class Ingredient's", function () {

    let ingredient: Ingredient;
    let ingredient2: Ingredient;

    before(function () {

        ingredient = new Ingredient("Ingredient1", 10, "ml");
    });

    afterEach(function () {

        expect(ingredient.checkInvariant()).to.be.true;
    });

    describe("Constructor method", function () {

        it("properly constructs an Ingredient", function () {

            // afterEach hook handles testing
        });

        it("properly rounds down an ingredient's volume", function () {

            ingredient2 = new Ingredient("Ingredient2", 3.333, "ml");
            expect(ingredient2.checkInvariant()).to.be.true;

            ingredient2 = new Ingredient("Ingredient2", 1.959, "mg");
            expect(ingredient2.checkInvariant()).to.be.true;
        });
    });

    describe("getName() method", function () {

        it("returns the name in lower case", function () {

            let expectedName = "ingredient1";

            expect(ingredient.getName()).to.equal(expectedName);
        });
    });

    describe("getVolume() method", function () {

        it("returns the expected volume", function () {

            let expectedVolume = 10;

            expect(ingredient.getVolume()).to.equal(expectedVolume);
        });

        it("returns a float volume", function () {

            let testIngredient = new Ingredient("Ingredient2", 2.5, "ml");
            let expectedVolume = 2.5;

            expect(testIngredient.getVolume()).to.equal(expectedVolume);
        });
    });

    describe("getVolumeType() method", function () {

        it("returns the expected volume type", function () {

            let expectedVolumeType = "ml";

            expect(ingredient.getVolumeType()).to.equal(expectedVolumeType);
        });
    });

    describe("toString() method", function () {

        it("returns the expected string", function () {

            let expectedString = "10 ml ingredient1";
            expect(ingredient.toString()).to.equal(expectedString);
        });
    });

    describe("equals() method", function () {

        it("returns false if other object is not an ingredient", function () {

            let ingredients = new Array<Ingredient>();
            ingredients.push(ingredient);
            let recipe = new Recipe("Recipe1", ingredients, "Method1",
                new Array<string>(), "IMG", "URL", 1, 1);

            expect(ingredient.equals(recipe)).to.be.false;
        });

        it("returns false if other ingredient has different name", function () {

            let otherIngredient = new Ingredient("Ingredient2", 10, "ml");

            expect(ingredient.equals(otherIngredient)).to.be.false;
        });

        it("returns false if other ingredient has a different volume",
            function () {

                let otherIngredient = new Ingredient("Ingredient1", 20, "ml");

                expect(ingredient.equals(otherIngredient)).to.be.false;
            });

        it("returns false if other ingredient has a different volume type",
            function () {

                let otherIngredient = new Ingredient("Ingredient1", 10, "mg");

                expect(ingredient.equals(otherIngredient)).to.be.false;
            });

        it("returns true iff other ingredient has the same name, " +
            "volume and volume type", function () {

                let otherIngredient = new Ingredient("Ingredient1", 10, "ml");

                expect(ingredient.equals(otherIngredient)).to.be.true;
            });
    });
});
