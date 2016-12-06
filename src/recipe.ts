/** @author Matthew James <matthew.d.james87@gmail.com> */

import Ingredient from "./ingredient";
import { IRecipeAsJSON } from "./interfaces";

/** Immutable Recipe class maintains information about a particular recipe */
export default class Recipe {

    /*
     * Class invariant:
     *      this.name !== "" && this.name !== undefined
     *  &&  this.imageURL
     *  &&  this.sourceURL
     *  &&  this.ingredients.length > 0 && this.ingredient !== undefined
     *  &&  this.method === null --> instructions for recipe does not exist
     *          in the API
     *  &&  this.allergens !== undefined
     *  &&  this.servings && this.servings >= 0
     *  &&  this.servings === 0 --> no servings information provided
     *  &&  this.timeToMake && this.timeToMake >= 0
     *  &&  this.timeToMake === 0 --> no timeToMake information provided
     *  &&  Math.floor(this.timeToMake) === this.timeToMake
     */

    private name: string;  // always stored in lowercase

    // a URL for a moderately-sized image of the recipe
    private imageURL: string;

    // a URL to the original source of the recipe
    private sourceURL: string;

    // stores a list of Ingredient objects
    private ingredients: Array<Ingredient>;

    // stores a string detailing the method
    private method: string;

    // stores a list of allergens associated with the recipe
    private allergens: Array<string>;

    // stores the approximate number of servings
    private servings: number;

    // stores the time to make in seconds
    private timeToMake: number;

    // stores attribution details, if any, as simple text
    private attributionText: string;

    // TODO: consider whether HTML should be stored / used

    // stores attribution details, if any, as HTML
    private attributionHTML: string;

    /**
     * @constructor Constructor method for a Recipe. attributionText and
     * attributionHTML are optional parameters since some APIs do not provide
     * attribution requirements.
     *
     * @param name
     *      the name of the recipe
     * @param ingredients
     *      a list of ingredients involved in preparing the recipe
     * @param method
     *      the instructions of how to use this recipe
     * @param allergens
     *      a list of any allergens the recipe contains
     * @param source
     *      a URL to the webpage where the original recipe can be found
     * @param servings
     *      how many servings the recipe yields
     * @param timeToMake
     *      the length of time the recipe requires, in seconds
     * @param attributionText
     *      (optional) any attribution text required for crediting
     * @param attributionHTML
     *      (optional) any attribution HTML required for crediting
     */
    constructor(name: string, ingredients: Array<Ingredient>,
        method: string, allergens: Array<string>, imageURL: string,
        source: string, servings: number, timeToMake: number,
        attributionText?: string, attributionHTML?: string) {

        if (!name) {

            throw new TypeError("Recipe name must be defined");

        } else if (!ingredients) {

            throw new TypeError("Recipe ingredients must be defined");

        } else if (!allergens) {

            throw new TypeError("Recipe allergens must be defined");

        } else if (!imageURL) {

            throw new TypeError("Recipe imageURL must be defined");

        } else if (!source) {

            throw new TypeError("Recipe source must be defined");

        } else if (ingredients.length === 0) {

            throw new RangeError("Recipe must have at least one ingredient");

        } else if (servings === null || servings === undefined) {

            throw new TypeError("Recipe servings must be defined");

        } else if (servings < 0) {

            throw new RangeError("Recipe servings must be non-negative");

        } else if (timeToMake === null || timeToMake === undefined) {

            throw new TypeError("Recipe timeToMake must be defined");

        } else if (timeToMake < 0) {

            throw new RangeError("Recipe timeToMake must be non-negative");
        }

        this.name = name.toLowerCase();
        this.ingredients = ingredients;
        this.method = method;
        this.allergens = allergens;
        this.imageURL = imageURL;
        this.sourceURL = source;

        this.servings = servings;
        this.timeToMake = Math.floor(timeToMake);   // time always stored as int

        this.attributionText = attributionText;
        this.attributionHTML = attributionHTML;
    }

    /**
     * Method gets the name of the recipe in lowercase.
     *
     * @return the name of this recipe
     */
    public getName(): string {

        return this.name;
    }

    /**
     * Method gets the URL to an image of this recipe.
     *
     * @return a URL to the image of the recipe
     */
    public getImage(): string {

        return this.imageURL;
    }

    /**
     * Method gets the source URL (original website) of this recipe.
     *
     * @return the recipe's source URL
     */
    public getSourceURL(): string {

        return this.sourceURL;
    }

    /**
     * Method gets all ingredients involved in the recipe by value.
     *
     * @return the ingredients involved in this recipe
     */
    public getIngredients(): Array<Ingredient> {

        return new Array<Ingredient>().concat(this.ingredients);
    }

