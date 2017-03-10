import Recipe from "./recipe";
import Ingredient from "./ingredient";
import { Constants } from "./constants";
import Utils from "./utils";

/**
 * @class Sorter handles sorting recipe results by interpreting the
 * user's sort parameters and invokes a sort method of the appropriate
 * helper class.
 */
export default class Sorter {

    /**
     * Method takes as input an array of recipes, an array of the user's owned
     * ingredients, a sortCriteria, a sortOrder and returns the given recipes
     * according to the given criteria and order. The method does not guarantee
     * consistent ordering where recipes are deemed equal according to
     * sortCriteria.
     *
     * @require recipes
     *  &&  userIngredients && userIngredients.length() > 0
     *  &&  (sortCriteria === Constants.SORT_BY_RELEVANCE ||
     *          sortCriteria === Constants.SORT_BY_TIME ||
     *          sortCriteria === Constants.SORT_BY_SERVINGS)
     *  &&  (sortOrder === Constants.SORT_ASCENDING ||
     *          sortOrder === Constants.SORT_DESCENDING)
     *
     * @ensure for each recipe i in recipes, there exists recipe j in \result
     *      such that i.equals(j)
     *  &&  for each recipe j in \result,
     *      sortOrder === Constants.SORT_ASCENDING --> j <= (j + 1) according
     *          to sortCriteria,
     *  &&  sortOrder === Constants.SORT_DESCENDING --> j >= (j + 1) according
     *          to sortCriteria
     *
     * @param recipes
     *      the array of Recipe objects to be sorted
     * @param sortCriteria
     *      the criteria by which the recipes are to be sorted
     * @param sortOrder
     *      the order in which the recipes are to be sorted
     * @param userIngredients
     *      the ingredients the user owns
     *
     * @return the given recipes sorted using given criteria and order
     *
     * @throws RangeError
     *      if sortCriteria or sortOrder are not a valid input according to
     *      Constants
     */
    public static sort(recipes: Array<Recipe>,
        userIngredients: Array<Ingredient>, sortCriteria: string,
        sortOrder: string): Array<Recipe> {

        // checks that the sort criteria is recognised here
        if ((sortCriteria !== Constants.SORT_BY_RELEVANCE) &&
            (sortCriteria !== Constants.SORT_BY_TIME_TAKEN) &&
            (sortCriteria !== Constants.SORT_BY_SERVINGS)) {

            throw new RangeError("Unrecognised sortCriteria");
        }

        // checks that the sort order is recognised here
        if ((sortOrder !== Constants.SORT_ASCENDING) &&
            (sortOrder !== Constants.SORT_DESCENDING)) {

            throw new RangeError("Unrecognised sortOrder");
        }

        let sortedRecipes: Array<Recipe>;

        if (sortCriteria === Constants.SORT_BY_RELEVANCE) {

            sortedRecipes = recipes.sort(function (a, b): number {

                return RelevanceSorter.compare(a, b, userIngredients);
            });

        } else if (sortCriteria === Constants.SORT_BY_TIME_TAKEN) {

            sortedRecipes = recipes.sort(TimeSorter.compare);

        } else if (sortCriteria === Constants.SORT_BY_SERVINGS) {

            sortedRecipes = recipes.sort(ServingsSorter.compare);
        }

        if (sortOrder === Constants.SORT_DESCENDING) {

            return sortedRecipes.reverse();

        } else {

            return sortedRecipes;
        }
    }

    protected static compare(a: Recipe, b: Recipe,
        userIngredients?: Array<Ingredient>): number {

        throw new Error("Unimplemented method");
    }
}

/** @class Subclass handles sorting by relevance. */
class RelevanceSorter extends Sorter {

    /**
     * Method takes as input recipes a, b, and the ingredients owned by the
     * user. It returns the comparative relation between a and b based on
     * relevance criteria computed using userIngredients.
     *
     * @require a && b && userIngredients
     *
     * @ensure (recipe a contains more missed ingredients than recipe b -->
     *          \result === -1)
     *  ||  (recipe a contains fewer missed ingredients than b -->
     *          \result === 1)
     *  ||  (recipes contain the same number of missed ingredients -->
     *          \result === 0)
     *
     * @param a
     *      the first recipe
     * @param b
     *      the second recipe to be compared to
     * @param userIngredients
     *      the ingredients the user owns
     *
     * @return the comparative relation between a and b
     */
    public static compare(a: Recipe, b: Recipe,
        userIngredients: Array<Ingredient>): number {

        // the number of no matched ingredient in a and b
        let countA = 0;
        let countB = 0;

        // iterates through all the ingredients in recipe a
        for (let recipeIngredient of a.getIngredients()) {

            /*
             * If no user ingredients loosely match this recipe ingredient,
             * increments countA to register the lack of match.
             */
            if (userIngredients.filter((ingredient) => ingredient.softEquals(
                recipeIngredient)).length === 0) {

                countA += 1;
            }
        }

        // iterates through all the ingredients in recipe b
        for (let recipeIngredient of b.getIngredients()) {

            /*
             * If no user ingredients loosely match this recipe ingredient,
             * increments countB to register the lack of match.
             */
            if (userIngredients.filter((ingredient) => ingredient.softEquals(
                recipeIngredient)).length === 0) {

                countB += 1;
            }
        }

        /*
         * If the counts are equal, return 0. Note: if countA is less than
         * countB, this means recipe A is more relevant. To give ascending
         * order, if countA < countB, returns 1; otherwise, it returns -1.
         */
        if (countA === countB) {

            return 0;

        } else if (countA < countB) {

            return 1;

        } else {

            return -1;
        }
    }
}

/** @class Subclass handles sorting by time. */
class TimeSorter extends Sorter {

    /**
     * Method takes as input recipes a and b. It returns the comparative
     * relation between a and b based on the amount of time each recipe takes
     * to make.
     *
     * @param a
     *      the first recipe
     * @param b
     *      the second recipe to be compared to
     *
     * @return the comparative relation between a and b
     */
    public static compare(a: Recipe, b: Recipe): number {

        return Utils.compareAmounts(a.getTimeToMake(), b.getTimeToMake());
    }
}

/** @class Subclass handles sorting by number of servings. */
class ServingsSorter extends Sorter {

    /**
     * Method takes as input recipes a and b. It returns the comparative
     * relation between a and b based on the number of servings the recipe
     * yields.
     *
     * @param a
     *      the first recipe
     * @param b
     *      the second recipe to be compared to
     * @param userIngredients
     *      the ingredients the user owns
     *
     * @return the comparative relation between a and b
     */
    public static compare(a: Recipe, b: Recipe): number {

        return Utils.compareAmounts(a.getServings(), b.getServings());
    }
}
