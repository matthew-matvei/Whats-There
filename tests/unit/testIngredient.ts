/// <reference path="../../typings/index.d.ts" />

import Recipe from "../../src/recipe";
import Ingredient from "../../src/ingredient";

let expect = require("chai").expect;

/** Test suite checks functionality defined in '../../src/ingredient' */
describe("Class Ingredient's", function () {

    let ingredient: Ingredient;
    let ingredient2: Ingredient;
    let ingredientSoft: Ingredient;
    let ingredientSoftComma: Ingredient;
    let ingredientSoft2: Ingredient;

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

    describe("softEquals() method", function () {

        it("returns false if other object is not an ingredient", function () {

            let ingredients = new Array<Ingredient>();
            ingredients.push(ingredient);
            let recipe = new Recipe("Recipe1", ingredients, "Method1",
                new Array<string>(), "IMG", "URL", 1, 1);

            expect(ingredient.softEquals(recipe)).to.be.false;
        });

        it("returns true if a word in other ingredient's name exists " +
            "in this ingredient's name", function () {

                ingredientSoft = new Ingredient("Ingredient one", 10, "");
                ingredientSoft2 = new Ingredient("Ingredient soft2", 10, "");

                expect(ingredientSoft.softEquals(ingredientSoft2)).to.be.true;
            });

        it("returns true if only word in other ingredient's name exists " +
            "in this ingredient's single-word name", function () {

                ingredientSoft = new Ingredient("Ingredient", 10, "");
                ingredientSoft2 = new Ingredient("Ingredient", 10, "");

                expect(ingredientSoft.softEquals(ingredientSoft2)).to.be.true;
            });

        it("returns true if other other ingredient's name contains this " +
            "ingredient's single-word name", function () {

                ingredientSoft = new Ingredient("Ingredient", 10, "");
                ingredientSoft2 = new Ingredient("Ingredient Soft2", 10, "");

                expect(ingredientSoft.softEquals(ingredientSoft2)).to.be.true;
            });

        it("returns true if only word in other ingredient's name exists " +
            "in this ingredient's multi-word name", function () {

                ingredientSoft = new Ingredient("Ingredient Soft", 10, "");
                ingredientSoft2 = new Ingredient("Ingredient", 10, "");

                expect(ingredientSoft.softEquals(ingredientSoft2)).to.be.true;
            });

        it("returns true if only difference in names is trailing " +
            "comma", function () {

                ingredientSoft = new Ingredient("Ingredient", 10, "");
                ingredientSoftComma = new Ingredient("Ingredient,", 10, "");
            });
    });
});
