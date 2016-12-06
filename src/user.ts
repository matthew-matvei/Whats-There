/// <reference path="../typings/globals/uuid/index.d.ts" />

/** @author Matthew James <matthew.d.james87@gmail.com> */

import Recipe from "./recipe";
import Ingredient from "./ingredient";
import Constants from "./constants";

let uuid = require("uuid");

/**
 * Abstract class User stores basic user information. A User may be a registered
 * user or an unregistered user.
 *
 * @abstract
 * @class User
 */
export abstract class User {

    /*
     * Class Invariant:
     *      this.name !== "" && this.name !== undefined
     *  &&  this.ingredients !== undefined
     *  &&  this.favRecipes !== undefined
     *  &&  this.favRecipes[i] <= this.favRecipes[i + 1] alphabetically
     *  &&  this.favRecipes.length <= Constants.MAX_FAV_RECIPES
     *  &&  this.pastRecipes !== undefined
     *  &&  this.pastRecipes.length <= Constants.MAX_PAST_RECIPES
     *  &&  this.allergies !== undefined
     */

    /**
     * Always stored in lower case
     *
     * @private
     * @type {string}
     * @memberOf User
     */
    private name: string;  // always stored in lower case

    /**
     * Stores the ingredients the user has, if any.
     *
     * @private
     * @type {Array<Ingredient>}
     * @memberOf User
     */
    private ingredients: Array<Ingredient>;

    /**
     * Stores the user's MAX_FAV_RECIPES favourite recipes alphabetically.
     *
     * @private
     * @type {Array<Recipe>}
     * @memberOf User
     */
    private favRecipes: Array<Recipe>;

    /**
     * Stores the user's MAX_PAST_RECIPES recent recipes.
     *
     * @private
     * @type {Array<Recipe>}
     * @memberOf User
     */
    private pastRecipes: Array<Recipe>;

    /**
     * Stores the user's allergies.
     *
     * @private
     * @type {Array<string>}
     * @memberOf User
     */
    private allergies: Array<string>;

    /**
     * Creates an instance of User.
     *
     * @param name
     *      the user's name
     * @param ingredients
     *      a list of any ingredients that the user has
     * @param favRecipes
     *      a list of the user's favourite recipes, in alphabetical order
     * @param pastRecipes
     *      a list of the user's past recipes, from most recent to least
     * @param allergies
     *      a list of the user's allergies, if any
     */
    constructor(name: string, ingredients: Array<Ingredient>,
        favRecipes: Array<Recipe>, pastRecipes: Array<Recipe>,
        allergies: Array<string>) {

        // following checks validity of given parameters
        if (name === "" || !name) {

            throw new TypeError("Name must be defined");

        } else if (!ingredients) {

            throw new TypeError("Ingredients must be defined");

        } else if (!favRecipes) {

            throw new TypeError("Favourite recipes must be defined");

        } else if (!pastRecipes) {

            throw new TypeError("Past recipes must be defined");

        } else if (!allergies) {

            throw new TypeError("Allergies must be defined");

        } else if (favRecipes.length > Constants.MAX_FAV_RECIPES) {

            throw new RangeError("Illegal number of favourite recipes");

        } else if (pastRecipes.length > Constants.MAX_PAST_RECIPES) {

            throw new RangeError("Illegal number of past recipes");
        }

        this.name = name.toLowerCase();
        this.ingredients = ingredients;
        this.favRecipes = favRecipes;
        this.pastRecipes = pastRecipes;
        this.allergies = allergies;
    }

    /**
     * Method adds an ingredient to the user's list of ingredients. If the
     * given ingredient already exists in the list, the method does nothing.
     *
     * @param ingredient
     *      the ingredient to be added to the user's list
     */
    public addIngredient(ingredient: Ingredient): void {

        /*
         * If the length of an array returned by filtering this.ingredient[i]
         * where this.ingredient[i].equals(ingredient) is greater than 0, given
         * ingredient already exists, so method returns.
         */
        if (this.ingredients.filter((i) => i.equals(ingredient)).length > 0) {

            return;
        }

        this.ingredients.push(ingredient);
    }

    /**
     * Method removes an ingredient from the user's list of ingredients. If
     * it is not found, the method just returns false.
     *
     * @param ingredient
     *
     * @return
     */
    public removeIngredient(ingredient: Ingredient): boolean {

        let index: number;
        if ((index = this.ingredients.findIndex(
            (i: Recipe) => i.equals(ingredient))) < 0) {

            return false;

        } else {

            this.ingredients.splice(index, 1);

            return true;
        }
    }

