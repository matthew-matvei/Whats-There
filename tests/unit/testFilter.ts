import {
    MashapeFilter, FoodToForkFilter, YummlyFilter
} from "../../src/api/filter";
import Recipe from "../../src/recipe";
import Ingredient from "../../src/ingredient";
import { ICallOptions } from "../../src/api/callOptions";

import {
    IYummlySearch, IMashapeSearchItem, IYummlySearchItem
} from "../../src/api/callerInterfaces";

let expect = require("chai").expect;

describe("Class FoodToForkFilter's", function () {

    let ingredients: string;
    let userOptions: ICallOptions;

    let ingredient1: Ingredient;
    let ingredient1Comma: Ingredient;
    let ingredient2: Ingredient;
    let ingredient3: Ingredient;
    let ingredient4: Ingredient;
    let ingredient5: Ingredient;
    let ingredient6: Ingredient;
    let ingredient7: Ingredient;

    let recipeA: Recipe;
    let recipeAComma: Recipe;
    let recipeB: Recipe;
    let recipeC: Recipe;

    let ftfFilter: FoodToForkFilter;

    before(function () {

        ingredients = "ingredient1,ingredient2,ingredient3";
        userOptions = {
            ingredients: ingredients,
            allergies: new Array<string>(),
            ratio: 1
        };

        ftfFilter = new FoodToForkFilter();

        ingredient1 = new Ingredient("Ingredient1", 10, "");
        ingredient1Comma = new Ingredient("Ingredient1,", 10, "");
        ingredient2 = new Ingredient("Ingredient2", 10, "");
        ingredient3 = new Ingredient("Ingredient3", 10, "");
        ingredient4 = new Ingredient("Ingredient4", 10, "");
        ingredient5 = new Ingredient("Ingredient5", 10, "");
        ingredient6 = new Ingredient("Ingredient6", 10, "");
        ingredient7 = new Ingredient("Ingredient7", 10, "");

        recipeA = new Recipe("RecipeA", [ingredient1, ingredient2,
            ingredient3], "Method", new Array<string>(), "Image", "URL", 10,
            10);

        recipeAComma = new Recipe("RecipeAComma", [ingredient1Comma,
            ingredient2, ingredient3], "Method", new Array<string>(), "Image",
            "URL", 10, 10);

        recipeB = new Recipe("RecipeB", [ingredient1, ingredient2,
            ingredient4], "Method", new Array<string>(), "Image", "URL", 10,
            10);

        recipeC = new Recipe("RecipeC", [ingredient1, ingredient4,
            ingredient5], "Method", new Array<string>(), "Image", "URL", 10,
            10);
    });

    describe("filterByIngredients() method", function () {

        it("returns an empty array of recipes when given " +
            "empty array", function () {

                let response = new Array<Recipe>();
                let expected = new Array<Recipe>();

                expect(ftfFilter.filterByIngredients(response, userOptions))
                    .to.deep.equal(expected);
            });

        it("returns an identical array when given array " +
            "is of length one", function () {

                let response = [recipeA];
                let expected = [recipeA];

                expect(ftfFilter.filterByIngredients(response, userOptions))
                    .to.deep.equal(expected);
            });

        it("sorts an array of two recipes", function () {

            let response = [recipeB, recipeA];
            let expected = [recipeA, recipeB];

            expect(ftfFilter.filterByIngredients(response, userOptions))
                .to.deep.equal(expected);
        });

        it("sorts an array of three recipes", function () {

            let response = [recipeC, recipeA, recipeB];
            let expected = [recipeA, recipeB, recipeC];

            expect(ftfFilter.filterByIngredients(response, userOptions))
                .to.deep.equal(expected);
        });

        it("can handle ingredients with commas", function () {

            let response = [recipeC, recipeAComma, recipeB];
            let expected = [recipeAComma, recipeB, recipeC];

            expect(ftfFilter.filterByIngredients(response, userOptions))
                .to.deep.equal(expected);
        });
    });

    describe("compare() method", function () {

        it("returns 0 when recipes are equal", function () {

            expect(ftfFilter.compare(recipeA, recipeA, userOptions))
                .to.equal(0);
        });

        it("returns 0 when two different recipes have the " +
            "same ingredients", function () {

                let anotherA = new Recipe("AnotherA", [ingredient1,
                    ingredient2, ingredient3], "Method", new Array<string>(),
                    "Image", "URL", 10, 10);

                expect(ftfFilter.compare(recipeA, anotherA, userOptions))
                    .to.equal(0);
            });

        it("returns -1 when first recipe is 'less' than the " +
            "second one", function () {

                expect(ftfFilter.compare(recipeA, recipeB, userOptions))
                    .to.equal(-1);
            });

        it("returns +1 when first recipe is 'more' than the " +
            "second one", function () {

                expect(ftfFilter.compare(recipeB, recipeA, userOptions))
                    .to.equal(1);
            });

        it("can handle ingredients with commas", function () {

            expect(ftfFilter.compare(recipeA, recipeAComma, userOptions))
                .to.equal(0);
        });
    });

    describe("isRelevant() method", function () {

        it("returns true if all user options ingredients match " +
            "given item", function () {

                expect(ftfFilter.isRelevant(recipeA, userOptions))
                    .to.be.true;
            });

        it("returns true if Constants.RELEVANCE_THRESHOLD ingredients " +
            "do not match given item", function () {

                let item = new Recipe("Recipe", [ingredient1, ingredient2,
                    ingredient4, ingredient5, ingredient6], "Method",
                    new Array<string>(), "Image", "URL", 10, 10);

                expect(ftfFilter.isRelevant(item, userOptions))
                    .to.be.true;
            });

        it("returns false if (Constants.RELEVANCE_THRESHOLD + 1) or more " +
            "ingredients do not match given item", function () {

                let item = new Recipe("Recipe", [ingredient1, ingredient2,
                    ingredient4, ingredient5, ingredient6, ingredient7],
                    "Method", new Array<string>(), "Image", "URL", 10, 10);

                expect(ftfFilter.isRelevant(item, userOptions))
                    .to.be.false;
            });
    });
});

