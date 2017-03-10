import { Constants } from "../../src/constants";

let expect = require("chai").expect;

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

    describe("compare() method", function () {

        it("returns 0 when a === b; a and b are positive", function () {

            let a = 5;
            let b = 5;
            let expected = 0;

            expect(CallerUtils.compare(a, b)).to.equal(expected);
        });

        it("returns 0 when a === b; a and b are negative", function () {

            let a = -5;
            let b = -5;
            let expected = 0;

            expect(CallerUtils.compare(a, b)).to.equal(expected);
        });

        it("returns 0 when a === b; a and b are float", function () {

            let a = 5.5;
            let b = 5.5;
            let expected = 0;

            expect(CallerUtils.compare(a, b)).to.equal(expected);
        });

        it("return -1 when a < b; a is negative, b is positive", function () {

            let a = -5.5;
            let b = 5.5;
            let expected = -1;

            expect(CallerUtils.compare(a, b)).to.equal(expected);
        });

        it("return -1 when a < b; a and b are positive", function () {

            let a = 5.5;
            let b = 5.7;
            let expected = -1;

            expect(CallerUtils.compare(a, b)).to.equal(expected);
        });

        it("return -1 when a < b; a and b are negative", function () {

            let a = -5.5;
            let b = -5.3;
            let expected = -1;

            expect(CallerUtils.compare(a, b)).to.equal(expected);
        });

        it("returns +1 when a > b; a is positive, b is negative", function () {

            let a = 5.5;
            let b = -5.5;
            let expected = 1;

            expect(CallerUtils.compare(a, b)).to.equal(expected);
        });

        it("returns +1 when a > b; a and b are negative", function () {

            let a = -5.5;
            let b = -5.7;
            let expected = 1;

            expect(CallerUtils.compare(a, b)).to.equal(expected);
        });

        it("returns +1 when a > b; a and b are positive", function () {

            let a = 5.7;
            let b = 5.5;
            let expected = 1;

            expect(CallerUtils.compare(a, b)).to.equal(expected);
        });
    });
});