    /**
     * Method adds a recipe to the user's list of favourite recipes and ensures
     * the list maintains an alphabetical ordering. If the given recipe already
     * exists in the list, the method does nothing.
     *
     * @require this.favRecipes.length < Constants.MAX_FAV_RECIPES
     *
     * @ensure this.favRecipes[i] <= this.favRecipes[i + 1]
     *
     * @param recipe
     *      the recipe to be added to the user's list of favourite recipes
     */
    public addFavRecipe(recipe: Recipe): void {

        /*
         * If the length of an array returned by filtering this.favRecipes
         * where this.favRecipes[i].equals(recipe) is greater than 0, given
         * recipe already exists, so method returns.
         */
        if (this.favRecipes.filter((i) => i.equals(recipe)).length > 0) {

            return;
        }

        this.favRecipes.push(recipe);
        this.favRecipes.sort();
    }

    /**
     * Method removes a recipe from the user's list of favourite recipes. If
     * the recipe is not found, the method just returns false.
     *
     * @param recipe
     * @return
     */
    public removeFavRecipe(recipe: Recipe): boolean {

        if (this.favRecipes.length === 0) {

            return false;
        }

        let index: number;
        if ((index = this.favRecipes.findIndex(
            (i: Recipe) => i.equals(recipe))) < 0) {

            return false;

        } else {

            this.favRecipes.splice(index, 1);

            return true;
        }
    }

    /**
     * Method adds a recipe to the start of the user's list of recent
     * recipes. If  the user already has a number of recipes equal to
     * MAX_PAST_RECIPES, method removes the last recipe and adds the new one.
     *
     * @param recipe
     */
    public addPastRecipe(recipe: Recipe): void {

        /*
         * If the length of an array returned by filtering this.pastRecipes
         * where this.pastRecipes[i].equals(recipe) is greater than 0, given
         * recipe already exists, so method returns.
         */
        if (this.pastRecipes.filter((i) => i.equals(recipe)).length > 0) {

            return;
        }

        // since length of past recipes is limited, pops if length is equal max
        if (this.pastRecipes.length === Constants.MAX_PAST_RECIPES) {

            this.pastRecipes.pop();
        }

        this.pastRecipes.unshift(recipe);
    }

    /**
     * Method removes a recipe from the user's list of past recipes. If
     * the recipe is not found, the method just returns false.
     *
     * @param recipe
     *      the recipe to be removed from the user's list of past recipes
     *
     * @return
     */
    public removePastRecipe(recipe: Recipe): boolean {

        let index: number;
        if ((index = this.pastRecipes.findIndex(
            (i: Recipe) => i.equals(recipe))) < 0) {

            return false;

        } else {

            this.pastRecipes.splice(index, 1);

            return true;
        }
    }

    /**
     * Method adds an allergy, represented as a string, to the user's
     * list of allergies. User's list of allergies has no limit regarding
     * length. If list of allergies contains given allergy, method does
     * nothing.
     *
     * @param allergyName
     *      the name of the allergy to be added
     */
    public addAllergy(allergyName: string): void {

        /*
         * If the length of an array returned by filtering this.allergies
         * where this.allergies[i].equals(allergyName) is greater than 0, given
         * allergy already exists, so method returns.
         */
        if (this.allergies.filter((i) => i === allergyName).length > 0) {

            return;
        }

        this.allergies.push(allergyName);
    }

    /**
     * Method removes an allergy from the user's list of allergies. If
     * the allergy is not found, the method just returns false.
     *
     * @param allergyName
     *      the name of the allergy to be removed
     *
     * @return
     */
    public removeAllergy(allergyName: string): boolean {

        let index: number;
        if (this.allergies.findIndex((i: string) => i === allergyName) < 0) {

            return false;

        } else {

            this.allergies.splice(index, 1);

            return true;
        }
    }

    /**
     * Method gets the user's name.
     *
     * @require this.name !== "" && this.name !== undefined
     *
     * @return
     */
    public getName(): string {

        return this.name;
    }

    /**
     * Method gets user's list of ingredients by value.
     *
     * @require this.ingredients
     *
     * @return user's ingredients
     */
    public getIngredients(): Array<Ingredient> {

        return new Array<Ingredient>().concat(this.ingredients);
    }

    /**
     * Method returns a list of ingredient names in a comma-separated list,
     * sorted alphabetically, as a string. All ingredient names are lowercase.
     *
     * @ensure for each ingredient name i, i === i.toLowerCase()
     *
     *      &&  i <= (i + 1)
     *
     *      &&  list is comma-separated with no spaces
     *
     * @return a comma-separated list of ingredients the user has
     */
    public getIngredientsAlphabetically(): string {

        return this.getIngredients().map(function(ingredient) {

            return ingredient.getName();

        }).sort().join(",");
    }