describe("Class MashapeFilter's", function () {

    let mashapeFilter: MashapeFilter;

    let id1: string;
    let id2: string;
    let id3: string;

    let used1: number;
    let used2: number;
    let used3: number;

    let missed1: number;
    let missed2: number;
    let missed3: number;

    let item1: IMashapeSearchItem;
    let item2: IMashapeSearchItem;
    let item3: IMashapeSearchItem;

    before(function () {

        mashapeFilter = new MashapeFilter();

        id1 = "id1";
        id2 = "id2";
        id3 = "id3";

        used1 = 3;
        used2 = 2;
        used3 = 1;

        missed1 = 0;
        missed2 = 1;
        missed3 = 2;

        item1 = {
            id: id1,
            usedIngredientCount: used1,
            missedIngredientCount: missed1
        };
        item2 = {
            id: id2,
            usedIngredientCount: used2,
            missedIngredientCount: missed2
        };
        item3 = {
            id: id3,
            usedIngredientCount: used3,
            missedIngredientCount: missed3
        };
    });

    describe("filterByIngredients() method", function () {

        it("returns an empty array of recipes when given " +
            "empty array", function () {

                let response = JSON.stringify([{}]);
                let expected = JSON.stringify([{}]);

                expect(mashapeFilter.filterByIngredients(response))
                    .to.deep.equal(expected);
            });

        it("returns an identical array when given array " +
            "is of length one", function () {

                let response = JSON.stringify([item1]);
                let expected = JSON.stringify([item1]);

                expect(mashapeFilter.filterByIngredients(response))
                    .to.deep.equal(expected);
            });

        it("sorts an array of two recipes", function () {

            let response = JSON.stringify([item2, item1]);
            let expected = JSON.stringify([item1, item2]);

            expect(mashapeFilter.filterByIngredients(response))
                .to.deep.equal(expected);
        });

        it("sorts an array of three recipes", function () {

            let response = JSON.stringify([item2, item3, item1]);
            let expected = JSON.stringify([item1, item2, item3]);

            expect(mashapeFilter.filterByIngredients(response))
                .to.deep.equal(expected);
        });

        it("doesn't filter results under and up to " +
            "Constants.MINIMUM_UNFILTERED", function () {

                let response = JSON.stringify([item1, item1, item2, item2,
                    item3]);
                let expected = JSON.stringify([item1, item1, item2, item2,
                    item3]);

                expect(mashapeFilter.filterByIngredients(response))
                    .to.deep.equal(expected);
            });

        it("filters irrelevent results above " +
            "Constants.MINIMUM_UNFILTERED", function () {

                let response = JSON.stringify([item1, item1, item2, item2,
                    item3, item3]);
                let expected = JSON.stringify([item1, item1, item2, item2,
                    item3]);

                expect(mashapeFilter.filterByIngredients(response))
                    .to.deep.equal(expected);
            });
    });

    describe("compare() method", function () {

        it("returns 0 when two different items have the " +
            "same missed ingredients count", function () {

                expect(mashapeFilter.compare(item1, item1)).to.equal(0);
            });

        it("returns -1 when first item is 'less' than the " +
            "second one", function () {

                expect(mashapeFilter.compare(item1, item2)).to.equal(-1);
            });

        it("returns +1 when first item is 'more' than the " +
            "second one", function () {

                expect(mashapeFilter.compare(item2, item1)).to.equal(1);
            });
    });

    describe("isRelevant() method", function () {

        it("returns false if missed ingredients count > 0", function () {

            expect(mashapeFilter.isRelevant(item2)).to.be.false;
        });

        it("returns true if missed ingredients count === 0", function () {

            expect(mashapeFilter.isRelevant(item1)).to.be.true;
        });
    });
});

