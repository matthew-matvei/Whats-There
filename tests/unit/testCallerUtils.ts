import Constants from "../../src/constants";

let expect = require("chai").expect;
let assert = require("chai").assert;

import CallerUtils from "../../src/api/callerUtils";

let ingredientDescription: string;
let expectedVolume: number;
let expectedDescription: string;

describe("Class CallerUtils'", function () {

    describe("getIngredientVolume() method", function () {

        it("returns a number at the beginning of a description", function () {

            expectedVolume = 1;
            ingredientDescription = "1 cup of ingredient";

            expect(CallerUtils.getIngredientVolume(ingredientDescription))
                .to.equal(expectedVolume);
        });

        it("returns a float at the beginning of a description", function () {

            expectedVolume = 1.5;
            ingredientDescription = "1.5 cups of ingredient";

            expect(CallerUtils.getIngredientVolume(ingredientDescription))
                .to.equal(expectedVolume);
        });

        it("returns a decimal representation of a fraction", function () {

            expectedVolume = 0.5;
            ingredientDescription = Constants.SYMBOL_ONE_HALF +
                " cups of ingredient";

            expect(CallerUtils.getIngredientVolume(ingredientDescription))
                .to.equal(expectedVolume);
        });

        it("returns a decimal representation of a regularly written " +
            "fraction", function () {

                expectedVolume = 0.5;
                ingredientDescription = "1/2 cups of ingredient";

                expect(CallerUtils.getIngredientVolume(ingredientDescription))
                    .to.equal(expectedVolume);
            });

        it("returns Constants.VALUE_NOT_FOUND if no number found", function () {

            expectedVolume = Constants.VALUE_NOT_FOUND;
            ingredientDescription = "cup of ingredient";

            expect(CallerUtils.getIngredientVolume(ingredientDescription))
                .to.equal(expectedVolume);
        });
    });

    describe("getIngredientName() method", function () {

        it("returns description without regular number volume", function () {

            expectedDescription = "cup of ingredient";
            ingredientDescription = "1 cup of ingredient";

            expect(CallerUtils.getIngredientName(ingredientDescription))
                .to.equal(expectedDescription);
        });

        it("returns description without the fraction symbol", function () {

            expectedDescription = "cups of ingredient";
            ingredientDescription = Constants.SYMBOL_ONE_HALF +
                " cups of ingredient";

            expect(CallerUtils.getIngredientName(ingredientDescription))
                .to.equal(expectedDescription);
        });
    });
});