    /**
     * Method gets user's favourite recipes by value.
     *
     * @require this.favRecipes
     *
     * @return
     */
    public getFavRecipes(): Array<Recipe> {

        return new Array<Recipe>().concat(this.favRecipes);
    }

    /**
     * Method gets user's past recipes by value.
     *
     * @require this.pastRecipes
     *
     * @return
     */
    public getPastRecipes(): Array<Recipe> {

        return new Array<Recipe>().concat(this.pastRecipes);
    }

    /**
     * Method gets the user's allergies by value.
     *
     * @require this.allergies
     *
     * @return
     */
    public getAllergies(): Array<string> {

        return new Array<string>().concat(this.allergies);
    }

    /**
     * Method returns whether it is possible to add a favourite recipe.
     *
     * @return
     */
    public canAddFavRecipe(): boolean {

        if (this.favRecipes.length < Constants.MAX_FAV_RECIPES) {

            return true;

        } else {

            return false;
        }
    }

    /**
     * Method checks the class invariant. This is intended to be used
     * for debugging and testing only.
     *
     * @return
     */
    public checkInvariant(): boolean {

        if (this.favRecipes === undefined) {

            console.log("User favRecipes must be defined");

            return false;
        }

        if (this.ingredients === undefined) {

            console.log("User ingredients must be defined");

            return false;
        }

        for (let i = 0; i < this.favRecipes.length - 1; i++) {

            // TODO: check alphabetical string comparison
            if (this.favRecipes[i] > this.favRecipes[i + 1]) {

                console.log("User favRecipes must be sorted alphabetically");

                return false;
            }
        }

        if (this.pastRecipes === undefined) {

            console.log("User pastRecipes must be defined");

            return false;
        }

        if (this.allergies === undefined) {

            console.log("User allergies must be defined");

            return false;
        }

        return true;
    }
}

/**
 * @classdesc RegisteredUser stores infor about a user in the context of this
 * application.
 *
 * @class RegisteredUser
 * @extends {User}
 */
export class RegisteredUser extends User {

    /*
     * Class Invariant:
     *      super.checkInvariant() === true
     *  &&  this.dob represents a date in the past
     *  &&  this.email !== "" && this.email !== undefined
     *  &&  this.favColour !== "" && this.favColour !== undefined
     */

    // stores the user's public details
    private dob: Date;  // TODO: consider if relevant
    private email: string;
    private favColour: string;  // used for colour scheme

    /**
     * Creates an instance of RegisteredUser.
     *
     * @param name
     */
    constructor(name: string, ingredients: Array<Ingredient>,
        favRecipes: Array<Recipe>, pastRecipes: Array<Recipe>,
        allergens: Array<string>) {

        super(name, new Array<Ingredient>(), new Array<Recipe>(),
            new Array<Recipe>(), new Array<string>());
    }

    /**
     * Method gets the user's date of birth.
     *
     * @return the user's DOB
     */
    public getDob(): Date {

        return new Date();
    }

    /**
     * Method gets the user's email.
     *
     * @return the email address of the user
     */
    public getEmail(): string {

        return "";
    }

    /**
     * Method gets user's favourite colour.
     *
     * @return the user's favourite colour
     */
    public getFavColour(): string {

        return "";
    }
}

/**
 * @classdesc UnregisteredUser stores info about a user in the context of this
 * application.
 *
 * @class UnregisteredUser
 * @extends {User}
 */
export class UnregisteredUser extends User {

    /*
     * Class Invariant:
     *      super.checkInvariant() === true
     *  &&  this.name === "user"
     *  &&  this.id && this.id is a globally unique ID for the DB
     */

    // since this user type has no unique email, they require a unique id
    private id: string;

    /**
     * Creates an instance of UnregisteredUser.
     */
    constructor() {

        // any unregistered user has the name 'user'
        let defaultName = "user";

        // any unregistered user has an empty list of ingredients and recipes
        super(defaultName, new Array<Ingredient>(), new Array<Recipe>(),
            new Array<Recipe>(), new Array<string>());

        // any unregistered user must have a UUID
        this.id = uuid.v1();
    }

    /**
     * Method returns the user's UUID.
     *
     * @return the user's ID
     */
    public getId(): string {

        return this.id;
    }

    /**
     * Method checks the class invariant. This is intended to be used
     * for debugging and testing only.
     *
     * @return whether the class' invariant holds or not
     */
    public checkInvariant(): boolean {

        if (!super.checkInvariant()) {

            return false;
        }

        if (this.getName() !== "user") {

            return false;
        }

        if (!this.id) {

            return false;
        }

        return true;
    }
}
