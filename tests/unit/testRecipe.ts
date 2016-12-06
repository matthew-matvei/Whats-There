/// <reference path="../../typings/index.d.ts" />

import Recipe from "../../src/recipe";
import Ingredient from "../../src/ingredient";
import { IRecipeAsJSON } from "../../src/interfaces";

let expect = require("chai").expect;

/** Test suite checks functionality defined in '../../src/recipe' */
describe("Class Recipe's", function () {

    let recipe: Recipe;
    let ingredient: Ingredient;
    let ingredients: Array<Ingredient>;
    let allergen: string;
    let allergens: Array<string>;

    let recipeWithAttribution: Recipe;
    let attributionText: string;
    let attributionHTML: string;

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
                allergens, "IMG", "URL", 1, 1);
        });
    });

    describe("getName() method", function () {

        it("returns the expected name in lower case", function () {

            let expectedName = "recipe1";
            recipe = new Recipe("Recipe1", ingredients, "Method", allergens,
                "IMG", "URL", 1, 1);

            expect(recipe.getName()).to.equal(expectedName);
        });
    });

    describe("getIngredients() method", function () {

        it("returns the ingredients when there is just one " +
            "ingredient", function () {

                recipe = new Recipe("Recipe1", ingredients, "Method",
                    allergens, "IMG", "URL", 1, 1);

                expect(recipe.getIngredients()).to.deep.equal(ingredients);
            });

        it("returns the ingredients when there are two", function () {

            let ingredient2 = new Ingredient("Ingredient2", 20, "ml");
            ingredients.push(ingredient2);
            recipe = new Recipe("Recipe1", ingredients, "Method",
                new Array<string>(), "IMG", "URL", 1, 1);

            expect(recipe.getIngredients()).to.deep.equal(ingredients);
        });

        it("does not expose the original ingredients array", function () {

            recipe = new Recipe("Recipe1", ingredients, "Method",
                new Array<string>(), "IMG", "URL", 1, 1);

            recipe.getIngredients().pop();

            expect(recipe.getIngredients()).to.include(ingredient);
        });
    });

    describe("getMethod() method", function () {

        it("returns the method", function () {

            let expectedMethod = "Method";

            recipe = new Recipe("Recipe1", ingredients, "Method",
                new Array<string>(), "IMG", "URL", 1, 1);

            expect(recipe.getMethod()).to.equal(expectedMethod);
        });

        it("returns undefined if method is undefined", function () {

            let expectedMethod: string;

            recipe = new Recipe("Recipe1", ingredients, expectedMethod,
                allergens, "IMG", "URL", 1, 1);

            expect(recipe.getMethod()).to.be.undefined;
        });
    });

    describe("getAllergens() method", function () {

        it("returns an empty array when there are none", function () {

            recipe = new Recipe("Recipe1", ingredients, "Method", allergens,
                "IMG", "URL", 1, 1);

            expect(recipe.getAllergens()).to.deep.equal(new Array<string>());
        });

        it("returns the allergens when there is just one " +
            "allergen", function () {

                allergens.push("Allergen1");
                recipe = new Recipe("Recipe1", ingredients, "Method",
                    allergens, "IMG", "URL", 1, 1);

                expect(recipe.getAllergens()).to.deep.equal(allergens);
            });

        it("returns the allergens when there are two", function () {

            allergens.push("Allergen1");
            allergens.push("Allergen2");
            recipe = new Recipe("Recipe1", ingredients, "Method",
                allergens, "IMG", "URL", 1, 1);

            expect(recipe.getAllergens()).to.deep.equal(allergens);
        });

        it("does not expose the original allergens array", function () {

            allergens.push("Allergen1");
            recipe = new Recipe("Recipe1", ingredients, "Method",
                allergens, "IMG", "URL", 1, 1);

            recipe.getAllergens().pop();

            expect(recipe.getAllergens()).to.deep.equal(allergens);
        });
    });

    describe("getServings() method", function () {

        it("can return the number of servings as an int", function () {

            let expectedServings = 10;

            recipe = new Recipe("Recipe1", ingredients, "Method", allergens,
                "IMG", "URL", expectedServings, 1);

            expect(recipe.getServings()).to.equal(expectedServings);
        });

        it("can return the number of servings as a float", function () {

            let expectedServings = 4.5;

            recipe = new Recipe("Recipe1", ingredients, "Method", allergens,
                "IMG", "URL", expectedServings, 1);

            expect(recipe.getServings()).to.equal(expectedServings);
        });
    });

    describe("getTimeToMake() method", function () {

        it("can return the time to make as an int", function () {

            let expectedTime = 10;

            recipe = new Recipe("Recipe1", ingredients, "Method", allergens,
                "IMG", "URL", 1, expectedTime);

            expect(recipe.getTimeToMake()).to.equal(expectedTime);
        });

        it("rounds down the time to make if it is a float", function () {

            let expectedTime = 10.5;

            recipe = new Recipe("Recipe1", ingredients, "Method", allergens,
                "IMG", "URL", 1, expectedTime);

            expect(recipe.getTimeToMake()).to.equal(Math.floor(expectedTime));
        });
    });

    describe("getTimeToMakeFormatted() method", function () {

        it("returns correct value of 30 mins", function () {

            let expectedTime = 1800;
            let expected = "30 mins";
            recipe = new Recipe("Recipe1", ingredients, "Method", allergens,
                "IMG", "URL", 1, expectedTime);

            expect(recipe.getTimeToMakeFormatted()).to.equal(expected);
        });

        it("returns correct value of 1 hr", function () {

            let expectedTime = 3600;
            let expected = "1 hr";
            recipe = new Recipe("Recipe1", ingredients, "Method", allergens,
                "IMG", "URL", 1, expectedTime);

            expect(recipe.getTimeToMakeFormatted()).to.equal(expected);
        });

        it("returns correct value of 1 hr 30 mins", function () {

            let expectedTime = 5400;
            let expected = "1 hr 30 mins";
            recipe = new Recipe("Recipe1", ingredients, "Method", allergens,
                "IMG", "URL", 1, expectedTime);

            expect(recipe.getTimeToMakeFormatted()).to.equal(expected);
        });
    });

    describe("getAttributionText() method", function () {

        it("returns text if a recipe has been create with attribution " +
            "text", function () {

                attributionText = "attribution text";
                attributionHTML = "<p>attribution HTML</p>;"

                recipeWithAttribution = new Recipe("Recipe with attributions",
                    ingredients, "Method", allergens, "IMG", "URL", 1, 1,
                    attributionText, attributionHTML);

                expect(recipeWithAttribution.getAttributionText())
                    .to.equal(attributionText);
            });

        it("returns an empty string if a recipe has been created with " +
            "no attribution text", function () {

                recipeWithAttribution = new Recipe(
                    "Recipe with no attributions", ingredients, "Method",
                    allergens, "IMG", "URL", 1, 1);

                expect(recipeWithAttribution.getAttributionText()).to.equal("");
            });
    });

    describe("getAttributionHTML() method", function () {

        it("returns HTML if a recipe has been create with attribution " +
            "HTML", function () {

                attributionText = "attribution text";
                attributionHTML = "<p>attribution HTML</p>;"

                recipeWithAttribution = new Recipe("Recipe with attribution",
                    ingredients, "Method", allergens, "IMG", "URL", 1, 1,
                    attributionText, attributionHTML);

                expect(recipeWithAttribution.getAttributionHTML())
                    .to.equal(attributionHTML);
            });

        it("returns an empty string if a recipe has been created with " +
            "no attribution HTML", function () {

                recipeWithAttribution = new Recipe("Recipe with no attribution",
                    ingredients, "Method", allergens, "IMG", "URL", 1, 1);

                expect(recipeWithAttribution.getAttributionHTML())
                    .to.equal("");
            });
    });

    describe("toJSON() method", function () {

        let nameJSON: string;
        let ingredientsJSON: Array<Ingredient>;
        let methodJSON: string;
        let allergensJSON: Array<string>;
        let imageURLJSON: string;
        let sourceURLJSON: string;
        let servingsJSON: number;
        let timeToMakeJSON: number;
        let attributionTextJSON: string;
        let attributionHTMLJSON: string;

        let recipeJSON: Recipe;
        let expectedJSON: string;

        before(function () {

            nameJSON = "recipe1";
            imageURLJSON = "IMG";
            sourceURLJSON = "URL";
        });

        it("returns the expected JSON-formatted text of a recipe", function () {

            ingredientsJSON = [new Ingredient("ingredient1", 10, "mg")];
            methodJSON = "method1";
            allergensJSON = ["allergen1"];
            servingsJSON = 10;
            timeToMakeJSON = 100;
            attributionTextJSON = "attribution text";
            attributionHTMLJSON = "<p>attribution HTML</p>";

            recipeJSON = new Recipe(nameJSON, ingredientsJSON, methodJSON,
                allergensJSON, imageURLJSON, sourceURLJSON, servingsJSON,
                timeToMakeJSON, attributionTextJSON, attributionHTMLJSON);
            expectedJSON = JSON.stringify((<IRecipeAsJSON>{
                name: nameJSON,
                ingredients: ingredientsJSON.map(function (ingredient) {
                    return ingredient.toJSON();
                }),
                method: methodJSON,
                allergens: allergensJSON,
                imageURL: imageURLJSON,
                sourceURL: sourceURLJSON,
                servings: servingsJSON,
                timeToMake: timeToMakeJSON,
                attributionText: attributionTextJSON,
                attributionHTML: attributionHTMLJSON
            }));

            expect(recipeJSON.toJSON()).to.equal(expectedJSON);
        });

        it("handles case where ingredient has volume = 0", function () {

            ingredientsJSON = [new Ingredient("ingredient1", 0, "mg")];
            methodJSON = "method1";
            allergensJSON = ["allergen1"];
            servingsJSON = 10;
            timeToMakeJSON = 100;
            attributionTextJSON = "attribution text";
            attributionHTMLJSON = "<p>attribution HTML</p>";

            recipeJSON = new Recipe(nameJSON, ingredientsJSON, methodJSON,
                allergensJSON, imageURLJSON, sourceURLJSON, servingsJSON,
                timeToMakeJSON, attributionTextJSON, attributionHTMLJSON);
            expectedJSON = JSON.stringify((<IRecipeAsJSON>{
                name: nameJSON,
                ingredients: ingredientsJSON.map(function (ingredient) {
                    return ingredient.toJSON();
                }),
                method: methodJSON,
                allergens: allergensJSON,
                imageURL: imageURLJSON,
                sourceURL: sourceURLJSON,
                servings: servingsJSON,
                timeToMake: timeToMakeJSON,
                attributionText: attributionTextJSON,
                attributionHTML: attributionHTMLJSON
            }));

            expect(recipeJSON.toJSON()).to.equal(expectedJSON);
        });

        it("handles case where ingredient has no volumeType", function () {

            ingredientsJSON = [new Ingredient("ingredient1", 10, "")];
            methodJSON = "method1";
            allergensJSON = ["allergen1"];
            servingsJSON = 10;
            timeToMakeJSON = 100;
            attributionTextJSON = "attribution text";
            attributionHTMLJSON = "<p>attribution HTML</p>";

            recipeJSON = new Recipe(nameJSON, ingredientsJSON, methodJSON,
                allergensJSON, imageURLJSON, sourceURLJSON, servingsJSON,
                timeToMakeJSON, attributionTextJSON, attributionHTMLJSON);
            expectedJSON = JSON.stringify((<IRecipeAsJSON>{
                name: nameJSON,
                ingredients: ingredientsJSON.map(function (ingredient) {
                    return ingredient.toJSON();
                }),
                method: methodJSON,
                allergens: allergensJSON,
                imageURL: imageURLJSON,
                sourceURL: sourceURLJSON,
                servings: servingsJSON,
                timeToMake: timeToMakeJSON,
                attributionText: attributionTextJSON,
                attributionHTML: attributionHTMLJSON
            }));

            expect(recipeJSON.toJSON()).to.equal(expectedJSON);
        });

        it("handles case where recipe's method is undefined", function () {

            ingredientsJSON = [new Ingredient("ingredient1", 10, "mg")];
            methodJSON = undefined;
            allergensJSON = ["allergen1"];
            servingsJSON = 10;
            timeToMakeJSON = 100;
            attributionTextJSON = "attribution text";
            attributionHTMLJSON = "<p>attribution HTML</p>";

            recipeJSON = new Recipe(nameJSON, ingredientsJSON, methodJSON,
                allergensJSON, imageURLJSON, sourceURLJSON, servingsJSON,
                timeToMakeJSON, attributionTextJSON, attributionHTMLJSON);
            expectedJSON = JSON.stringify((<IRecipeAsJSON>{
                name: nameJSON,
                ingredients: ingredientsJSON.map(function (ingredient) {
                    return ingredient.toJSON();
                }),
                method: methodJSON,
                allergens: allergensJSON,
                imageURL: imageURLJSON,
                sourceURL: sourceURLJSON,
                servings: servingsJSON,
                timeToMake: timeToMakeJSON,
                attributionText: attributionTextJSON,
                attributionHTML: attributionHTMLJSON
            }));

            expect(recipeJSON.toJSON()).to.equal(expectedJSON);
        });

        it("handles case where allergens is an empty list", function () {

            ingredientsJSON = [new Ingredient("ingredient1", 10, "mg")];
            methodJSON = "method1";
            allergensJSON = new Array<string>();
            servingsJSON = 10;
            timeToMakeJSON = 100;
            attributionTextJSON = "attribution text";
            attributionHTMLJSON = "<p>attribution HTML</p>";

            recipeJSON = new Recipe(nameJSON, ingredientsJSON, methodJSON,
                allergensJSON, imageURLJSON, sourceURLJSON, servingsJSON,
                timeToMakeJSON, attributionTextJSON, attributionHTMLJSON);
            expectedJSON = JSON.stringify((<IRecipeAsJSON>{
                name: nameJSON,
                ingredients: ingredientsJSON.map(function (ingredient) {
                    return ingredient.toJSON();
                }),
                method: methodJSON,
                allergens: allergensJSON,
                imageURL: imageURLJSON,
                sourceURL: sourceURLJSON,
                servings: servingsJSON,
                timeToMake: timeToMakeJSON,
                attributionText: attributionTextJSON,
                attributionHTML: attributionHTMLJSON
            }));

            expect(recipeJSON.toJSON()).to.equal(expectedJSON);
        });

        it("handles case where no attribution text / HTML is supplied",
            function () {

                ingredientsJSON = [new Ingredient("ingredient1", 0, "mg")];
                methodJSON = "method1";
                allergensJSON = ["allergen1"];
                servingsJSON = 10;
                timeToMakeJSON = 100;

                recipeJSON = new Recipe(nameJSON, ingredientsJSON, methodJSON,
                    allergensJSON, imageURLJSON, sourceURLJSON, servingsJSON,
                    timeToMakeJSON);
                expectedJSON = JSON.stringify((<IRecipeAsJSON>{
                    name: nameJSON,
                    ingredients: ingredientsJSON.map(function (ingredient) {
                        return ingredient.toJSON();
                    }),
                    method: methodJSON,
                    allergens: allergensJSON,
                    imageURL: imageURLJSON,
                    sourceURL: sourceURLJSON,
                    servings: servingsJSON,
                    timeToMake: timeToMakeJSON
                }));

                expect(recipeJSON.toJSON()).to.equal(expectedJSON);
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
                    "Method2", new Array<string>(), "IMG", "URL", 1, 1);

                recipe = new Recipe("Recipe1", ingredients, "Method",
                    allergens, "IMG", "URL", 1, 1);

                expect(recipe.equals(otherRecipe)).to.be.false;
            });

        it("returns false if any of the ingredients are " +
            "different in the two recipes", function () {

                let ingredient1 = new Ingredient("Ingredient2", 20, "ml");
                let otherIngredients = new Array<Ingredient>();
                otherIngredients.push(ingredient1);
                let otherRecipe = new Recipe("Recipe2", otherIngredients,
                    "Method1", new Array<string>(), "IMG", "URL", 1, 1);

                recipe = new Recipe("Recipe1", ingredients, "Method",
                    allergens, "IMG", "URL", 1, 1);

                expect(recipe.equals(otherRecipe)).to.be.false;
            });

        it("returns true if the other recipe has the same " +
            "ingredients", function () {

                let ingredient1 = new Ingredient("Ingredient1", 10, "ml");
                let otherIngredients = new Array<Ingredient>();
                otherIngredients.push(ingredient1);
                let otherRecipe = new Recipe("Recipe1", otherIngredients,
                    "Method1", new Array<string>(), "IMG", "URL", 1, 1);

                recipe = new Recipe("Recipe1", ingredients, "Method",
                    allergens, "IMG", "URL", 1, 1);

                expect(recipe.equals(otherRecipe)).to.be.true;
            });

        it("returns true if the other recipe has the same " +
            "ingredients but a different name", function () {

                let ingredient1 = new Ingredient("Ingredient1", 10, "ml");
                let otherIngredients = new Array<Ingredient>();
                otherIngredients.push(ingredient1);
                let otherRecipe = new Recipe("Recipe2", otherIngredients,
                    "Method1", new Array<string>(), "IMG", "URL", 1, 1);

                recipe = new Recipe("Recipe1", ingredients, "Method",
                    allergens, "IMG", "URL", 1, 1);

                expect(recipe.equals(otherRecipe)).to.be.true;
            });
    });
});