describe("Class YummlyFilter's", function () {

    let id1: string;
    let id2: string;
    let id3: string;
    let id4: string;

    let ingredients: string;
    let ingredient1: string;
    let ingredient2: string;
    let ingredient3: string;
    let ingredient4: string;
    let ingredient5: string;
    let ingredient6: string;
    let ingredient7: string;

    let item1: IYummlySearchItem;
    let item2: IYummlySearchItem;
    let item3: IYummlySearchItem;
    let item4: IYummlySearchItem;

    let options: ICallOptions;

    let yummlyFilter: YummlyFilter;

    before(function () {

        id1 = "id1";
        id2 = "id2";
        id3 = "id3";
        id4 = "id4";

        ingredients = "ingredient1,ingredient2,ingredient3";

        ingredient1 = "ingredient1";
        ingredient2 = "ingredient2";
        ingredient3 = "ingredient3";
        ingredient4 = "ingredient4";
        ingredient5 = "ingredient5";
        ingredient6 = "ingredient6";
        ingredient7 = "ingredient7";

        item1 = {
            id: id1,
            ingredients: [ingredient1, ingredient2, ingredient3]
        };
        item2 = {
            id: id2,
            ingredients: [ingredient1, ingredient2, ingredient4]
        };
        item3 = {
            id: id3,
            ingredients: [ingredient1, ingredient4, ingredient5, ingredient6]
        };
        item4 = {
            id: id4,
            ingredients: [ingredient4, ingredient5, ingredient6, ingredient7]
        };

        options = {
            ingredients: ingredients,
            allergies: new Array<string>(),
            ratio: 1
        };

        yummlyFilter = new YummlyFilter();
    });

    describe("filterByIngredients() method", function () {

        it("returns an empty array of recipes when given " +
            "empty matches array", function () {

                let response = JSON.stringify(<IYummlySearch>{
                    matches: new Array<IYummlySearchItem>()
                });
                let expected = JSON.stringify(new Array<IYummlySearchItem>());

                expect(yummlyFilter.filterByIngredients(response, options))
                    .to.deep.equal(expected);
            });

        it("returns an identical array when given array " +
            "is of length one", function () {

                let response = JSON.stringify(<IYummlySearch>{
                    matches: [item1]
                });
                let expected = JSON.stringify([item1]);

                expect(yummlyFilter.filterByIngredients(response, options))
                    .to.deep.equal(expected);
            });

        it("sorts an array of two recipes", function () {

            let response = JSON.stringify(<IYummlySearch>{
                matches: [item2, item1]
            });
            let expected = JSON.stringify([item1, item2]);

            expect(yummlyFilter.filterByIngredients(response, options))
                .to.deep.equal(expected);
        });

        it("sorts an array of three recipes", function () {

            let response = JSON.stringify(<IYummlySearch>{
                matches: [item3, item1, item2]
            });
            let expected = JSON.stringify([item1, item2, item3]);

            expect(yummlyFilter.filterByIngredients(response, options))
                .to.deep.equal(expected);
        });
    });

    describe("compare() method", function () {

        it("returns 0 when items are equal", function () {

            expect(yummlyFilter.compare(item1, item1, options)).to.equal(0);
        });

        it("returns 0 when two different recipes have the " +
            "same ingredients", function () {

                let anotherItem1 = <IYummlySearchItem>{
                    id: id3,
                    ingredients: [ingredient1, ingredient2, ingredient3]
                };

                expect(yummlyFilter.compare(item1, anotherItem1, options))
                    .to.equal(0);
            });

        it("returns -1 when first recipe is 'less' than the " +
            "second one", function () {

                expect(yummlyFilter.compare(item1, item2, options))
                    .to.equal(-1);
            });

        it("returns +1 when first recipe is 'more' than the " +
            "second one", function () {

                expect(yummlyFilter.compare(item2, item1, options))
                    .to.equal(1);
            });
    });

    describe("isRelevant() method", function () {

        it("returns true if all user options ingredients match " +
            "given item", function () {

                expect(yummlyFilter.isRelevant(item1, options))
                    .to.be.true;
            });

        it("returns true if Constants.RELEVANCE_THRESHOLD ingredients " +
            "do not match given item", function () {

                expect(yummlyFilter.isRelevant(item3, options))
                    .to.be.true;
            });

        it("returns false if (Constants.RELEVANCE_THRESHOLD + 1) or more " +
            "ingredients do not match given item", function () {

                expect(yummlyFilter.isRelevant(item4, options))
                    .to.be.false;
            });
    });
});
