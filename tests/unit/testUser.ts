/// <reference path="../../typings/index.d.ts" />

import { UnregisteredUser } from "../../src/user";
import Recipe from "../../src/recipe";
import Ingredient from "../../src/ingredient";
import Constants from "../../src/constants";

let expect = require("chai").expect;

/** Test suite checks functionality defined in '../../src/user' */
describe("Class UnregisteredUser's", function () {

    let user: UnregisteredUser;
    let expectedRecipes: Array<Recipe>;
    let expectedAllergies: Array<string>;
    let expectedIngredients: Array<Ingredient>;

    let testIngredient1: Ingredient;
    let testIngredient2: Ingredient;
    let testIngredient3: Ingredient;
    let testIngredient4: Ingredient;

    let recipe: Recipe;
    let recipe2: Recipe;

    let testAllergy1: string;
    let testAllergy2: string;

    before(function () {

        testIngredient1 = new Ingredient("Ingredient1", 10, "ml");
        testIngredient2 = new Ingredient("Ingredient2", 20, "mg");
        recipe = new Recipe("Recipe1", [testIngredient1],
            "Method", new Array<string>(), "IMG", "URL", 1, 1);

        testIngredient3 = new Ingredient("Ingredient3", 30, "ml");
        testIngredient4 = new Ingredient("Ingredient4", 40, "mg");
        recipe2 = new Recipe("Recipe2", [testIngredient3], "Method2",
            new Array<string>(), "IMG", "URL", 1, 1);

        testAllergy1 = "Allergy1";
        testAllergy2 = "Allergy2";
    });

    beforeEach(function () {

        user = new UnregisteredUser();
        expectedRecipes = new Array<Recipe>();
        expectedAllergies = new Array<string>();
        expectedIngredients = new Array<Ingredient>();
    });

    afterEach(function () {

        expect(user.checkInvariant()).to.be.true;
    });

    describe("Constructor method", function () {

        it("properly instantiates UnregisteredUser class", function () {

            // handled by afterEach hook
        });
    });

    describe("addIngredient() method", function () {

        it("adds a new ingredient when there are currently none", function () {

            user.addIngredient(testIngredient1);
            let expectedIngredients = new Array<Ingredient>();
            expectedIngredients.push(testIngredient1);

            expect(user.getIngredients()).to.deep.equal(expectedIngredients);
        });

        it("adds a new ingredient", function () {

            user.addIngredient(testIngredient1);
            user.addIngredient(testIngredient2);
            let expectedIngredients = new Array<Ingredient>();
            expectedIngredients.push(testIngredient1);
            expectedIngredients.push(testIngredient2);

            expect(user.getIngredients()).to.deep.equal(expectedIngredients);
        });

        it("does not add an ingredient when it already exists", function () {

            user.addIngredient(testIngredient1);
            user.addIngredient(testIngredient1);
            let expectedIngredients = new Array<Ingredient>();
            expectedIngredients.push(testIngredient1);
            let unexpectedIngredients = new Array<Ingredient>();
            unexpectedIngredients.push(testIngredient1);
            unexpectedIngredients.push(testIngredient1);

            expect(user.getIngredients()).to.deep.equal(expectedIngredients);
            expect(user.getIngredients())
                .to.not.deep.equal(unexpectedIngredients);
        });

        it("adds the ingredient to the end of the list", function () {

            user.addIngredient(testIngredient1);
            user.addIngredient(testIngredient2);

            expect(user.getIngredients()[user.getIngredients()
                .length - 1].equals(testIngredient2)).to.be.true;
        });
    });

    describe("removeIngredient() method", function () {

        it("can remove an ingredient", function () {

            user.addIngredient(testIngredient1);
            user.addIngredient(testIngredient2);

            expect(user.getIngredients()).to.include(testIngredient2);
            user.removeIngredient(testIngredient2);

            expect(user.getIngredients()).to.not.include(testIngredient2);
        });

        it("can remove an ingredient that isn't last", function () {

            user.addIngredient(testIngredient1);
            user.addIngredient(testIngredient2);
            user.removeIngredient(testIngredient1);

            expect(user.getIngredients()).to.not.include(testIngredient1);
        });

        it("removes the only ingredient", function () {

            user.addIngredient(testIngredient1);

            expect(user.getIngredients()).to.include(testIngredient1);
            user.removeIngredient(testIngredient1);
            expect(user.getIngredients()).to.not.include(testIngredient1);
        });

        it("returns false when given ingredient doesn't exist", function () {

            user.addIngredient(testIngredient1);

            expect(user.removeIngredient(testIngredient2)).to.be.false;
        });

        it("returns false when the list of ingredients is empty", function () {

            expect(user.removeIngredient(testIngredient1)).to.be.false;
        });
    });

    describe("addFavRecipe() method", function () {

        it("can add a favourite recipe", function () {

            expectedRecipes.push(recipe);
            user.addFavRecipe(recipe);

            expect(user.getFavRecipes()).to.include(recipe);
        });

        it("doesn't add a favourite recipe if it already exists", function () {

            expectedRecipes.push(recipe);
            user.addFavRecipe(recipe);
            user.addFavRecipe(recipe);

            expect(user.getFavRecipes()).to.deep.equal(expectedRecipes);
        });

        it("adds favourite recipe when current number of recipes is " +
            "(Constants.MAX_FAV_RECIPE - 1)", function () {

                let recipesToAdd = buildRecipeList(
                    Constants.MAX_FAV_RECIPES - 1);
                let finalRecipe = new Recipe("Recipe10",
                    [new Ingredient("Ingredient10", 100, "ml")], "Method1",
                    new Array<string>(), "IMG", "URL", 1, 1);

                expectedRecipes = expectedRecipes.concat(recipesToAdd);
                expectedRecipes.push(finalRecipe);
                for (let recipe of recipesToAdd) {

                    user.addFavRecipe(recipe);
                }

                user.addFavRecipe(finalRecipe);

                expect(user.getFavRecipes()).to.deep.equal(expectedRecipes);
            });
    });

    describe("removeFavRecipe() method", function () {

        it("can remove a favourite recipe", function () {

            user.addFavRecipe(recipe);
            user.addFavRecipe(recipe2);
            user.removeFavRecipe(recipe2);

            expect(user.getFavRecipes()).to.not.include(recipe2);
        });

        it("removes a recipe that isn't last in the list", function () {

            user.addFavRecipe(recipe);
            user.addFavRecipe(recipe2);
            user.removeFavRecipe(recipe);

            expect(user.getFavRecipes()).to.not.include(recipe);
        });

        it("returns false when given recipe isn't in list", function () {

            let recipeToRemove = new Recipe("Recipe2",
                [new Ingredient("Ingredient2", 20, "ml")], "Method",
                new Array<string>(), "IMG", "URL", 1, 1);

            user.addFavRecipe(recipe);
            user.addFavRecipe(recipe);

            expect(user.removeFavRecipe(recipeToRemove)).to.be.false;
        });

        it("returns false when list is empty", function () {

            expect(user.removeFavRecipe(recipe)).to.be.false;
        });
    });

    describe("addPastRecipe() method", function () {

        it("can add new recipe", function () {

            expectedRecipes.push(recipe);
            user.addPastRecipe(recipe);

            expect(user.getPastRecipes()).to.deep.equal(expectedRecipes);
        });

        it("doesn't add a past recipe if it already exists", function () {

            expectedRecipes.push(recipe);
            user.addPastRecipe(recipe);
            user.addPastRecipe(recipe);

            expect(user.getPastRecipes()).to.deep.equal(expectedRecipes);
        });

        it("adds past recipe when current number of recipes is " +
            "(Constants.MAX_PAST_RECIPE - 1)", function () {

                let recipesToAdd = buildRecipeList(
                    Constants.MAX_PAST_RECIPES - 1);
                let finalRecipe = new Recipe("Recipe10",
                    [new Ingredient("Ingredient10", 100, "ml")], "Method",
                    new Array<string>(), "IMG", "URL", 1, 1);

                expectedRecipes = expectedRecipes.concat(recipesToAdd);
                expectedRecipes.push(finalRecipe);
                for (let recipe of recipesToAdd) {

                    user.addPastRecipe(recipe);
                }

                expectedRecipes.reverse();
                user.addPastRecipe(finalRecipe);

                expect(user.getPastRecipes()).to.deep.equal(expectedRecipes);
            });

        it("adds past recipe when current number of recipes is " +
            "Constants.MAX_FAV_RECIPE", function () {

                let recipesToAdd = buildRecipeList(Constants.MAX_FAV_RECIPES);
                let finalRecipe = new Recipe("Recipe11",
                    [new Ingredient("Ingredient11", 110, "ml")], "Method",
                    new Array<string>(), "IMG", "URL", 1, 1);

                expectedRecipes = expectedRecipes.concat(recipesToAdd);
                for (let recipe of recipesToAdd) {

                    user.addPastRecipe(recipe);
                }

                expectedRecipes.push(finalRecipe);
                expectedRecipes.reverse();
                expectedRecipes.pop();

                user.addPastRecipe(finalRecipe);
                expect(user.getPastRecipes()).to.deep.equal(expectedRecipes);
            });

        it("adds past recipe to the beginning of the list of past " +
            "recipes", function () {

                let anotherRecipe = new Recipe("Recipe2",
                    [new Ingredient("Ingredient2", 20, "ml")], "Method",
                    new Array<string>(), "IMG", "URL", 1, 1);

                // order is reversed since Array.push() adds to end of array
                expectedRecipes.push(anotherRecipe);
                expectedRecipes.push(recipe);

                user.addPastRecipe(recipe);
                user.addPastRecipe(anotherRecipe);

                expect(user.getPastRecipes()[0]).to.be.equal(anotherRecipe);
            });

        it("removes the last current past when number of recipes is " +
            "(Constants.MAX_PAST_RECIPE)", function () {

                // buildRecipeList() function unsuitable here due to ordering
                let recipesToAdd = new Array<Recipe>();
                let pushedOutRecipe = new Recipe("Recipe1",
                    [new Ingredient("Ingredient1", 10, "ml")], "Method",
                    new Array<string>(), "IMG", "URL", 1, 1);
                recipesToAdd.push(pushedOutRecipe);
                recipesToAdd.push(new Recipe("Recipe2",
                    [new Ingredient("Ingredient2", 20, "ml")], "Method",
                    new Array<string>(), "IMG", "URL", 1, 1));
                recipesToAdd.push(new Recipe("Recipe3",
                    [new Ingredient("Ingredient3", 30, "ml")], "Method",
                    new Array<string>(), "IMG", "URL", 1, 1));
                recipesToAdd.push(new Recipe("Recipe4",
                    [new Ingredient("Ingredient4", 40, "ml")], "Method",
                    new Array<string>(), "IMG", "URL", 1, 1));
                recipesToAdd.push(new Recipe("Recipe5",
                    [new Ingredient("Ingredient5", 50, "ml")], "Method",
                    new Array<string>(), "IMG", "URL", 1, 1));
                recipesToAdd.push(new Recipe("Recipe6",
                    [new Ingredient("Ingredient6", 60, "ml")], "Method",
                    new Array<string>(), "IMG", "URL", 1, 1));
                recipesToAdd.push(new Recipe("Recipe7",
                    [new Ingredient("Ingredient7", 70, "ml")], "Method",
                    new Array<string>(), "IMG", "URL", 1, 1));
                recipesToAdd.push(new Recipe("Recipe8",
                    [new Ingredient("Ingredient8", 80, "ml")], "Method",
                    new Array<string>(), "IMG", "URL", 1, 1));
                recipesToAdd.push(new Recipe("Recipe9",
                    [new Ingredient("Ingredient9", 90, "ml")], "Method",
                    new Array<string>(), "IMG", "URL", 1, 1));
                recipesToAdd.push(new Recipe("Recipe10",
                    [new Ingredient("Ingredient10", 100, "ml")], "Method",
                    new Array<string>(), "IMG", "URL", 1, 1));
                let finalRecipe = new Recipe("Recipe11",
                    [new Ingredient("Ingredient11", 110, "ml")], "Method",
                    new Array<string>(), "IMG", "URL", 1, 1);

                for (let recipe of recipesToAdd) {

                    user.addPastRecipe(recipe);
                }

                user.addPastRecipe(finalRecipe);

                expect(user.getPastRecipes()).to.not.include(pushedOutRecipe);
            });
    });

    describe("removePastRecipe() method", function () {

        it("can remove a past recipe", function () {

            user.addPastRecipe(recipe);
            user.addPastRecipe(recipe2);
            user.removePastRecipe(recipe2);

            expect(user.getPastRecipes()).to.not.include(recipe2);
        });

        it("removes past recipe that is not last in list", function () {

            user.addPastRecipe(recipe);
            user.addPastRecipe(recipe2);
            user.removePastRecipe(recipe);

            expect(user.getPastRecipes()).to.not.include(recipe);
        });

        it("returns false when given recipe isn't in list", function () {

            let recipeToRemove = new Recipe("Recipe2",
                [new Ingredient("Ingredient2", 20, "ml")], "Method",
                new Array<string>(), "IMG", "URL", 1, 1);

            user.addPastRecipe(recipe);

            expect(user.removePastRecipe(recipeToRemove)).to.be.false;
        });

        it("returns false when list is empty", function () {

            expect(user.removePastRecipe(recipe)).to.be.false;
        });
    });

    describe("addAllergy() method", function () {

        it("can add an allergy", function () {

            let expectedAllergies = new Array<string>();
            expectedAllergies.push(testAllergy1);
            expectedAllergies.push(testAllergy2);

            user.addAllergy(testAllergy1);
            user.addAllergy(testAllergy2);

            expect(user.getAllergies()).to.deep.equal(expectedAllergies);
        });

        it("adds an allergy when list is empty", function () {

            let expectedAllergies = new Array<string>();
            expectedAllergies.push(testAllergy1);

            user.addAllergy(testAllergy1);

            expect(user.getAllergies()).to.deep.equal(expectedAllergies);
        });

        it("adds an allergy to the end of the list of allergies", function () {

            user.addAllergy(testAllergy1);
            user.addAllergy(testAllergy2);

            expect(user.getAllergies()[user.getAllergies().length - 1] ===
                testAllergy2).to.be.true;
        });

        it("does not add a duplicate allergy", function () {

            let expectedAllergies = new Array<string>();
            expectedAllergies.push(testAllergy1);

            user.addAllergy(testAllergy1);
            user.addAllergy(testAllergy1);

            expect(user.getAllergies()).to.deep.equal(expectedAllergies);
        });
    });

    describe("removeAllergy() method", function () {

        it("can remove an allergy", function () {

            let allergyToRemove = "Allergy1";

            user.addAllergy(allergyToRemove);
            user.removeAllergy(allergyToRemove);

            expect(user.getPastRecipes()).to.not.include(allergyToRemove);
        });

        it("returns false when allergy does not exist in list", function () {

            let allergy = "Allergy1";
            let allergyToRemove = "Allergy2";

            user.addAllergy(allergy);

            expect(user.removeAllergy(allergyToRemove)).to.be.false;
        });

        it("returns false when list is empty", function () {

            let allergy = "Allergy1";

            expect(user.removeAllergy(allergy)).to.be.false;
        });
    });

    describe("getName() method", function () {

        it("returns the user's name", function () {

            // an unregistered user's name defaults to 'user'
            let expectedName = "user";

            expect(user.getName()).to.equal(expectedName);
        });
    });

    describe("getIngredients() method", function () {

        it("returns a list of two ingredients", function () {

            expectedIngredients.push(testIngredient1);
            expectedIngredients.push(testIngredient2);
            user.addIngredient(testIngredient1);
            user.addIngredient(testIngredient2);

            expect(user.getIngredients()).to.deep.equal(expectedIngredients);
        });

        it("returns a list of one ingredient", function () {

            expectedIngredients.push(testIngredient1);
            user.addIngredient(testIngredient1);

            expect(user.getIngredients()).to.deep.equal(expectedIngredients);
        });

        it("returns a list of no ingredients", function () {

            expect(user.getIngredients())
                .to.deep.equal(new Array<Ingredient>());
        });

        it("does not expose the original list of ingredients", function () {

            expectedIngredients.push(testIngredient1);
            user.addIngredient(testIngredient1);
            user.addIngredient(testIngredient2);
            user.getIngredients().pop();

            expect(user.getIngredients()).to.include(testIngredient2);
        });
    });

    describe("getIngredientsAlphabetically() method", function () {

        it("returns all ingredient names in lower case", function () {

            user.addIngredient(testIngredient1);
            user.addIngredient(testIngredient2);
            let expected = "ingredient1,ingredient2";
            let notExpected = "Ingredient1,Ingredient2";

            expect(user.getIngredientsAlphabetically()).to.equal(expected);
            expect(user.getIngredientsAlphabetically())
                .to.not.equal(notExpected);
        });

        it("returns an alphabetically sorted list of ingredients", function () {

            let ingredient1 = new Ingredient("Apples", 3, "");
            let ingredient2 = new Ingredient("Zebras", 1, "");
            let ingredient3 = new Ingredient("Jam", 10, "mg");
            user.addIngredient(ingredient1);
            user.addIngredient(ingredient2);
            user.addIngredient(ingredient3);
            let expected = "apples,jam,zebras";

            expect(user.getIngredientsAlphabetically()).to.equal(expected);
        });

        it("can handle sorting when the first letter of two ingredient " +
            "names are identical", function () {

                let ingredient1 = new Ingredient("Cheese", 10, "mg");
                let ingredient2 = new Ingredient("Chalk", 100, "mg");
                user.addIngredient(ingredient1);
                user.addIngredient(ingredient2);
                let expected = "chalk,cheese";

                expect(user.getIngredientsAlphabetically()).to.equal(expected);
            });

        it("returns a list separated by commas", function () {

            user.addIngredient(testIngredient1);
            user.addIngredient(testIngredient2);
            let expected = "ingredient1,ingredient2";

            expect(user.getIngredientsAlphabetically()).to.equal(expected);
        });
    });

    describe("getFavRecipes() method", function () {

        it("returns an empty list of recipes correctly", function () {

            expect(user.getFavRecipes()).to.deep.equal(expectedRecipes);
        });

        it("returns a list of one recipe correctly", function () {

            expectedRecipes.push(recipe);
            user.addFavRecipe(recipe);

            expect(user.getFavRecipes()).to.deep.equal(expectedRecipes);
        });

        it("returns a list of two recipes correctly", function () {

            let recipes = buildRecipeList(2);

            expectedRecipes = expectedRecipes.concat(recipes);

            for (let recipe of recipes) {

                user.addFavRecipe(recipe);
            }

            expect(user.getFavRecipes()).to.deep.equal(expectedRecipes);
        });
    });

    describe("getPastRecipes() method", function () {

        it("returns an empty list of recipes correctly", function () {

            expect(user.getPastRecipes()).to.deep.equal(expectedRecipes);
        });

        it("returns a list of one recipe correctly", function () {

            expectedRecipes.push(recipe);
            user.addPastRecipe(recipe);

            expect(user.getPastRecipes()).to.deep.equal(expectedRecipes);
        });

        it("returns a list of two recipes correctly", function () {

            let recipes = buildRecipeList(2);

            expectedRecipes = expectedRecipes.concat(recipes);
            expectedRecipes.reverse();

            for (let recipe of recipes) {

                user.addPastRecipe(recipe);
            }

            expect(user.getPastRecipes()).to.deep.equal(expectedRecipes);
        });
    });

    describe("getAllergies() method", function () {

        it("returns an empty list of allergies correctly", function () {

            expect(user.getAllergies()).to.deep.equal(expectedAllergies);
        });

        it("returns a list of one allergy correctly", function () {

            let allergyToAdd = "Allergy1";

            expectedAllergies.push(allergyToAdd);
            user.addAllergy(allergyToAdd);

            expect(user.getAllergies()).to.deep.equal(expectedAllergies);
        });

        it("returns a list of two allergies correctly", function () {

            let allergy1 = "Allergy1";
            let allergy2 = "Allergy2";
            let allergies = new Array<string>();
            allergies.push(allergy1);
            allergies.push(allergy2);

            expectedAllergies = expectedAllergies.concat(allergies);

            for (let allergy of allergies) {

                user.addAllergy(allergy);
            }

            expect(user.getAllergies()).to.deep.equal(expectedAllergies);
        });
    });

    describe("canAddFavRecipe() method", function () {

        it("returns true when list of fav recipes is empty", function () {

            expect(user.canAddFavRecipe()).to.be.true;
        });

        it("returns true when length of fav recipes is one", function () {

            user.addFavRecipe(recipe);

            expect(user.canAddFavRecipe()).to.be.true;
        });

        it("returns true when length of fav recipes is two", function () {

            user.addFavRecipe(recipe);
            user.addFavRecipe(new Recipe("Recipe2",
                [new Ingredient("Ingredient2", 20, "ml")], "Method",
                new Array<string>(), "IMG", "URL", 1, 1));

            expect(user.canAddFavRecipe()).to.be.true;
        });

        it("returns false when list of fav recipes is of length " +
            "Constants.MAX_FAV_RECIPES", function () {

                let recipes = buildRecipeList(Constants.MAX_FAV_RECIPES);

                for (let recipe of recipes) {

                    user.addFavRecipe(recipe);
                }

                expect(user.canAddFavRecipe()).to.be.false;
            });
    });

    describe("getId() method", function () {

        it("returns a UUID", function () {

            expect(user.getId());
        });

        it("returns different UUIDs for different user objects", function () {

            let otherUser = new UnregisteredUser();

            expect(user.getId()).to.not.equal(otherUser.getId());
        });
    });
});

describe("Class RegisteredUser's", function () {

    // TODO: some tests to be written here when login functionality becomes a reality

    describe("getDob() method", function () {


    });

    describe("getEmail() method", function () {


    });

    describe("getFavColour() method", function () {


    });
});

function buildRecipeList(numberOfRecipes: number): Array<Recipe> {

    let recipesToAdd = new Array<Recipe>();

    for (let i = 0; i < numberOfRecipes; i++) {

        recipesToAdd.push(new Recipe("Recipe" + (i + 1).toString(),
            [new Ingredient("Ingredient" + (i + 1).toString(),
                10 * (i + 1),
                "ml")],
            "Method" + (i + 1).toString(),
            new Array<string>(), "IMG", "URL", 1, 1));
    }

    return recipesToAdd;
}
