import Recipe from "./recipe";
import Ingredient from "./ingredient";
import { IRecipeAsJSON, IIngredientAsJSON } from "./interfaces";

/**
 * @classdesc Utils provides several static convenience functions to be used
 * throughout the application.
 */
export default class Utils {

    /**
     * Entry-point method handles identifying and calling the appropriate
     * hash function depending on the type of the given obj.
     *
     * Note: method can currently handle (typeof obj == "string") and
     * (typeof obj == "number")
     *
     * @param obj
     *      any obj, see Note regarding which types are currently supported
     *
     * @return the hashCode of the given obj
     */
    public static hash(obj: any): number {

        if (typeof obj === "string") {

            let objAsString = <string>obj;
            return this.hashString(objAsString);

        } else if (typeof obj === "number") {

            let objAsNumber = <number>obj;
            return this.hashNumber(objAsNumber);

        } else {

            return 0;
        }
    }

    /**
     * Method takes as input a recipe definition as string and returns a
     * Recipe constructed according to the provided definition. This is used
     * to effectively transmit Recipe objects from the server to client.
     *
     * @require for recipe = <IRecipeAsJSON>JSON.parse(definition)
     *
     *      && recipe.name
     *
     *      && for i in recipe.ingredients, this.parseIngredient(i) succeeds
     *
     *      && recipe.ingredients.length > 0
     *
     *      && recipe.sourceURL
     *
     * @param definition
     *      a JSON-formatted string that describes the recipe to be created
     *
     * @return a recipe created according to the given definition
     */
    public static parseRecipe(definition: string): Recipe {

        let recipe = <IRecipeAsJSON>JSON.parse(definition);

        let thisUtil = this;
        let ingredients = recipe.ingredients.map(function (ingredient) {

            return thisUtil.parseIngredient(ingredient);
        });

        return new Recipe(recipe.name, ingredients, recipe.method,
            recipe.allergens, recipe.imageURL, recipe.sourceURL,
            recipe.servings, recipe.timeToMake, recipe.attributionText,
            recipe.attributionHTML);
    }

    /**
     * Method takes as input non-negative numbers a, b, and returns the
     * comparative relation between them. Method handles amounts equal to zero
     * differently, in order to satisfy specific requirements.
     *
     * @require a !== null && a !== undefined && a >= 0
     *  &&  b !== null && b !== undefined && b >= 0
     *
     * @ensure (a === 0 && b === 0 --> \result === 0)
     *  ||  (a === 0 && b > 0 --> \result === 1)
     *  ||  (a > 0 && b === 0 --> \result === -1)
     *  ||  (a < b --> \result === -1)
     *  ||  (a > b --> \result === 1)
     *  ||  (a === b --> \result === 0)
     *
     * @param a
     *      the first number
     * @param b
     *      the number to compare to
     *
     * @return the comparative relation between a and b
     */
    public static compareAmounts(a: number, b: number): number {

        /*
         * Initially checks for and handles cases where either a or b are equal
         * to 0. Since 0 is interpreted as no information is available, 0 is not
         * simply 'less than' 1.
         */
        if (a === 0 && b === 0) {

            return 0;

        } else if (a === 0 && b > 0) {

            return 1;

        } else if (a > 0 && b === 0) {

            return -1;
        }

        // no 0's detected, values can be compared regularly
        if (a === b) {

            return 0;

        } else if (a < b) {

            return -1;

        } else {

            return 1;
        }
    }

    /**
     * Method takes as input an ingredient definition as string and returns an
     * Ingredient constructed according to the provided definition. This is used
     * to effectively embed ingredient objects within Recipe definitions, which
     * are then transmitted from server to client.
     *
     * @require for ingredient = <IIngredientAsJSON>JSON.parse(definition)
     *
     *      && ingredient.name
     *
     *      && ingredient.volume && ingredient.volume > 0
     *
     * @param definition
     *      a JSON-formatted string that describes the recipe to be created
     *
     * @return a recipe created according to the given definition
     */
    private static parseIngredient(definition: string): Ingredient {

        let ingredient = <IIngredientAsJSON>JSON.parse(definition);

        return new Ingredient(ingredient.name, ingredient.volume,
            ingredient.volumeType);
    }

    /**
     * Method takes as input a string and returns its hash code. The hash is
     * computed using a Java-style algorithm.
     *
     * @param word
     *      any string whose hash code is to be computed
     *
     * @return a hash code for the given word
     */
    private static hashString(word: string): number {

        /*
         * Implements Java-style string hashing. See:
         *      http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
         */

        let hash = 0;
        if (word.length === 0) {

            return hash;
        }

        for (let i = 0; i < word.length; i++) {

            let c = word.charCodeAt(i);
            hash = ((hash << 5) - hash) + c;
            hash = hash & hash;
        }

        return hash;
    }

    /**
     * Method takes as input a number value and returns its hash code.
     *
     * @param value
     *      a number whose hash code is to be computed
     *
     * @return a simple hash code for the given value
     */
    private static hashNumber(value: number): number {

        let p1 = 19;

        return Math.floor(value * p1);
    }
}
