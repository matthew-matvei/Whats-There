/** @author Matthew James <matthew.d.james87@gmail.com> */

import Ingredient from "./ingredient";
import { IRecipeAsJSON } from "./interfaces";

/** Immutable Recipe class maintains information about a particular recipe */
export default class Recipe {

    /*
     * Class invariant:
     *      this.name !== "" && this.name !== undefined
     *  &&  this.image === null --> image for the recipe does not yet exist
     *  &&  this.ingredients.length > 0 && this.ingredient !== undefined
     *  &&  this.method === null --> instructions for recipe does not exist
     *          in the API
     *  &&  this.allergens !== undefined
     */

    private name: string;  // always stored in lowercase

    private id: string; // determined by the recipe id from an API

    /*
     * Note: image may change. Since class is immutable, image must not be
     * required
     */
    private image: Blob;

    private sourceURL: string;

    // stores a list of Ingredient objects
    private ingredients: Array<Ingredient>;

    // stores a string detailing the method
    private method: string;

    // stores a list of allergens associated with the recipe
    private allergens: Array<string>;

    constructor(name: string, ingredients: Array<Ingredient>,
        method: string, allergens: Array<string>, source: string) {

        if (name === "" || !name) {

            throw new TypeError("Recipe name must be defined");

        } else if (!ingredients) {

            throw new TypeError("Recipe ingredients must be defined");

        } else if (!allergens) {

            throw new TypeError("Recipe allergens must be defined");

        } else if (source === "" || !source) {

            throw new TypeError("Recipe source must be defined");

        } else if (ingredients.length === 0) {

            throw new RangeError("Recipe must have at least one ingredient");
        }

        this.name = name.toLowerCase();
        this.ingredients = ingredients;
        this.method = method;
        this.allergens = allergens;
        this.sourceURL = source;

        this.image = null;  // image defaults to null until file is gotten
    }

    /**
     * Method gets the name of the recipe in lowercase.
     *
     * @require this.name !== "" && this.name !== undefined
     *
     * @return the name of this recipe
     */
    public getName(): string {

        return this.name;
    }

    /**
     * Method gets an image of the recipe as a Blob object.
     *
     * @return an image of the recipe
     */
    public getImage(): Blob {

        return new Blob();
    }

    /**
     * Method gets all ingredients involved in the recipe by value.
     *
     * @require this.ingredients !== undefined && this.ingredients.length > 0
     *
     * @return the ingredients involved in this recipe
     */
    public getIngredients(): Array<Ingredient> {

        return new Array<Ingredient>().concat(this.ingredients);
    }

    /**
     * Method gets the method of the recipe.
     *
     * @require this.method !== "" && this.method !== undefined
     *
     * @return the method of this recipe
     */
    public getMethod(): string {

        return this.method;
    }

    /** Method gets the allergens for the recipe by value. */
    public getAllergens(): Array<string> {

        return new Array<string>().concat(this.allergens);
    }

    /**
     * Method takes as input the recipe image as a Blob object and uses it to
     * set this.image. Until this image is set, a default image is provided in
     * the application.
     *
     * @param image
     *      the recipe image
     */
    public setImage(image: Blob): void {

        this.image = image;
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

            name: this.getName(),
            ingredients: this.getIngredients().map(function (ingredient) {

                return ingredient.toJSON();
            }),
            method: this.getMethod(),
            allergens: this.getAllergens(),
            sourceURL: this.sourceURL
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

        return true;
    }
}