    /**
     * Method gets the method of the recipe.
     *
     * @return the method of this recipe
     */
    public getMethod(): string {

        return this.method;
    }

    /**
     * Method gets the allergens for the recipe by value.
     *
     * @return the allergens for the recipe
     */
    public getAllergens(): Array<string> {

        return new Array<string>().concat(this.allergens);
    }

    /**
     * Method returns the number of servings the recipe yields.
     *
     * @return how many servings the recipe yields
     */
    public getServings(): number {

        return this.servings;
    }

    /**
     * Method returns the time it takes to make this recipe, in seconds.
     *
     * @return the time to make this recipe in seconds
     */
    public getTimeToMake(): number {

        return this.timeToMake;
    }

    /**
     * Method returns the time it takes to make this recipe in a formatted
     * string. The string follows the format of [[x]x hr[s]] [y]y mins, where
     * '[]' indicate optional elements.
     *
     * @return the time to make this recipe as a formatted string
     */
    public getTimeToMakeFormatted(): string {

        let minutes = Math.floor(this.timeToMake / 60);
        let hours = Math.floor(minutes / 60);
        minutes -= hours * 60;

        let hourUnits = hours === 1 ? "hr" : "hrs";

        if (hours === 0) {

            return minutes + " mins";

        } else if (minutes === 0) {

            return hours + " " + hourUnits;

        } else {

            return hours + " " + hourUnits + " " + minutes + " mins";
        }
    }

    /**
     * Method gets the attribution text of the ingredient. If none exists, it
     * returns an empty string.
     *
     * @return attribution text of the recipe, if any
     */
    public getAttributionText(): string {

        return (this.attributionText !== undefined) ? this.attributionText : "";
    }

    /**
     * Method gets the attribution HTML of the ingredient. If none exists, it
     * returns an empty string.
     *
     * @return attribution text of the recipe, if any
     */
    public getAttributionHTML(): string {

        return (this.attributionHTML !== undefined) ? this.attributionHTML : "";
    }

    /**
     * Method returns the recipe in a JSON-formatted string, suitable for
     * passing a description capable of reconstructing this recipe over a
     * network.
     *
     * @return a JSON-formatted string representing this recipe
     */
    public toJSON(): string {

        return JSON.stringify(<IRecipeAsJSON>{

            name: this.name,
            ingredients: this.getIngredients().map(function (ingredient) {

                return ingredient.toJSON();
            }),
            method: this.method,
            allergens: this.allergens,
            imageURL: this.imageURL,
            sourceURL: this.sourceURL,
            servings: this.servings,
            timeToMake: this.timeToMake,
            attributionText: this.attributionText,
            attributionHTML: this.attributionHTML
        });
    }

    /** Method returns whether this recipe is equal to a given other recipe. */
    public equals(other: Object): boolean {

        // if the other object is not a Recipe, then it cannot equal this
        if (!(other instanceof Recipe)) {

            return false;
        }

        // cast to Recipe for further tests
        let otherRecipe = <Recipe>other;

        // TODO: should method be considered?

        /*
         * If the lengths of the ingredients lists are different, then the
         * recipes cannot be the same. This also makes the following check
         * sturdier.
         */
        if (this.ingredients.length !== otherRecipe.getIngredients().length) {

            return false;
        }

        /*
         * If any of the ingredients for the recipes are different, then the
         * recipes are not equal.
         */
        for (let ingredient of this.ingredients) {

            if (otherRecipe.getIngredients().filter((i) => i.getName() ===
                ingredient.getName()).length === 0) {

                return false;
            }
        }

        return true;
    }

    public hashCode(): number {

        let p1 = 19;
        let result = 21;

        for (let ingredient of this.ingredients) {

            result += p1 * ingredient.hashCode();
        }

        return result;
    }

    /**
     * Method checks the class invariant. This is intended to be used
     * for debugging and testing only.
     */
    public checkInvariant(): boolean {

        if (this.name === "" || this.name === undefined) {

            console.log("Recipe name must be defined");

            return false;
        }

        if (this.ingredients === undefined ||
            this.ingredients.length === 0) {

            console.log("Recipe ingredients must be defined and more than 0");

            return false;
        }

        if (this.allergens === undefined) {

            console.log("Recipe allergens must be defined");

            return false;
        }

        if (!this.imageURL) {

            console.log("Recipe imageURL must be defined");

            return false;
        }

        if (!this.sourceURL) {

            console.log("Recipe sourceURL must be defined");

            return false;
        }

        if (this.servings < 0) {

            console.log("Recipe servings must be a non-negative value");

            return false;
        }

        if (this.timeToMake < 0) {

            console.log("Recipe time to make must be a non-negative value");

            return false;
        }

        return true;
    }
}
